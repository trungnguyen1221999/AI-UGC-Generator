import { Request, Response, NextFunction } from "express";
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
import { AppError } from "../utils/AppError.js";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const getParam = (value: string | string[] | undefined): string => {
  return Array.isArray(value) ? value[0] : (value ?? "");
};

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

// ─────────────────────────────────────────────
// CREATE PROJECT
// ─────────────────────────────────────────────

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let tempProjectId: string | null = null;
  let isCreditDeducted = false;

  try {
    const { userId } = getAuth(req);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    if (user.credits < PROJECT_CREDIT_COST) {
      throw new AppError("Insufficient credits", 400);
    }

    const images = (req.files ?? []) as UploadedFile[];

    if (images.length < MIN_IMAGES_REQUIRED) {
      throw new AppError(
        `Please upload at least ${MIN_IMAGES_REQUIRED} images`,
        400,
      );
    }

    const {
      name = "New Project",
      productName,
      productDescription,
      userPrompt = "",
      aspectRatio = "9:16",
      targetLength = 30,
    } = req.body as CreateProjectBody;

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

    next(error);
  }
};

// ─────────────────────────────────────────────
// DELETE PROJECT
// ─────────────────────────────────────────────

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const projectId = getParam(req.params.id);

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) throw new AppError("Project not found", 404);

    const assetsToDelete = [
      ...(project.uploadedImages ?? []),
      ...(project.generatedImage ? [project.generatedImage] : []),
      ...(project.generatedVideo ? [project.generatedVideo] : []),
    ];

    await Promise.allSettled(
      assetsToDelete.map((url) => {
        if (!url) return;
        const publicId = url.split("/").pop()?.split(".")[0];
        if (!publicId) return;
        return cloudinary.uploader.destroy(publicId);
      }),
    );

    await prisma.project.delete({ where: { id: projectId } });

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// GENERATE VIDEO
// ─────────────────────────────────────────────

export const generateVideo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let isCreditDeducted = false;

  try {
    const { userId } = getAuth(req);
    const { videoAdditionalPrompt } = req.body;
    const projectId = getParam(req.params.id);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project) throw new AppError("Project not found", 404);

    if (!project.generatedImage) {
      throw new AppError("Image not generated yet", 400);
    }

    if (user.credits < PROJECT_CREDIT_VIDEO_COST) {
      throw new AppError("Insufficient credits", 400);
    }

    if (project.generatedVideo) {
      throw new AppError("Video already generated", 400);
    }

    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: PROJECT_CREDIT_VIDEO_COST } },
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
      project.userPrompt,
      resolution,
      videoAdditionalPrompt,
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
    const projectId = getParam(req.params.id);

    if (isCreditDeducted) {
      await prisma.user
        .update({
          where: { id: userId },
          data: { credits: { increment: PROJECT_CREDIT_VIDEO_COST } },
        })
        .catch(() => {});
    }

    if (projectId) {
      await resetProjectState(projectId, error?.message);
    }

    next(error);
  }
};
