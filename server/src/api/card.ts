import { OpenAPIHono, z } from '@hono/zod-openapi';
import { CardCreateSchema, CardSchema } from '@rism-tcg/common/src';
import { CardService } from '../services/CardService';
import { route } from '../utils/api';

const cardRouter = new OpenAPIHono();

route({
	app: cardRouter,
	method: 'get',
	path: '/',
	responseSchema: z.array(CardSchema),
	description: 'Get all cards',
	handler: async (c) => {
		const cards = await CardService.getAllCards(c);
		return c.json(cards);
	},
});

route({
	app: cardRouter,
	method: 'get',
	path: '/:cardId',
	responseSchema: CardSchema,
	description: 'Get a specific card',
	handler: async (c) => {
		const cardId = c.req.param('cardId');
		const card = await CardService.getCard(c, cardId);
		if (!card) return c.json({ message: 'Card not found' }, 404);
		return c.json(card);
	},
});

route({
	app: cardRouter,
	method: 'post',
	path: '/',
	requestSchema: CardCreateSchema,
	responseSchema: CardSchema,
	description: 'Create a new card',
	handler: async (c) => {
		const cardData = await c.req.json();
		const card = await CardService.createCard(c, cardData);
		return c.json(card);
	},
});

route({
	app: cardRouter,
	method: 'delete',
	path: '/:cardId',
	responseSchema: z.object({
		success: z.boolean(),
		message: z.string(),
	}),
	description: 'Delete a card',
	handler: async (c) => {
		const cardId = c.req.param('cardId');

		// First check if the card exists
		const card = await CardService.getCard(c, cardId);
		if (!card) {
			return c.json(
				{
					success: false,
					message: 'Card not found',
				},
				404
			);
		}

		// Attempt to delete the card
		const success = await CardService.deleteCard(c, cardId);
		if (!success) {
			return c.json(
				{
					success: false,
					message: 'Failed to delete card',
				},
				500
			);
		}

		return c.json({
			success: true,
			message: 'Card deleted successfully',
		});
	},
});

export default cardRouter;
