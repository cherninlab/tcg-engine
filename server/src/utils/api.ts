import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { Handler } from 'hono';

export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options' | 'trace';

export const ResMessageSchema = z.object({ message: z.string() });

export const ResSuccessSchema = z.object({ success: z.boolean() });

export const AuthHeaderSchema = z.object({ authorization: z.string().optional() });

export function route({
	app,
	method,
	path,
	requestSchema,
	responseSchema,
	handler,
	description,
}: {
	app: OpenAPIHono;
	method: Method;
	path: string;
	requestSchema?: z.ZodSchema;
	responseSchema: z.ZodSchema;
	handler: Handler<any>;
	description?: string;
}) {
	const mergedResponses = {
		200: {
			content: { 'application/json': { schema: responseSchema } },
			description: 'OK',
		},
		401: {
			content: { 'application/json': { schema: ResMessageSchema } },
			description: 'Unauthorized',
		},
		500: {
			content: { 'application/json': { schema: ResMessageSchema } },
			description: 'Internal Server Error',
		},
	};

	let request = undefined;

	if (requestSchema) {
		request = {
			body: {
				content: {
					'application/json': {
						schema: requestSchema,
					},
				},
			},
		};
	}

	app.openapi(createRoute({ method, path, request, responses: mergedResponses, description }), async (c, next) => {
		try {
			return await handler(c, next);
		} catch (error) {
			console.error(error);
			return c.json({ error: error instanceof Error ? error.message : 'An error occurred' }, 500);
		}
	});
}
