import { Request, Response, NextFunction } from 'express';
import { enrollmentService } from './enrollment.service';

export const enrollmentController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const enrollment = await enrollmentService.create(req.body);
      res.status(201).json({
        success: true,
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const enrollment = await enrollmentService.findById(req.params.id);
      res.status(200).json({
        success: true,
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await enrollmentService.list(req.query as any);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await enrollmentService.delete(req.params.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

