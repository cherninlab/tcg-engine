import { OpenAPIHono } from '@hono/zod-openapi';
import { PlayerSchema, UpdatePlayerSchema } from '@tcg-game-template/common/src';
import { PlayerService } from '../services/PlayerService';
import { route } from '../utils/api';

const playerRouter = new OpenAPIHono();

route({
	app: playerRouter,
	method: 'post',
	path: '/',
	requestSchema: PlayerSchema.omit({ id: true, balance: true, decks: true }),
	responseSchema: PlayerSchema,
	description: 'Create a new player',
	handler: async (c) => {
		const playerData = await c.req.json();
		const player = await PlayerService.createPlayer(c, playerData);
		return c.json(player);
	},
});

route({
	app: playerRouter,
	method: 'get',
	path: '/:playerId',
	responseSchema: PlayerSchema,
	description: 'Get a specific player',
	handler: async (c) => {
		const playerId = c.req.param('playerId');
		const player = await PlayerService.getPlayer(c, playerId);
		if (!player) return c.json({ message: 'Player not found' }, 404);
		return c.json(player);
	},
});

route({
	app: playerRouter,
	method: 'put',
	path: '/:playerId',
	requestSchema: UpdatePlayerSchema,
	responseSchema: PlayerSchema,
	description: 'Update a player',
	handler: async (c) => {
		const playerId = c.req.param('playerId');
		const updateData = await c.req.json();
		const player = await PlayerService.updatePlayer(c, playerId, updateData);
		return c.json(player);
	},
});

export default playerRouter;
