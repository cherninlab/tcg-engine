import { z } from '@hono/zod-openapi';
import { Card } from './card';

export const DeckCardSchema = z
	.object({
		cardId: z.string().uuid().openapi({
			description: 'ID of the card in the deck',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		quantity: z.number().int().min(1).max(4).openapi({
			description: 'Number of copies of this card in the deck',
			example: 3,
		}),
	})
	.openapi({
		description: 'A card entry in a deck with its quantity',
	});

export const DeckStatsSchema = z
	.object({
		gamesPlayed: z.number().int().min(0).openapi({
			description: 'Number of games played with this deck',
			example: 100,
		}),
		gamesWon: z.number().int().min(0).openapi({
			description: 'Number of games won with this deck',
			example: 60,
		}),
		winRate: z.number().min(0).max(100).openapi({
			description: 'Win rate percentage with this deck',
			example: 60,
		}),
		averageGameLength: z.number().min(0).openapi({
			description: 'Average game duration in minutes',
			example: 12.5,
		}),
		favoriteCard: z.string().uuid().optional().openapi({
			description: 'Most played card in this deck',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
	})
	.openapi({
		description: 'Statistics for a deck',
	});

export const DeckSchema = z
	.object({
		id: z.string().uuid().openapi({
			description: 'Unique identifier of the deck',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		name: z.string().min(1).max(50).openapi({
			description: 'Name of the deck',
			example: 'Dragon Control',
		}),
		description: z.string().max(500).optional().openapi({
			description: 'Description of the deck strategy',
			example: 'A control deck focused on powerful dragons and removal spells',
		}),
		format: z.enum(['standard', 'modern', 'legacy', 'commander']).openapi({
			description: 'Game format this deck is legal in',
			example: 'standard',
		}),
		ownerId: z.string().uuid().openapi({
			description: 'ID of the player who owns this deck',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		cards: z.array(DeckCardSchema).min(40).max(60).openapi({
			description: 'Cards in the deck with their quantities',
		}),
		colors: z.array(z.enum(['white', 'blue', 'black', 'red', 'green'])).openapi({
			description: 'Color identity of the deck',
			example: ['blue', 'black'],
		}),
		tags: z
			.array(z.string())
			.max(10)
			.openapi({
				description: 'User-defined tags for the deck',
				example: ['control', 'dragons', 'competitive'],
			}),
		coverCard: z.string().uuid().optional().openapi({
			description: 'ID of the card to use as deck cover',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		stats: DeckStatsSchema,
		isPublic: z.boolean().openapi({
			description: 'Whether the deck is visible to other players',
			example: true,
		}),
		isFavorite: z.boolean().openapi({
			description: 'Whether the deck is marked as favorite',
			example: false,
		}),
		createdAt: z.string().datetime().openapi({
			description: 'When the deck was created',
			example: '2024-03-04T12:00:00Z',
		}),
		updatedAt: z.string().datetime().openapi({
			description: 'When the deck was last modified',
			example: '2024-03-04T14:30:00Z',
		}),
		lastPlayedAt: z.string().datetime().optional().openapi({
			description: 'When the deck was last used in a game',
			example: '2024-03-04T15:45:00Z',
		}),
	})
	.openapi({
		description: 'A deck of cards',
	})
	.refine(
		(deck) => {
			// Count total cards to ensure minimum deck size
			const totalCards = deck.cards.reduce((sum, card) => sum + card.quantity, 0);
			return totalCards >= 40 && totalCards <= 60;
		},
		{
			message: 'Deck must contain between 40 and 60 cards in total',
			path: ['cards'],
		}
	);

export const DeckWithCardsSchema = DeckSchema.extend({
	cards: z.array(
		z.object({
			card: z.any(), // This will be properly typed in the TypeScript types
			quantity: z.number().int().min(1).max(4),
		})
	),
}).openapi({
	description: 'A deck with full card details',
});

export const CreateDeckSchema = DeckSchema.omit({
	id: true,
	stats: true,
	createdAt: true,
	updatedAt: true,
	lastPlayedAt: true,
})
	.extend({
		cards: z.array(DeckCardSchema).min(40),
	})
	.openapi({
		description: 'Data required to create a new deck',
	});

export const UpdateDeckSchema = DeckSchema.omit({
	id: true,
	ownerId: true,
	stats: true,
	createdAt: true,
	updatedAt: true,
	lastPlayedAt: true,
})
	.partial()
	.openapi({
		description: 'Data that can be updated on a deck',
	});

export const DeckAnalysisSchema = z
	.object({
		manaCurve: z.record(z.string(), z.number()).openapi({
			description: 'Distribution of cards by mana cost',
			example: { '1': 4, '2': 8, '3': 12, '4': 8, '5': 6, '6+': 2 },
		}),
		colorDistribution: z.record(z.string(), z.number()).openapi({
			description: 'Distribution of cards by color',
			example: { blue: 20, black: 16, colorless: 4 },
		}),
		cardTypeDistribution: z.record(z.string(), z.number()).openapi({
			description: 'Distribution of cards by type',
			example: { creature: 24, spell: 12, artifact: 4 },
		}),
		averageManaCost: z.number().openapi({
			description: 'Average mana cost of cards in the deck',
			example: 3.2,
		}),
		recommendations: z
			.array(
				z.object({
					cardId: z.string().uuid(),
					reason: z.string(),
					confidence: z.number().min(0).max(1),
				})
			)
			.openapi({
				description: 'Suggested card changes',
				example: [
					{
						cardId: '123e4567-e89b-12d3-a456-426614174000',
						reason: 'Improves mana curve',
						confidence: 0.85,
					},
				],
			}),
	})
	.openapi({
		description: "Analysis of a deck's composition",
	});

export type Deck = z.infer<typeof DeckSchema>;

export type DeckWithCards = Omit<Deck, 'cards'> & {
	cards: Array<{
		card: Card;
		quantity: number;
	}>;
};

export type DeckCard = z.infer<typeof DeckCardSchema>;

export type DeckStats = z.infer<typeof DeckStatsSchema>;

export type CreateDeck = z.infer<typeof CreateDeckSchema>;

export type UpdateDeck = z.infer<typeof UpdateDeckSchema>;

export type DeckAnalysis = z.infer<typeof DeckAnalysisSchema>;

export interface GameDeck {
	/** The deck's unique identifier */
	id:  string;

	/** Array of card IDs in current order */
	cards: string[];

	/** Player ID who owns this deck */
	owner: string;

	/** Current number of cards in the deck */
	size: number;

	/** ID of the card on top (if revealed) */
	topCard?: string;
}
