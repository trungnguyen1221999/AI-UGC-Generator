import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { getAuth } from "@clerk/express";

// ─────────────────────────────────────────────────────────────
// GET USER CREDITS
// ─────────────────────────────────────────────────────────────

export const getUserCredit = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      credits: user.credits,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// GET ALL USER PROJECTS
// ─────────────────────────────────────────────────────────────

export const getAllUserProjects = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    const {
      type,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      limit = "10",
      page = "1",
      published,
      from,
      to,
      aspectRatio,
    } = req.query as Record<string, string>;

    const where: Record<string, any> = { userId };

    if (type === "video") where.generatedVideo = { not: null };
    if (type === "image") where.generatedImage = { not: null };

    if (published === "true") where.isPublished = true;
    if (published === "false") where.isPublished = false;

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    if (aspectRatio) {
      where.aspectRatio = aspectRatio;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { productName: { contains: search, mode: "insensitive" } },
        { productDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    const take = Math.min(
      100,
      Math.max(1, Number.parseInt(limit || "10") || 10),
    );

    const pageNumber = Math.max(1, Number.parseInt(page || "1") || 1);
    const skip = (pageNumber - 1) * take;

    const orderBy: Record<string, "asc" | "desc"> = {
      [sortBy]: sortOrder === "asc" ? "asc" : "desc",
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({ where, orderBy, take, skip }),
      prisma.project.count({ where }),
    ]);

    return res.status(200).json({
      projects,
      pagination: {
        total,
        page: pageNumber,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// GET PROJECT BY ID
// ─────────────────────────────────────────────────────────────

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({ project });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// TOGGLE PUBLISH
// ─────────────────────────────────────────────────────────────

export const toggleProjectPublish = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.generatedImage && !project.generatedVideo) {
      return res.status(400).json({
        message: "Project has no generated content",
      });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        isPublished: !project.isPublished,
      },
    });

    return res.status(200).json({ project: updated });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// UPDATE USER PLAN (SECURITY FIXED)
// ─────────────────────────────────────────────────────────────

export const updateUserPlanAndCredits = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({ message: "Missing plan" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { plan },
    });

    return res.status(200).json({ user });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};
