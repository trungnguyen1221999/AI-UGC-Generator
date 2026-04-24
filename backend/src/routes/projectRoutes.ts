import { protect } from './../middlewares/auth';
import { Router } from 'express';
import { createProject, deleteProject, generateVideo } from '../controllers/projectController';
import upload from '../config/multer.js'
const router = Router();

// Tạo project mới
router.post('/', protect, upload.array('images', 2), createProject);

// Xóa project
router.delete('/:id', protect, deleteProject);

// Generate video cho project
router.post('/:id/generate-video', protect, generateVideo);

export default router;
