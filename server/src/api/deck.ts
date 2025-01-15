import { OpenAPIHono } from '@hono/zod-openapi';
import { CreateDeckSchema, DeckSchema, UpdateDeckSchema } from '@tcg-game-template/common/src';
import { DeckService } from '../services/DeckService';
import { route } from '../utils/api';

const deckRouter = new OpenAPIHono();

route({
	app: deckRouter,
	method: 'post',
	path: '/',
	requestSchema: CreateDeckSchema,
	responseSchema: DeckSchema,
	description: 'Create a new deck',
	handler: async (c) => {
		const deckData = await c.req.json();
		const deck = await DeckService.createDeck(c, deckData);
		return c.json(deck);
	},
});

route({
	app: deckRouter,
	method: 'get',
	path: '/:deckId',
	responseSchema: DeckSchema,
	description: 'Get a specific deck',
	handler: async (c) => {
		const deckId = c.req.param('deckId');
		const deck = await DeckService.getDeck(c, deckId);
		if (!deck) return c.json({ message: 'Deck not found' }, 404);
		return c.json(deck);
	},
});

route({
	app: deckRouter,
	method: 'put',
	path: '/:deckId',
	requestSchema: UpdateDeckSchema,
	responseSchema: DeckSchema,
	description: 'Update a deck',
	handler: async (c) => {
		const deckId = c.req.param('deckId');
		const updateData = await c.req.json();
		const deck = await DeckService.updateDeck(c, deckId, updateData);
		return c.json(deck);
	},
});

export default deckRouter;
