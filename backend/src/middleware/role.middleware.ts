import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { AppError } from './error.middleware';

type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export const authorize = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', 401));
      return;
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      next(new AppError('Insufficient permissions', 403));
      return;
    }

    next();
  };
};

