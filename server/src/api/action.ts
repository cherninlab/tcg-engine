import { OpenAPIHono } from '@hono/zod-openapi';
import { ActionResponseSchema, ActionSchema } from '@tcg-game-template/common/src';
import { ActionService } from '../services/ActionService';
import { route } from '../utils/api';

const actionRouter = new OpenAPIHono();

route({
	app: actionRouter,
	method: 'post',
	path: '/actions',
	requestSchema: ActionSchema,
	responseSchema: ActionResponseSchema,
	description: 'Process an action',
	handler: async (c) => {
		const actionData = await c.req.json();
		const result = await ActionService.processAction(c, actionData);
		return c.json(result);
	},
});

export default actionRouter;
