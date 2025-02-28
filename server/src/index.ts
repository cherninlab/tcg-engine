import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { cors } from 'hono/cors';

// Import routers
import actionRouter from './api/action';
import authRouter from './api/auth';
import cardRouter from './api/card';
import deckRouter from './api/deck';
import economyRouter from './api/economy';
import playerRouter from './api/player';
import sessionRouter from './api/session';

// Create main app
const app = new OpenAPIHono({
	defaultHook: (result, c) => {
		if (!result.success) return c.json({ message: 'Invalid request' }, 400);
	},
});

// Add CORS middleware
app.use(
	'/*',
	cors({
		origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:1420', 'http://127.0.0.1:1420'],
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	})
);

// OpenAPI configuration
const openAPIConfig = {
	openapi: '3.0.0',
	info: {
		title: 'TCG Engine API',
		version: '1.0.0',
		description: 'A high-performance, type-safe card game engine API',
	},
};

// Mount API routes
app.route('/action', actionRouter);
app.route('/auth', authRouter);
app.route('/cards', cardRouter);
app.route('/decks', deckRouter);
app.route('/economy', economyRouter);
app.route('/players', playerRouter);
app.route('/sessions', sessionRouter);

// Generate OpenAPI document
app.doc('/openapi.json', openAPIConfig);

// Mount Scalar API Reference UI
app.get(
	'/reference',
	apiReference({
		pageTitle: 'TCG Engine API Reference',
		theme: 'default',
		spec: {
			url: '/openapi.json',
		},
	})
);

// Health check endpoint
app.get('/health', (c) => c.json({ status: 'ok' }));

// Error handling
app.onError((err, c) => {
	console.error(`${err}`);
	return c.json(
		{
			error: {
				message: err.message,
				code: err instanceof Error ? err.name : 'UnknownError',
			},
		},
		500
	);
});

// Export app
export default app;
