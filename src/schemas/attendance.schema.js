import { z } from 'zod';

export const createAttendanceSchema = z.object({
  studentId: z.number(),
  courseId: z.number(),
  date: z.string().datetime(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE']),
});

export const updateAttendanceSchema = z.object({
  date: z.string().datetime().optional(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE']).optional(),
});

export const attendanceQuerySchema = z.object({
  courseId: z.string().optional(),
  studentId: z.string().optional(),
});

export const attendanceIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/),
});
