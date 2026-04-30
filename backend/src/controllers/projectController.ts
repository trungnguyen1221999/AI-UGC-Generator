import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/express";

import { generateProductImage } from "../services/ai.services/aiImageGenerate.service.js";
import { generateProductVideo } from "../services/ai.services/aiVideoGenerate.service.js";

import {
  uploadFilesToCloudinary,
  uploadBufferToCloudinary,
} from "../utils/image.utils.js";

import {
  PROJECT_CREDIT_COST,
  PROJECT_CREDIT_VIDEO_COST,
  MIN_IMAGES_REQUIRED,
  VIDEO_RESOLUTION_PRO,
  VIDEO_RESOLUTION_FREE,
} from "../constants/ai.constants.js";

import { CreateProjectBody, UploadedFile } from "../types/project.types.js";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const resetProjectState = async (id: string, error?: string) => {
  await prisma.project
    .update({
      where: { id },
      data: {
        isGenerating: false,
        ...(error ? { error } : {}),
      },
    })
    .catch(() => {});
};

// ─────────────────────────────────────────────────────────────
// CREATE PROJECT
// ─────────────────────────────────────────────────────────────

export const createProject = async (req: Request, res: Response) => {
  let tempProjectId: string | null = null;
  let isCreditDeducted = false;

  try {
    const { userId } = getAuth(req);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.credits < PROJECT_CREDIT_COST) {
      return res.status(400).json({ message: "Insufficient credits" });
    }

    const images = (req.files ?? []) as UploadedFile[];

    if (images.length !== MIN_IMAGES_REQUIRED) {
      return res.status(400).json({
        message: `Please upload exactly ${MIN_IMAGES_REQUIRED} images`,
      });
    }

    const {
      name = "New Project",
      productName,
      productDescription,
      userPrompt = "",
      aspectRatio = "9:16",
      targetLength = 30,
    } = req.body as CreateProjectBody;

    // deduct credit
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: PROJECT_CREDIT_COST } },
    });

    isCreditDeducted = true;

    const uploadedImages = await uploadFilesToCloudinary(images);

    const project = await prisma.project.create({
      data: {
        userId,
        name,
        productName,
        productDescription,
        userPrompt,
        aspectRatio,
        targetLength: Number(targetLength),
        uploadedImages,
        isGenerating: true,
      },
    });

    tempProjectId = project.id;

    const imageBuffer = await generateProductImage(
      images[0],
      images[1],
      productName,
      productDescription,
      userPrompt,
      aspectRatio,
    );

    const generatedImageUrl = await uploadBufferToCloudinary(imageBuffer);

    const updated = await prisma.project.update({
      where: { id: project.id },
      data: {
        generatedImage: generatedImageUrl,
        isGenerating: false,
      },
    });

    return res.status(201).json({ project: updated });
  } catch (error: any) {
    if (tempProjectId) {
      await resetProjectState(tempProjectId, error?.message);
    }

    if (isCreditDeducted) {
      await prisma.user
        .update({
          where: { id: getAuth(req).userId },
          data: { credits: { increment: PROJECT_CREDIT_COST } },
        })
        .catch(() => {});
    }

    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE PROJECT
// ─────────────────────────────────────────────────────────────

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const assetsToDelete = [
      ...(project.uploadedImages ?? []),
      ...(project.generatedImage ? [project.generatedImage] : []),
      ...(project.generatedVideo ? [project.generatedVideo] : []),
    ];

    await Promise.allSettled(
      assetsToDelete.map((url) => {
        if (!url) return;

        // ⚠️ better: should store public_id instead of parsing URL
        const publicId = url.split("/").pop()?.split(".")[0];
        if (!publicId) return;

        return cloudinary.uploader.destroy(publicId);
      }),
    );

    await prisma.project.delete({ where: { id } });

    return res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// GENERATE VIDEO
// ─────────────────────────────────────────────────────────────

export const generateVideo = async (req: Request, res: Response) => {
  let isCreditDeducted = false;

  try {
    const { userId } = getAuth(req);
    const { id: projectId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.generatedImage) {
      return res.status(400).json({
        message: "Image not generated yet",
      });
    }

    if (project.generatedVideo) {
      return res.status(400).json({
        message: "Video already generated",
      });
    }

    if (user.credits < PROJECT_CREDIT_VIDEO_COST) {
      return res.status(400).json({
        message: "Insufficient credits",
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: PROJECT_CREDIT_VIDEO_COST },
      },
    });

    isCreditDeducted = true;

    await prisma.project.update({
      where: { id: projectId },
      data: { isGenerating: true },
    });

    const resolution =
      user.plan === "pro" ? VIDEO_RESOLUTION_PRO : VIDEO_RESOLUTION_FREE;

    const videoUrl = await generateProductVideo(
      project.productName,
      project.productDescription,
      project.generatedImage,
      project.aspectRatio,
      project.targetLength,
      project.userPrompt,
      resolution,
    );

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        generatedVideo: videoUrl,
        isGenerating: false,
      },
    });

    return res.status(200).json({ project: updated });
  } catch (error: any) {
    const { userId } = getAuth(req);
    const projectId = req.params.id;

    if (isCreditDeducted) {
      await prisma.user
        .update({
          where: { id: userId },
          data: {
            credits: { increment: PROJECT_CREDIT_VIDEO_COST },
          },
        })
        .catch(() => {});
    }

    if (projectId) {
      await resetProjectState(projectId as string, error?.message);
    }

    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};
