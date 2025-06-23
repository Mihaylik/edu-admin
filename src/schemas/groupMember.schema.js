import { z } from 'zod';

export const groupMemberParamsSchema = z.object({
  id: z.string().regex(/^\d+$/),
  studentId: z.string().regex(/^\d+$/),
});
