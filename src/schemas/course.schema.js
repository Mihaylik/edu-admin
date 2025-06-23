import { z } from 'zod';

export const createCourseSchema = z.object({
  name: z.string().min(1),
  subjectId: z.number().int().positive(),
  teacherId: z.number().int().positive(),
});

export const updateCourseSchema = z.object({
  name: z.string().min(1).optional(),
  subjectId: z.number().int().positive().optional(),
  teacherId: z.number().int().positive().optional(),
});

export const courseIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/),
});
