import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';

// Verify Clerk session and reject unauthenticated requests
// Xác thực session Clerk và từ chối request chưa đăng nhập
export const protect = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  next();
};