import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');

export const magicLinkRequestSchema = z.object({
  email: emailSchema,
});

export const magicLinkVerifySchema = z.object({
  token: z.string(),
});

export const loginCredentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(6),
});

export const registerCredentialsSchema = z
  .object({
    username: z.string().min(3),
    email: emailSchema,
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type MagicLinkRequest = z.infer<typeof magicLinkRequestSchema>;
export type MagicLinkVerify = z.infer<typeof magicLinkVerifySchema>;
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type RegisterCredentials = z.infer<typeof registerCredentialsSchema>;
