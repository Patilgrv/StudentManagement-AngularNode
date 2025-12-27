import { Request, Response, NextFunction } from 'express';
import { studentService } from './student.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export const studentController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await studentService.create(req.body);
      res.status(201).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const student = await studentService.findById(req.params.id);

      // Allow students to view their own profile
      if (authReq.user?.role === 'STUDENT') {
        const studentUser = await studentService.findById(req.params.id);
        if (studentUser.userId !== authReq.user.userId) {
          return res.status(403).json({
            success: false,
            message: 'Insufficient permissions',
          });
        }
      }

      res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await studentService.list(req.query as any);
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
      const student = await studentService.update(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await studentService.delete(req.params.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

