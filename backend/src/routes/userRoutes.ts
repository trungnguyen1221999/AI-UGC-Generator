import { protect } from './../middlewares/auth.js';
import { Router } from 'express';
import {
  getUserCredit,
  getAllUserProjects,
  getProjectById,
  toggleProjectPublish,
  updateUserPlanAndCredits
} from '../controllers/userController.js';

const userRouter = Router();

userRouter.get('/credits', protect, getUserCredit);

userRouter.get('/projects', protect, getAllUserProjects);

userRouter.get('/projects/:id', protect, getProjectById);
userRouter.patch('/projects/:id', protect, toggleProjectPublish);
userRouter.patch('/plan', protect, updateUserPlanAndCredits);

export default userRouter;
