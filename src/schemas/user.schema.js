import { z } from 'zod';
import { USER_ROLES } from '../utils/roles.js';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Password must contain one uppercase letter')
    .regex(/\d/, 'Password must contain one digit'),
  role: z.enum(Object.values(USER_ROLES)),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(Object.values(USER_ROLES)).optional(),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Password must contain one uppercase letter')
    .regex(/\d/, 'Password must contain one digit')
    .optional(),
});

export const changePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Password must contain one uppercase letter')
    .regex(/\d/, 'Password must contain one digit')
    .optional(),
});
