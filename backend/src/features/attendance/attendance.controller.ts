import { Request, Response, NextFunction } from 'express';
import { attendanceService } from './attendance.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { prisma } from '../../config/database';

export const attendanceController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const teacher = await prisma.teacher.findUnique({
        where: { userId: authReq.user!.userId },
      });

      if (!teacher) {
        return res.status(403).json({
          success: false,
          message: 'Teacher profile not found',
        });
      }

      const attendance = await attendanceService.create({
        ...req.body,
        teacherId: teacher.id,
      });

      res.status(201).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const attendance = await attendanceService.findById(req.params.id);
      res.status(200).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await attendanceService.list(req.query as any);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getStudentAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const studentId = req.params.studentId;

      // Allow students to view their own attendance
      if (authReq.user?.role === 'STUDENT') {
        const student = await prisma.student.findUnique({
          where: { userId: authReq.user.userId },
        });

        if (!student || student.id !== studentId) {
          return res.status(403).json({
            success: false,
            message: 'Insufficient permissions',
          });
        }
      }

      const result = await attendanceService.getStudentAttendance(studentId, req.query);
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
      const attendance = await attendanceService.update(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  },

  async getReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await attendanceService.getReports(req.query);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },
};

