import { Router } from 'express';
import {
  getUserCredit,
  getAllUserProjects,
  getProjectById,
  toggleProjectPublish
} from '../controllers/userController';

const userRouter = Router();

userRouter.get('/credits', getUserCredit);

userRouter.get('/projects', getAllUserProjects);

userRouter.get('/projects/:id', getProjectById);

userRouter.patch('/projects/:id', toggleProjectPublish);

export default userRouter;
