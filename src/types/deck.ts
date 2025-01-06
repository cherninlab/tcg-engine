import { z } from '@hono/zod-openapi';

export const DeckSchema = z
	.object({
		id: z.string().uuid().openapi({ description: 'Unique identifier of the deck.' }),
		name: z.string().min(1).max(100).openapi({ description: 'Name of the deck.' }),
		ownerId: z.string().uuid().openapi({ description: 'ID of the player who owns this deck.' }),
		cards: z.array(z.string().uuid()).openapi({ description: 'Array of card IDs in the deck.' }),
		createdAt: z.number().openapi({ description: 'Timestamp when the deck was created.' }),
		updatedAt: z.number().optional().openapi({ description: 'Timestamp when the deck was last modified.' }),
		description: z.string().max(500).optional().openapi({ description: 'Optional description of the deck.' }),
	})
	.openapi({ description: 'A deck of cards owned by a player.' });

export const CreateDeckSchema = DeckSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).openapi({ description: 'Data required to create a new deck.' });

export const UpdateDeckSchema = DeckSchema.omit({
	id: true,
	ownerId: true,
	createdAt: true,
	updatedAt: true,
})
	.partial()
	.openapi({ description: 'Data that can be updated on a deck.' });

export type Deck = z.infer<typeof DeckSchema>;
export type CreateDeck = z.infer<typeof CreateDeckSchema>;
export type UpdateDeck = z.infer<typeof UpdateDeckSchema>;
