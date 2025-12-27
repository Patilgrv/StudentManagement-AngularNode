import { z } from 'zod';

export const createAttendanceSchema = z.object({
  body: z.object({
    studentId: z.string().uuid('Invalid student ID'),
    classId: z.string().uuid('Invalid class ID'),
    subjectId: z.string().uuid('Invalid subject ID'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    remarks: z.string().optional(),
  }),
});

export const updateAttendanceSchema = z.object({
  body: z.object({
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']).optional(),
    remarks: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid attendance ID'),
  }),
});

export const getAttendanceSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid attendance ID'),
  }),
});

export const listAttendanceSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    studentId: z.string().uuid('Invalid student ID').optional(),
    classId: z.string().uuid('Invalid class ID').optional(),
    subjectId: z.string().uuid('Invalid subject ID').optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  }),
});

export const getStudentAttendanceSchema = z.object({
  params: z.object({
    studentId: z.string().uuid('Invalid student ID'),
  }),
  query: z.object({
    classId: z.string().uuid('Invalid class ID').optional(),
    subjectId: z.string().uuid('Invalid subject ID').optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  }),
});

export const getAttendanceReportsSchema = z.object({
  query: z.object({
    classId: z.string().uuid('Invalid class ID').optional(),
    subjectId: z.string().uuid('Invalid subject ID').optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  }),
});

