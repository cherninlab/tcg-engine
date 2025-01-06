import { OpenAPIHono } from '@hono/zod-openapi';
import { SessionService } from '../services/SessionService';
import { CreateSessionSchema, JoinSessionSchema, SessionSchema } from '../types/session';
import { route } from '../utils/api';

const sessionRouter = new OpenAPIHono();

route({
	app: sessionRouter,
	method: 'post',
	path: '/',
	requestSchema: CreateSessionSchema,
	responseSchema: SessionSchema,
	description: 'Create a new session',
	handler: async (c) => {
		const sessionData = await c.req.json();
		const session = await SessionService.createSession(c, sessionData.playerId, sessionData.deckId);
		return c.json(session);
	},
});

route({
	app: sessionRouter,
	method: 'post',
	path: '/join',
	requestSchema: JoinSessionSchema,
	responseSchema: SessionSchema,
	description: 'Join an existing session',
	handler: async (c) => {
		const joinData = await c.req.json();
		const session = await SessionService.joinSession(c, joinData.sessionId, joinData.playerId, joinData.deckId);
		return c.json(session);
	},
});

route({
	app: sessionRouter,
	method: 'get',
	path: '/:sessionId',
	responseSchema: SessionSchema,
	description: 'Get a specific session',
	handler: async (c) => {
		const sessionId = c.req.param('sessionId');
		const session = await SessionService.getSession(c, sessionId);
		if (!session) return c.json({ message: 'Session not found' }, 404);
		return c.json(session);
	},
});

export default sessionRouter;
