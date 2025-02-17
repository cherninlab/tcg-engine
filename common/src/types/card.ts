import { z } from '@hono/zod-openapi';

export const LogicEffectSchema = z
	.object({
		effectType: z.enum(['damage', 'heal', 'drawCard', 'buff']).openapi({ description: 'Type of in-game effect' }),

		amount: z.number().int().min(1).optional().openapi({ description: 'Value for damage/heal/etc., if applicable' }),

		target: z.enum(['self', 'opponent', 'creature', 'allCreatures']).optional().openapi({ description: 'Who or what this effect targets' }),
	})
	.openapi({
		description: 'Structured effect object used by the game engine',
	});

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

		displayEffect: z.string().optional().openapi({
			description: 'Short text describing the card effect',
		}),

		logicEffect: LogicEffectSchema.optional(),

		rarity: z.enum(['common', 'uncommon', 'rare', 'legendary']).openapi({
			description: 'Rarity of the card',
		}),
	})
	.openapi({
		description: 'A card in the game',
	});

/**
 * For creating a new card, omit the `id` field
 */
export const CardCreateSchema = CardSchema.omit({
	id: true,
}).openapi({
	description: 'Data required to create a new card',
});

/**
 * For updating an existing card, make all fields optional,
 * and remove `id` since it should not be changed
 */
export const CardUpdateSchema = CardSchema.partial()
	.omit({
		id: true,
	})
	.openapi({
		description: 'Data that can be updated on a card',
	});

/** TypeScript types derived from the above schemas */
export type Card = z.infer<typeof CardSchema>;
export type CardCreate = z.infer<typeof CardCreateSchema>;
export type CardUpdate = z.infer<typeof CardUpdateSchema>;

