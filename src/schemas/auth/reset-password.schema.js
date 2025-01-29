import { z } from 'zod';

export const resetPasswordRequestSchema = z.object({
  email: z
    .string().email('Invalid email format').trim()
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format').trim(),
  code: z.string().length(6, 'Invalid reset code'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters long')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const verifyResetCodeSchema = z.object({
  email: z
    .string().email('Invalid email format').trim(),
  code: z
    .string().length(6, 'El código debe tener exactamente 6 caracteres')

});
