import { z } from 'zod';

export const createClassSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Class name is required'),
    grade: z.number().int().min(1).max(12),
    section: z.string().optional(),
    academicYear: z.string().min(1, 'Academic year is required'),
  }),
});

export const updateClassSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Class name is required').optional(),
    grade: z.number().int().min(1).max(12).optional(),
    section: z.string().optional(),
    academicYear: z.string().min(1, 'Academic year is required').optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid class ID'),
  }),
});

export const getClassSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid class ID'),
  }),
});

export const listClassesSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    grade: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
    academicYear: z.string().optional(),
  }),
});

