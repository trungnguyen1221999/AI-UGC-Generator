import { generateProductVideo } from './../services/ai.service';
import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { CreateProjectBody, UploadedFile } from '../types/project.types';
import { PROJECT_CREDIT_COST, MIN_IMAGES_REQUIRED } from '../constants/ai.constants';
import { uploadFilesToCloudinary, uploadBufferToCloudinary } from '../utils/image.utils';
import { generateProductImage, generateProductVideo } from '../services/ai.service';

// ─── Create Project ───────────────────────────────────────────────────────────

export const createProject = async (req: Request, res: Response) => {
  // Track rollback state — used in catch block to undo side effects
  // Theo dõi trạng thái để rollback nếu có lỗi giữa chừng
  let isCreditDeducted = false;
  let tempProjectId = '';

  try {
    // ── 1. Auth check | Kiểm tra xác thực ──────────────────────────────────
    const { userId } = req.auth();
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // ── 2. User check | Kiểm tra user tồn tại ──────────────────────────────
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ── 3. Credit check | Kiểm tra đủ credit ───────────────────────────────
    if (user.credits < PROJECT_CREDIT_COST) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    // ── 4. File validation | Kiểm tra số lượng ảnh upload ──────────────────
    const images = req.files as UploadedFile[];
    if (!images || images.length < MIN_IMAGES_REQUIRED) {
      return res.status(400).json({
        message: `Please upload at least ${MIN_IMAGES_REQUIRED} images`,
      });
    }

    // ── 5. Parse request body | Lấy dữ liệu từ request body ────────────────
    const {
      name = 'New Project',
      productName,
      productDescription,
      userPrompt = '',
      aspectRatio = '9:16',
      targetLength = 5,
    } = req.body as CreateProjectBody;

    // ── 6. Deduct credits | Trừ credit trước khi bắt đầu generate ──────────
    // Deduct first to prevent concurrent generation abuse
    // Trừ trước để tránh user gửi nhiều request đồng thời
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: PROJECT_CREDIT_COST } },
    });
    isCreditDeducted = true;

    // ── 7. Upload input images to Cloudinary | Upload ảnh đầu vào ──────────
    // Store original images so user can review what was submitted
    // Lưu ảnh gốc để user xem lại những gì đã upload
    const uploadedImages = await uploadFilesToCloudinary(images);

    // ── 8. Create project record | Tạo project trong DB ────────────────────
    // Set isGenerating: true so frontend can show a loading state
    // Đặt isGenerating: true để frontend biết đang xử lý
    const project = await prisma.project.create({
      data: {
        userId,
        name,
        productName,
        productDescription,
        userPrompt,
        aspectRatio,
        targetLength: parseInt(String(targetLength)),
        uploadedImages,
        isGenerating: true,
      },
    });
    tempProjectId = project.id;

    // ── 9. Generate image via AI | Gọi AI để generate ảnh ──────────────────
    // personImage = first upload, productImage = second upload
    // Ảnh đầu tiên là người, ảnh thứ hai là sản phẩm
    const imageBuffer = await generateProductImage(
      images[0],
      images[1],
      userPrompt,
      aspectRatio
    );

    // ── 10. Upload generated image | Upload ảnh AI vừa tạo ra ──────────────
    const generatedImageUrl = await uploadBufferToCloudinary(imageBuffer);

    // ── 11. Save result to DB | Lưu kết quả vào DB ─────────────────────────
    const updatedProject = await prisma.project.update({
      where: { id: project.id },
      data: {
        generatedImage: generatedImageUrl,
        isGenerating: false,
      },
    });

    return res.status(201).json({ project: updatedProject });

  } catch (error: any) {
    // ── Rollback | Hoàn tác các side effect nếu có lỗi ─────────────────────

    if (tempProjectId) {
      // Mark project as failed so frontend can show error state
      // Đánh dấu project lỗi để frontend hiển thị trạng thái thất bại
      await prisma.project.update({
        where: { id: tempProjectId },
        data: { isGenerating: false, error: error.message },
      }).catch(() => {}); // Silently ignore — DB might be down
    }

    if (isCreditDeducted) {
      // Refund credits if generation failed after deduction
      // Hoàn trả credit nếu generate thất bại sau khi đã trừ
      await prisma.user.update({
        where: { id: req.auth().userId },
        data: { credits: { increment: PROJECT_CREDIT_COST } },
      }).catch(() => {}); // Silently ignore — best effort refund
    }

    return res.status(error.status || 500).json({
      message: error.message || 'Internal Server Error',
    });
  }
};

// ─── Delete Project ───────────────────────────────────────────────────────────

export const deleteProject = async (req: Request, res: Response) => {
  try {
    // ── 1. Auth check | Kiểm tra xác thực ──────────────────────────────────
    const { userId } = req.auth();
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // ── 2. Param check | Kiểm tra có truyền id không ────────────────────────
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing project id' });

    // ── 3. Ownership check | Kiểm tra project thuộc về user này không ───────
    // findFirst with userId ensures user can only delete their own projects
    // Dùng findFirst với userId để user chỉ xoá được project của mình
    const project = await prisma.project.findFirst({ where: { id, userId } });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // ── 4. Delete Cloudinary assets | Xoá ảnh trên Cloudinary ───────────────
    // Clean up storage to avoid orphaned files accumulating over time
    // Dọn dẹp storage để tránh file thừa tích tụ theo thời gian
    const imagesToDelete = [
      ...(project.uploadedImages ?? []),
      ...(project.generatedImage ? [project.generatedImage] : []),
    ];

    await Promise.allSettled(
      imagesToDelete.map((url) => {
        // Extract public_id from Cloudinary URL to delete
        // Lấy public_id từ URL Cloudinary để xoá đúng file
        const publicId = url.split('/').pop()?.split('.')[0];
        if (publicId) return cloudinary.uploader.destroy(publicId);
      })
    );

    // ── 5. Delete project from DB | Xoá project khỏi DB ────────────────────
    await prisma.project.delete({ where: { id } });

    return res.status(200).json({ message: 'Project deleted successfully' });

  } catch (error: any) {
    return res.status(error.status || 500).json({
      message: error.message || 'Internal Server Error',
    });
  }
};
// ─── Generate Video ──────────────────────────────────────────────────────────

export const generateVideo = async (req: Request, res: Response) => {
  let isCreditDeducted = false;

  try {
    // ── 1. Auth check | Kiểm tra xác thực ─────────────────────────────────
    const { userId } = req.auth();
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // ── 2. User check | Kiểm tra user tồn tại ─────────────────────────────
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ── 3. Credit check | Kiểm tra đủ credit ──────────────────────────────
    if (user.credits < PROJECT_CREDIT_VIDEO_COST) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    // ── 4. Param check | Kiểm tra có truyền id không ──────────────────────
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing project id' });

    // ── 5. Ownership check | Kiểm tra project tồn tại và thuộc về user ────
    const project = await prisma.project.findFirst({ where: { id, userId } });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // ── 6. Image check | Kiểm tra ảnh đã được generate chưa ───────────────
    // Cannot generate video without a generated image as visual reference
    // Không thể tạo video nếu chưa có ảnh — ảnh là input cho video
    if (!project.generatedImage) {
      return res.status(400).json({ message: 'Project image has not been generated yet' });
    }

    // ── 7. Duplicate check | Kiểm tra video đã tồn tại chưa ───────────────
    // Must happen before credit deduction to avoid charging for nothing
    // Phải check trước khi trừ credit để không trừ nhầm
    if (project.generatedVideo) {
      return res.status(400).json({ message: 'Video already generated' });
    }

    // ── 8. Deduct credits | Trừ credit ────────────────────────────────────
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: PROJECT_CREDIT_VIDEO_COST } },
    });
    isCreditDeducted = true;

    // ── 9. Mark as generating | Đánh dấu đang generate ────────────────────
    await prisma.project.update({
      where: { id },
      data: { isGenerating: true },
    });
    // Determine resolution based on user plan | Xác định độ phân giải theo plan ──
    // Free users get 720p, Pro users get 1080p
    // User free được 720p, Pro được 1080p
    const resolution = user.plan === 'pro' 
    ? VIDEO_RESOLUTION_PRO 
    : VIDEO_RESOLUTION_FREE;

    // ── 10. Generate video via AI | Gọi AI để generate video ──────────────
    const videoBuffer = await generateProductVideo(
      project.productName,
      project.productDescription,
      project.generatedImage,
      project.aspectRatio,
      project.targetLength,
      project.userPrompt,
      resolution,
    );

    // ── 11. Upload video to Cloudinary | Upload video lên Cloudinary ───────
    const generatedVideoUrl = await uploadBufferToCloudinary(videoBuffer, 'video');

    // ── 12. Save result to DB | Lưu kết quả vào DB ────────────────────────
    const updated = await prisma.project.update({
      where: { id },
      data: {
        generatedVideo: generatedVideoUrl,
        isGenerating: false,
      },
    });

    return res.status(200).json({ project: updated });

  } catch (error: any) {
    // ── Rollback | Hoàn tác các side effect nếu có lỗi ────────────────────
    if (isCreditDeducted) {
      await prisma.user.update({
        where: { id: req.auth().userId },
        data: { credits: { increment: PROJECT_CREDIT_VIDEO_COST } },
      }).catch(() => {});
    }

    // Reset isGenerating so project doesn't get stuck in loading state
    // Reset isGenerating để project không bị kẹt ở trạng thái loading
    await prisma.project.update({
      where: { id: req.params.id },
      data: { isGenerating: false, error: error.message },
    }).catch(() => {});

    return res.status(error.status || 500).json({
      message: error.message || 'Internal Server Error',
    });
  }
};