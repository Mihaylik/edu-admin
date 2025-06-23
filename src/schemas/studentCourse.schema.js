import { z } from 'zod';

export const studentCourseParamsSchema = z.object({
  id: z.string().regex(/^\d+$/),
  studentId: z.string().regex(/^\d+$/),
});

export const studentCourseIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

export const addStudentsToCourseSchema = z.object({
  studentIds: z.array(z.number().int().positive()).min(1),
});
