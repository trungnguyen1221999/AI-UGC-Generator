import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { getAuth } from "@clerk/express";
import { AppError } from "../utils/AppError.js";

// --- Helpers ---
const getParam = (value: string | string[] | undefined): string => {
  return Array.isArray(value) ? value[0] : value || "";
};

// ─────────────────────────────────────────────────────────────
// GET USER CREDITS
// ─────────────────────────────────────────────────────────────
export const getUserCredit = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  const user = await prisma.user.findUnique({
    where: { id: userId as string },
  });

  if (!user) throw new AppError("User not found", 404);

  return res.status(200).json({
    credits: user.credits,
  });
};

// ─────────────────────────────────────────────────────────────
// GET ALL USER PROJECTS
// ─────────────────────────────────────────────────────────────
export const getAllUserProjects = async (req: Request, res: Response) => {
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

  // Filters
  if (type === "video") where.generatedVideo = { not: null };
  if (type === "image") where.generatedImage = { not: null };
  if (published === "true") where.isPublished = true;
  if (published === "false") where.isPublished = false;

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  if (aspectRatio) where.aspectRatio = aspectRatio;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { productName: { contains: search, mode: "insensitive" } },
      { productDescription: { contains: search, mode: "insensitive" } },
    ];
  }

  // Pagination & Sorting
  const take = Math.min(100, Math.max(1, parseInt(limit)));
  const pageNumber = Math.max(1, parseInt(page));
  const skip = (pageNumber - 1) * take;

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { [sortBy]: sortOrder === "asc" ? "asc" : "desc" },
      take,
      skip,
    }),
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
};

// ─────────────────────────────────────────────────────────────
// GET PROJECT BY ID
// ─────────────────────────────────────────────────────────────
export const getProjectById = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  const id = getParam(req.params.id);

  const project = await prisma.project.findFirst({
    where: { id, userId: userId as string },
  });

  if (!project) throw new AppError("Project not found", 404);

  return res.status(200).json({ project });
};

// ─────────────────────────────────────────────────────────────
// TOGGLE PUBLISH
// ─────────────────────────────────────────────────────────────
export const toggleProjectPublish = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  const id = getParam(req.params.id);

  const project = await prisma.project.findFirst({
    where: { id, userId: userId as string },
  });

  if (!project) throw new AppError("Project not found", 404);

  // Business logic validation
  if (!project.generatedImage && !project.generatedVideo) {
    throw new AppError("Project has no generated content", 400);
  }

  const updated = await prisma.project.update({
    where: { id },
    data: { isPublished: !project.isPublished },
  });

  return res.status(200).json({ project: updated });
};

// ─────────────────────────────────────────────────────────────
// UPDATE USER PLAN
// ─────────────────────────────────────────────────────────────
export const updateUserPlanAndCredits = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  const { plan } = req.body;

  if (!plan) throw new AppError("Missing plan field", 400);

  const user = await prisma.user.update({
    where: { id: userId as string },
    data: { plan },
  });

  return res.status(200).json({ user });
};
