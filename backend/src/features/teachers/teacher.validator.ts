import { z } from 'zod';

export const createTeacherSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid user ID'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().optional(),
    department: z.string().optional(),
  }),
});

export const updateTeacherSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    phone: z.string().optional(),
    department: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid teacher ID'),
  }),
});

export const getTeacherSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid teacher ID'),
  }),
});

export const listTeachersSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
  }),
});

