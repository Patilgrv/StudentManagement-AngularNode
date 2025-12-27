import { Request, Response, NextFunction } from 'express';
import { teacherService } from './teacher.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export const teacherController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teacher = await teacherService.create(req.body);
      res.status(201).json({
        success: true,
        data: teacher,
      });
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const teacher = await teacherService.findById(req.params.id);

      // Allow teachers to view their own profile
      if (authReq.user?.role === 'TEACHER') {
        if (teacher.userId !== authReq.user.userId) {
          return res.status(403).json({
            success: false,
            message: 'Insufficient permissions',
          });
        }
      }

      res.status(200).json({
        success: true,
        data: teacher,
      });
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await teacherService.list(req.query as any);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teacher = await teacherService.update(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: teacher,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await teacherService.delete(req.params.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

