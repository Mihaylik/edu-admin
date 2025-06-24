import { z } from 'zod';

export const createOrUpdateGradeSchema = z.object({
  studentId: z.number().int(),
  courseId: z.number().int(),
  value: z.number().min(0).max(100),
});

export const gradeCourseStudentParamsSchema = z.object({
  courseId: z.string().regex(/^\d+$/),
  studentId: z.string().regex(/^\d+$/),
});

export const courseIdParamsSchema = z.object({
  courseId: z.string().regex(/^\d+$/),
});

export const studentIdParamsSchema = z.object({
  studentId: z.string().regex(/^\d+$/),
});

export const gradeIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/),
});
