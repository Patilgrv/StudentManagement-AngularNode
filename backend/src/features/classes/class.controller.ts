import { Request, Response, NextFunction } from 'express';
import { classService } from './class.service';

export const classController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classRecord = await classService.create(req.body);
      res.status(201).json({
        success: true,
        data: classRecord,
      });
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classRecord = await classService.findById(req.params.id);
      res.status(200).json({
        success: true,
        data: classRecord,
      });
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await classService.list(req.query as any);
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
      const classRecord = await classService.update(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: classRecord,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await classService.delete(req.params.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

