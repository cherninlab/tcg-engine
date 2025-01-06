import { OpenAPIHono } from '@hono/zod-openapi';
import { ActionService } from '../services/ActionService';
import { ActionResponseSchema, ActionSchema } from '../types/action';
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
