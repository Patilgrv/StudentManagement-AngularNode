import { z } from 'zod';

export const createStudentSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid user ID'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().datetime().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const updateStudentSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    dateOfBirth: z.string().datetime().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid student ID'),
  }),
});

export const getStudentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid student ID'),
  }),
});

export const listStudentsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
  }),
});

