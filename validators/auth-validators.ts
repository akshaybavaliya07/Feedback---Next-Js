import {z} from 'zod';

export const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.string().email({message: 'Invalid email address'}),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const signInSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});

export const verifySchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});