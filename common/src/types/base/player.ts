import { z } from '@hono/zod-openapi';

export const PlayerStatsSchema = z
	.object({
		gamesPlayed: z.number().int().min(0).openapi({
			description: 'Total number of games played',
			example: 100,
		}),
		gamesWon: z.number().int().min(0).openapi({
			description: 'Total number of games won',
			example: 60,
		}),
		gamesLost: z.number().int().min(0).openapi({
			description: 'Total number of games lost',
			example: 40,
		}),
		winRate: z.number().min(0).max(100).openapi({
			description: 'Win rate percentage',
			example: 60,
		}),
		rank: z.number().int().min(0).openapi({
			description: "Player's current rank",
			example: 15,
		}),
		rankTier: z.enum(['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master']).openapi({
			description: "Player's rank tier",
			example: 'gold',
		}),
		seasonPoints: z.number().int().min(0).openapi({
			description: 'Points earned in current season',
			example: 1250,
		}),
	})
	.openapi({
		description: 'Player statistics and rankings',
	});

export const PlayerPreferencesSchema = z
	.object({
		language: z.string().min(2).max(5).openapi({
			description: 'Preferred language code (e.g. "en-US")',
			example: 'en-US',
		}),
		theme: z.enum(['light', 'dark', 'system']).openapi({
			description: 'UI theme preference',
			example: 'dark',
		}),
		notifications: z
			.object({
				email: z.boolean(),
				push: z.boolean(),
				inGame: z.boolean(),
			})
			.openapi({
				description: 'Notification preferences',
				example: { email: true, push: true, inGame: true },
			}),
		accessibility: z
			.object({
				colorblindMode: z.boolean(),
				reducedMotion: z.boolean(),
				largeText: z.boolean(),
			})
			.optional()
			.openapi({
				description: 'Accessibility settings',
				example: { colorblindMode: false, reducedMotion: false, largeText: false },
			}),
	})
	.openapi({
		description: 'Player preferences and settings',
	});

export const PlayerSchema = z
	.object({
		id: z.string().uuid().openapi({
			description: 'Unique identifier of the player',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		username: z
			.string()
			.min(3)
			.max(30)
			.regex(/^[a-zA-Z0-9_-]+$/)
			.openapi({
				description: "Player's username",
				example: 'DragonMaster',
			}),
		email: z.string().email().openapi({
			description: "Player's email address",
			example: 'player@example.com',
		}),
		displayName: z.string().min(1).max(50).optional().openapi({
			description: "Player's display name",
			example: 'The Dragon Master',
		}),
		avatarUrl: z.string().url().optional().openapi({
			description: "URL to player's avatar image",
			example: 'https://assets.tcg-engine.com/avatars/dragon-master.jpg',
		}),
		status: z.enum(['online', 'offline', 'in_game', 'away']).openapi({
			description: "Player's current status",
			example: 'online',
		}),
		balance: z
			.object({
				coins: z.number().int().min(0).openapi({
					description: 'In-game currency balance',
					example: 1000,
				}),
				gems: z.number().int().min(0).openapi({
					description: 'Premium currency balance',
					example: 50,
				}),
			})
			.openapi({
				description: "Player's currency balances",
			}),
		inventory: z
			.object({
				cardCount: z.number().int().min(0).openapi({
					description: 'Total number of cards owned',
					example: 500,
				}),
				deckSlots: z.number().int().min(1).openapi({
					description: 'Number of deck slots available',
					example: 10,
				}),
			})
			.openapi({
				description: "Player's inventory information",
			}),
		decks: z.array(z.string().uuid()).openapi({
			description: 'List of deck IDs owned by the player',
			example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
		}),
		stats: PlayerStatsSchema,
		preferences: PlayerPreferencesSchema,
		createdAt: z.string().datetime().openapi({
			description: 'When the player account was created',
			example: '2024-01-15T12:00:00Z',
		}),
		updatedAt: z.string().datetime().openapi({
			description: 'When the player was last updated',
			example: '2024-03-04T12:00:00Z',
		}),
		lastLoginAt: z.string().datetime().optional().openapi({
			description: 'When the player last logged in',
			example: '2024-03-04T12:00:00Z',
		}),
	})
	.openapi({
		description: 'A player in the game',
	});

export const CreatePlayerSchema = PlayerSchema.omit({
	id: true,
	balance: true,
	inventory: true,
	decks: true,
	stats: true,
	status: true,
	createdAt: true,
	updatedAt: true,
	lastLoginAt: true,
})
	.extend({
		password: z
			.string()
			.min(8)
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
				'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
			)
			.openapi({
				description: "Player's password",
				example: 'SecureP@ss123',
			}),
	})
	.openapi({
		description: 'Data required to create a new player',
	});

export const UpdatePlayerSchema = PlayerSchema.omit({
	id: true,
	email: true,
	createdAt: true,
	updatedAt: true,
	lastLoginAt: true,
})
	.partial()
	.openapi({
		description: 'Data that can be updated for a player',
	});

export const PlayerAuthSchema = z
	.object({
		email: z.string().email().openapi({
			description: "Player's email address",
			example: 'player@example.com',
		}),
		password: z.string().openapi({
			description: "Player's password",
			example: 'SecureP@ss123',
		}),
	})
	.openapi({
		description: 'Player authentication credentials',
	});

export type PlayerStats = z.infer<typeof PlayerStatsSchema>;

export type PlayerPreferences = z.infer<typeof PlayerPreferencesSchema>;

export type Player = z.infer<typeof PlayerSchema>;

export type CreatePlayer = z.infer<typeof CreatePlayerSchema>;

export type UpdatePlayer = z.infer<typeof UpdatePlayerSchema>;

export type PlayerAuth = z.infer<typeof PlayerAuthSchema>;

export interface GamePlayer {
	/** The player's unique identifier */
	id: string;

	/** The player's username */
	username: string;

	/** URL to the player's avatar image */
	avatarUrl?: string;

	/** Current health points */
	health: number;

	/** Maximum health points */
	maxHealth: number;

	/** Current mana available */
	mana: number;

	/** Maximum mana capacity */
	maxMana: number;

	/** Cards in deck (IDs) */
	deck: string[];

	/** Cards in hand (IDs) */
	hand: string[];

	/** Cards on board (IDs) */
	board: string[];

	/** Cards in graveyard (IDs) */
	graveyard: string[];

	/** Cards in exile (IDs) */
	exile: string[];

	/** Whether this player is currently active */
	isActive: boolean;

	/** Active effects on the player */
	effects: Array<{
		type: string;
		value: number;
		duration?: number;
	}>;

	/** Number of shield counters */
	shields: number;

	/** Special energy resource */
	energy: number;
}
