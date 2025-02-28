import { z } from 'zod';

// Base schemas
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and dashes');

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
    'Password must include at least one uppercase letter, one lowercase letter, and one number'
  );

// User schema
export const userSchema = z.object({
  id: z.string(),
  username: usernameSchema,
  email: emailSchema,
  avatarUrl: z.string().optional(),
  createdAt: z.string(),
  lastLogin: z.string(),
  role: z.enum(['user', 'admin', 'moderator']),
});

// Auth state schema
export const authStateSchema = z.object({
  user: userSchema.nullable(),
  isAuthenticated: z.boolean(),
  isLoading: z.boolean(),
  error: z.string().nullable(),
});

// Magic link request schema
export const magicLinkRequestSchema = z.object({
  email: emailSchema,
});

// Magic link verification schema
export const magicLinkVerifySchema = z.object({
  token: z.string(),
});

// Auth response schema
export const authResponseSchema = z.object({
  user: userSchema,
  token: z.string(),
});

// Auth error schema
export const authErrorSchema = z.object({
  code: z.enum(['INVALID_CREDENTIALS', 'REGISTRATION_FAILED', 'NETWORK_ERROR', 'MAGIC_LINK_FAILED']),
  message: z.string(),
});

// Export types inferred from schemas
export type User = z.infer<typeof userSchema>;
export type AuthState = z.infer<typeof authStateSchema>;
export type MagicLinkRequest = z.infer<typeof magicLinkRequestSchema>;
export type MagicLinkVerify = z.infer<typeof magicLinkVerifySchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type AuthError = z.infer<typeof authErrorSchema>;
