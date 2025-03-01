import { z } from '@hono/zod-openapi';

export const CardEffectSchema = z
	.object({
		id: z.string().uuid().openapi({
			description: 'Unique identifier of the effect.',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		type: z.enum(['damage', 'heal', 'drawCard', 'buff', 'debuff', 'summon']).openapi({
			description: 'Type of effect.',
			example: 'damage',
		}),
		description: z.string().openapi({
			description: 'Human-readable description of the effect.',
			example: 'Deal 3 damage to target creature',
		}),
		value: z.number().optional().openapi({
			description: 'Value associated with the effect, if applicable.',
			example: 3,
		}),
		target: z.enum(['self', 'opponent', 'creature', 'allCreatures', 'any']).optional().openapi({
			description: 'Target type for the effect.',
			example: 'creature',
		}),
	})
	.openapi({
		description: 'An effect that a card can have.',
	});

export const CardSchema = z
	.object({
		id: z.string().uuid().openapi({
			description: 'Unique identifier of the card.',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		name: z.string().min(1).openapi({
			description: 'Name of the card.',
			example: 'Dragon Warrior',
		}),
		type: z.enum(['creature', 'spell', 'artifact']).openapi({
			description: 'Type of the card.',
			example: 'creature',
		}),
		cost: z.number().int().min(0).openapi({
			description: 'Mana cost of the card.',
			example: 3,
		}),
		power: z.number().int().optional().openapi({
			description: 'Power of the card (for creatures).',
			example: 3,
		}),
		toughness: z.number().int().optional().openapi({
			description: 'Toughness of the card (for creatures).',
			example: 4,
		}),
		imageUrl: z.string().url().optional().openapi({
			description: 'URL of the card image.',
			example: 'https://assets.tcg-engine.com/cards/dragon-warrior.jpg',
		}),
		displayEffect: z.string().optional().openapi({
			description: 'Short text describing the card effect.',
			example: 'When this creature enters the battlefield, deal 2 damage to target creature.',
		}),
		effects: z.array(CardEffectSchema).optional().openapi({
			description: 'List of effects this card has.',
		}),
		rarity: z.enum(['common', 'uncommon', 'rare', 'legendary']).openapi({
			description: 'Rarity of the card.',
			example: 'rare',
		}),
		set: z.string().openapi({
			description: 'The card set this card belongs to.',
			example: 'core-set',
		}),
		flavorText: z.string().optional().openapi({
			description: 'Optional flavor text for the card.',
			example: "The dragon's roar echoed through the mountains...",
		}),
	})
	.openapi({
		description: 'A card in the game.',
	});

export const CreatureCardSchema = CardSchema.extend({
	type: z.literal('creature').openapi({ description: 'Indicates this is a creature card' }),
	power: z.number().int().openapi({ description: 'Base attack power of the creature' }),
	toughness: z.number().int().openapi({ description: 'Base health/toughness of the creature' }),
	tribe: z.enum(['beast', 'dragon', 'elemental', 'human', 'undead']).optional().openapi({ description: 'Creature type/tribe' }),
	abilities: z.array(z.string()).optional().openapi({ description: 'List of keyword abilities' }),
}).openapi({ description: 'A creature card that can attack and block' });

export const SpellCardSchema = CardSchema.extend({
	type: z.literal('spell').openapi({ description: 'Indicates this is a spell card' }),
	speed: z.enum(['instant', 'sorcery']).openapi({ description: 'When this spell can be cast' }),
}).openapi({ description: 'A spell card with immediate effects' });

export const ArtifactCardSchema = CardSchema.extend({
	type: z.literal('artifact').openapi({ description: 'Indicates this is an artifact card' }),
	durability: z.number().int().optional().openapi({ description: 'Number of uses before the artifact is destroyed' }),
}).openapi({ description: 'A permanent card that provides ongoing effects' });

export const CardDiscriminatedSchema = z
	.discriminatedUnion('type', [CreatureCardSchema, SpellCardSchema, ArtifactCardSchema])
	.openapi({ description: 'A card in the game with type-specific validation' });

export const CreateCardSchema = CardSchema.omit({
	id: true,
}).openapi({
	description: 'Data required to create a new card.',
});

export const UpdateCardSchema = CardSchema.omit({
	id: true,
})
	.partial()
	.openapi({
		description: 'Data that can be updated on a card.',
	});

export type CardEffect = z.infer<typeof CardEffectSchema>;

export type Card = z.infer<typeof CardSchema>;

export type CreatureCard = z.infer<typeof CreatureCardSchema>;

export type SpellCard = z.infer<typeof SpellCardSchema>;

export type ArtifactCard = z.infer<typeof ArtifactCardSchema>;

export type CreateCard = z.infer<typeof CreateCardSchema>;

export type UpdateCard = z.infer<typeof UpdateCardSchema>;

export interface UICard extends Card {
	/** Current attack value (may be modified from base power) */
	attack?: number;

	/** Current defense value (may be modified from base toughness) */
	defense?: number;

	/** Whether the card can be played right now */
	isPlayable?: boolean;

	/** Whether the card is currently selected */
	isSelected?: boolean;

	/** Current location of the card */
	zone?: 'hand' | 'deck' | 'board' | 'graveyard' | 'exile';

	/** Whether the card is in hand */
	inHand?: boolean;

	/** Whether the card is on board */
	onBoard?: boolean;

	/** Active animations on the card */
	animations?: string[];

	/** Temporary modifications to the card */
	modifiers?: Array<{
		type: string;
		value: number;
		duration?: number;
	}>;

	/** Description - simplified version of displayEffect for UI */
	description?: string;
}
