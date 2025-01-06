import { OpenAPIHono } from '@hono/zod-openapi';
import { EconomyService } from '../services/EconomyService';
import { BalanceSchema, PurchaseItemSchema } from '../types/economy';
import { ResSuccessSchema, route } from '../utils/api';

const economyRouter = new OpenAPIHono();

route({
	app: economyRouter,
	method: 'post',
	path: '/purchase',
	requestSchema: PurchaseItemSchema,
	responseSchema: ResSuccessSchema,
	description: 'Purchase an item',
	handler: async (c) => {
		const purchaseData = await c.req.json();
		const result = await EconomyService.purchaseItem(c, purchaseData);
		return c.json({ success: result });
	},
});

route({
	app: economyRouter,
	method: 'get',
	path: '/balance',
	responseSchema: BalanceSchema,
	description: 'Get player balance',
	handler: async (c) => {
		const playerId = c.req.query('playerId');
		if (!playerId) return c.json({ message: 'Player ID is required' }, 400);
		const balance = await EconomyService.getBalance(c, playerId);
		return c.json({ playerId, balance });
	},
});

export default economyRouter;
