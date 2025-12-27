import { z } from 'zod';

export const createSubjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Subject name is required'),
    code: z.string().min(1, 'Subject code is required'),
    description: z.string().optional(),
  }),
});

export const updateSubjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Subject name is required').optional(),
    code: z.string().min(1, 'Subject code is required').optional(),
    description: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid subject ID'),
  }),
});

export const getSubjectSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid subject ID'),
  }),
});

export const listSubjectsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
  }),
});

export const assignTeacherSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid subject ID'),
  }),
  body: z.object({
    teacherId: z.string().uuid('Invalid teacher ID'),
  }),
});

export const unassignTeacherSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid subject ID'),
    teacherId: z.string().uuid('Invalid teacher ID'),
  }),
});

