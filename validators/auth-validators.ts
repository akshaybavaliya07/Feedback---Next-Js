import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signInSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores are allowed')
    .transform(val => val.toLowerCase())
});


export const verifySchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

export const acceptMessageSchema = z.object({
  acceptMessages: z.boolean(),
});

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters." })
    .max(300, { message: "Content must not be longer than 300 characters." }),
});
