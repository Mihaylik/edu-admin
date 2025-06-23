import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  studentIds: z.array(z.number().int().positive()).optional(),
});

export const updateGroupSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  studentIds: z.array(z.number().int().positive()).optional(),
});

export const groupIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/),
});
