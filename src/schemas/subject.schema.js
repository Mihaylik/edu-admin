import { z } from 'zod';

export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export const updateSubjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export const assignTeacherToSubjectParamsSchema = z.object({
  id: z.string().regex(/^\d+$/),
  teacherId: z.string().regex(/^\d+$/),
});
