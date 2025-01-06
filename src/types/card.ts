// src/types/card.ts
import { z } from '@hono/zod-openapi';

export const CardSchema = z
	.object({
		id: z.string().uuid().openapi({
			description: 'Unique identifier of the card',
		}),
		name: z.string().openapi({
			description: 'Name of the card',
		}),
		imageUrl: z.string().url().optional().openapi({
			description: 'URL of the card image',
		}),
		type: z.enum(['creature', 'spell', 'artifact']).openapi({
			description: 'Type of the card',
		}),
		cost: z.number().int().min(0).openapi({
			description: 'Mana cost of the card',
		}),
		power: z.number().int().optional().openapi({
			description: 'Power of the card (for creatures)',
		}),
		toughness: z.number().int().optional().openapi({
			description: 'Toughness of the card (for creatures)',
		}),
		effect: z.string().optional().openapi({
			description: 'Card effect text',
		}),
		rarity: z.enum(['common', 'uncommon', 'rare', 'legendary']).openapi({
			description: 'Rarity of the card',
		}),
	})
	.openapi({
		description: 'A card in the game',
	});

export const CardCreateSchema = CardSchema.omit({
	id: true,
}).openapi({
	description: 'Data required to create a new card',
});

export const CardUpdateSchema = CardSchema.partial()
	.omit({
		id: true,
	})
	.openapi({
		description: 'Data that can be updated on a card',
	});

export type Card = z.infer<typeof CardSchema>;
export type CardCreate = z.infer<typeof CardCreateSchema>;
export type CardUpdate = z.infer<typeof CardUpdateSchema>;
