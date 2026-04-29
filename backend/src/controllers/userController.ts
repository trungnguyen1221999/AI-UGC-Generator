import { project } from './../../node_modules/effect/src/Layer.js';

import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

// Get User Credits
export const getUserCredit = async (req: Request, res: Response) => {
    try {
        const { userId } = req.auth();
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ credits: user.credits });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
    }
};

// Get All User's Projects
export const getAllUserProjects = async (req: Request, res: Response) => {
    try {
        const { userId } = req.auth();
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Query params
        const {
            type, // 'video' | 'image' | undefined
            search, // string
            sortBy = 'createdAt', // default sort field
            sortOrder = 'desc', // 'asc' | 'desc'
            limit = '10',
            page = '1',
            published, // 'true' | 'false' | undefined
            from, // ISO date string
            to,   // ISO date string
            aspectRatio, // filter theo aspectRatio
        } = req.query as Record<string, string>;

        // Build where clause
        const where: any = { userId };
        if (type === 'video') {
            where.generatedVideo = { not: '' };
        } else if (type === 'image') {
            where.generatedImage = { not: '' };
        }
        if (published === 'true') {
            where.isPublished = true;
        } else if (published === 'false') {
            where.isPublished = false;
        }
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
                { name: { contains: search, mode: 'insensitive' } },
                { productName: { contains: search, mode: 'insensitive' } },
                { productDescription: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Pagination
        const take = Math.max(1, Math.min(100, parseInt(limit)));
        const skip = (Math.max(1, parseInt(page)) - 1) * take;

        // Sort
        const orderBy: any = {};
        orderBy[sortBy] = sortOrder === 'asc' ? 'asc' : 'desc';

        // Query
        const [projects, total] = await Promise.all([
            prisma.project.findMany({ where, orderBy, take, skip }),
            prisma.project.count({ where }),
        ]);

        return res.status(200).json({
            projects,
            pagination: {
                total,
                page: Number(page),
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
    }
};

// Get Project By ID
export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.auth();
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!id) {
            return res.status(400).json({ message: 'Missing project id' });
        }
        const project = await prisma.project.findFirst({ where: { id, userId } });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        return res.status(200).json({ project });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
    }
};

// Toggle Publish/UnPublish Project
export const toggleProjectPublish = async (req: Request, res: Response) => {
    try {
        const { userId } = req.auth();
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = req.params; 
        if (!id) {
            return res.status(400).json({ message: 'Missing project id' });
        }
        const project = await prisma.project.findFirst({ where: { id, userId } });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if(!project?.generatedImage && !project?.generatedVideo)
        {
            return res.status(404).json({ message: 'Project has no generated content' });
        }
        const updated = await prisma.project.update({
            where: { id },
            data: { isPublished: !project.isPublished },
        });
        return res.status(200).json({ project: updated });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
    }
};

// Update user plan and credits
export const updateUserPlanAndCredits = async (req: Request, res: Response) => {
    try {
        const { userId } = req.auth();
        const { plan, credits } = req.body;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!plan && credits === undefined) {
            return res.status(400).json({ message: 'Missing plan or credits' });
        }
        const data: any = {};
        if (plan) data.plan = plan;
        if (credits !== undefined) data.credits = credits;
        const user = await prisma.user.update({
            where: { id: userId },
            data
        });
        return res.status(200).json({ user });
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
    }
};