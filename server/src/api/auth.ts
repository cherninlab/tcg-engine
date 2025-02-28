import { OpenAPIHono, z } from '@hono/zod-openapi';
import { AuthService } from '../services/AuthService';
import { ResSuccessSchema, route } from '../utils/api';

const authRouter = new OpenAPIHono();

// Define response schemas
const AuthResponseSchema = z.object({
	token: z.string(),
	user: z.object({
		id: z.string(),
		email: z.string().email(),
		role: z.enum(['user', 'admin', 'moderator']),
	}),
});

route({
	app: authRouter,
	method: 'post',
	path: '/magic-link',
	requestSchema: z.object({
		email: z.string().email(),
	}),
	responseSchema: ResSuccessSchema,
	description: 'Request a magic link for authentication',
	handler: async (c) => {
		const { email } = await c.req.json();
		await AuthService.sendMagicLink(c, email);
		return c.json({ success: true });
	},
});

route({
	app: authRouter,
	method: 'post',
	path: '/verify',
	requestSchema: z.object({
		token: z.string(),
	}),
	responseSchema: ResSuccessSchema,
	description: 'Verify a magic link token',
	handler: async (c) => {
		const { token } = await c.req.json();
		const result = await AuthService.verifyMagicLink(c, token);
		return c.json(result);
	},
});

export default authRouter;
