import { protect } from './../middlewares/auth';
import { Router } from 'express';
import {
  getUserCredit,
  getAllUserProjects,
  getProjectById,
  toggleProjectPublish,
  
} from '../controllers/userController';

const userRouter = Router();

userRouter.get('/credits', protect, getUserCredit);

userRouter.get('/projects', protect, getAllUserProjects);

userRouter.get('/projects/:id', protect, getProjectById);
userRouter.patch('/projects/:id', protect, toggleProjectPublish);

export default userRouter;
