import { decrement } from './../../node_modules/effect/src/BigInt';
import { id } from './../../node_modules/chart.js/dist/plugins/plugin.legend.d';
import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import {v2 as cloudinary} from 'cloudinary'
// Create Project
export const createProject = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth();
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await prisma.user.findUnique({where: {id: userId}})
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.credits < 3) return res.status(400).json({ message: 'Insufficient credits' });
    let isCreditDeducted = false;
    let tempProjectId ='';
    const {
      name ='New Project',
      productName,
      productDescription,
      userPrompt,
      aspectRatio,
      targetLength = 5,
    } = req.body;
    const images = req.files;
    if (images.length < 2) return res.status(400).json({ message: 'Please upload at least 2 images' });

    await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 3 } }
    }).then(() => {
      isCreditDeducted = true;
    });
    let uploadedImages = await Promise.all(images.map (async (item) => {
      const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
      return result.secure_url;
    }));
    const project = await prisma.project.create({
      data: {
        userId,
        name,
        productName,
        productDescription,
        userPrompt,
        aspectRatio,
        targetLength: parseInt(targetLength),
        uploadedImages: uploadedImages,
        isGenerating: true
       
      },
      tempProjectId: project.id
    });
    return res.status(201).json({ project });
  } catch (error: any) {
    return res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
  }
};

// Delete Project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth();
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing project id' });
    const project = await prisma.project.findFirst({ where: { id, userId } });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await prisma.project.delete({ where: { id } });
    return res.status(200).json({ message: 'Project deleted' });
  } catch (error: any) {
    return res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
  }
};

// Generate Video (dummy)
export const generateVideo = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth();
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing project id' });
    // Dummy logic: just update isGenerating
    const project = await prisma.project.findFirst({ where: { id, userId } });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const updated = await prisma.project.update({
      where: { id },
      data: { isGenerating: true },
    });
    return res.status(200).json({ project: updated });
  } catch (error: any) {
    return res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
  }
};
