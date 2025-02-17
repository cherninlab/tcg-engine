import { z } from 'zod';

export const loginCredentialsSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export const registerCredentialsSchema = z
	.object({
		username: z.string().min(3),
		email: z.string().email(),
		password: z.string().min(6),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type RegisterCredentials = z.infer<typeof registerCredentialsSchema>;
