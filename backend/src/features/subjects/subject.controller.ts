import { Request, Response, NextFunction } from 'express';
import { subjectService } from './subject.service';

export const subjectController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subject = await subjectService.create(req.body);
      res.status(201).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subject = await subjectService.findById(req.params.id);
      res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await subjectService.list(req.query as any);
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
      const subject = await subjectService.update(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await subjectService.delete(req.params.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async assignTeacher(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const assignment = await subjectService.assignTeacher(req.params.id, req.body.teacherId);
      res.status(201).json({
        success: true,
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  },

  async unassignTeacher(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await subjectService.unassignTeacher(req.params.id, req.params.teacherId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};

