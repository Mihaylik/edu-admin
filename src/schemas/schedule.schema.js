import { z } from 'zod';

export const createScheduleSchema = z.object({
  courseId: z.number().int(),
  dayOfWeek: z.enum([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  location: z.string().optional(),
});

export const updateScheduleSchema = createScheduleSchema.partial();

export const scheduleIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

export const scheduleStudentIdParamSchema = z.object({
  studentId: z.string().regex(/^\d+$/),
});
