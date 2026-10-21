import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Admin email identifier is required' }),
  
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
