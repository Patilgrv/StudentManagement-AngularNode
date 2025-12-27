import { z } from 'zod';

export const createEnrollmentSchema = z.object({
  body: z.object({
    studentId: z.string().uuid('Invalid student ID'),
    classId: z.string().uuid('Invalid class ID'),
    subjectId: z.string().uuid('Invalid subject ID'),
  }),
});

export const getEnrollmentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid enrollment ID'),
  }),
});

export const listEnrollmentsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    studentId: z.string().uuid('Invalid student ID').optional(),
    classId: z.string().uuid('Invalid class ID').optional(),
    subjectId: z.string().uuid('Invalid subject ID').optional(),
  }),
});

