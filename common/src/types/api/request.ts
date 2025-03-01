import { z } from '@hono/zod-openapi';
import { CreateCardSchema, UpdateCardSchema } from '../base/card';
import { CreateDeckSchema, UpdateDeckSchema } from '../base/deck';
import { CreatePlayerSchema, UpdatePlayerSchema } from '../base/player';
import { CreateGameSchema } from '../game/state';

export const PaginationParamsSchema = z
	.object({
		page: z.number().int().min(1).default(1).openapi({
			description: 'Page number (1-based)',
			example: 1,
		}),
		limit: z.number().int().min(1).max(100).default(20).openapi({
			description: 'Number of items per page',
			example: 20,
		}),
		sortBy: z.string().optional().openapi({
			description: 'Field to sort by',
			example: 'createdAt',
		}),
		sortOrder: z.enum(['asc', 'desc']).default('desc').openapi({
			description: 'Sort order',
			example: 'desc',
		}),
	})
	.openapi({
		description: 'Common pagination parameters',
	});

export const LoginRequestSchema = z
	.object({
		email: z.string().email().openapi({
			description: 'User email address',
			example: 'player@example.com',
		}),
		password: z.string().min(8).openapi({
			description: 'User password',
			example: 'securePassword123',
		}),
	})
	.openapi({
		description: 'Login request data',
	});

export const RegisterRequestSchema = z
	.object({
		email: z.string().email().openapi({
			description: 'User email address',
			example: 'player@example.com',
		}),
		password: z.string().min(8).openapi({
			description: 'User password',
			example: 'securePassword123',
		}),
		username: z.string().min(3).max(30).openapi({
			description: 'Desired username',
			example: 'DragonMaster',
		}),
	})
	.openapi({
		description: 'Registration request data',
	});

export const MagicLinkRequestSchema = z
	.object({
		email: z.string().email().openapi({
			description: 'User email address',
			example: 'player@example.com',
		}),
	})
	.openapi({
		description: 'Magic link request data',
	});

export const MagicLinkVerifySchema = z
	.object({
		token: z.string().openapi({
			description: 'Magic link token',
			example: 'xyz123abc456def789',
		}),
	})
	.openapi({
		description: 'Magic link verification data',
	});

export const CardQueryParamsSchema = PaginationParamsSchema.extend({
	type: z.enum(['creature', 'spell', 'artifact']).optional().openapi({
		description: 'Filter by card type',
		example: 'creature',
	}),
	rarity: z.enum(['common', 'uncommon', 'rare', 'legendary']).optional().openapi({
		description: 'Filter by card rarity',
		example: 'rare',
	}),
	search: z.string().optional().openapi({
		description: 'Search term for card name or text',
		example: 'dragon',
	}),
}).openapi({
	description: 'Query parameters for card listing',
});

export const CreateCardRequestSchema = CreateCardSchema;

export const UpdateCardRequestSchema = UpdateCardSchema;

export const DeckQueryParamsSchema = PaginationParamsSchema.extend({
	format: z.enum(['standard', 'modern', 'legacy', 'commander']).optional().openapi({
		description: 'Filter by deck format',
		example: 'standard',
	}),
	search: z.string().optional().openapi({
		description: 'Search term for deck name',
		example: 'control',
	}),
}).openapi({
	description: 'Query parameters for deck listing',
});

export const CreateDeckRequestSchema = CreateDeckSchema;

export const UpdateDeckRequestSchema = UpdateDeckSchema;

export const PlayerQueryParamsSchema = PaginationParamsSchema.extend({
	search: z.string().optional().openapi({
		description: 'Search term for player username',
		example: 'dragon',
	}),
	rankTier: z.enum(['bronze', 'silver', 'gold', 'platinum', 'diamond']).optional().openapi({
		description: 'Filter by rank tier',
		example: 'gold',
	}),
}).openapi({
	description: 'Query parameters for player listing',
});

export const CreatePlayerRequestSchema = CreatePlayerSchema;

export const UpdatePlayerRequestSchema = UpdatePlayerSchema;

export const UpdatePlayerPreferencesRequestSchema = z
	.object({
		language: z.string().min(2).max(5).optional().openapi({
			description: 'Preferred language code',
			example: 'en-US',
		}),
		theme: z.enum(['light', 'dark', 'system']).optional().openapi({
			description: 'UI theme preference',
			example: 'dark',
		}),
		notifications: z
			.object({
				email: z.boolean(),
				push: z.boolean(),
				inGame: z.boolean(),
			})
			.optional()
			.openapi({
				description: 'Notification settings',
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
	.partial()
	.openapi({ description: 'Player preferences update data' });

export const CreateGameRequestSchema = CreateGameSchema;

export const GameActionRequestSchema = z
	.object({
		type: z
			.enum(['play_card', 'attack', 'block', 'activate_ability', 'pass_priority', 'mulligan', 'concede'])
			.openapi({ description: 'Type of action to perform', example: 'play_card' }),
		sourceId: z.string().uuid().optional().openapi({
			description: 'ID of the card performing the action',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		targetIds: z
			.array(z.string().uuid())
			.optional()
			.openapi({
				description: 'IDs of action targets',
				example: ['123e4567-e89b-12d3-a456-426614174000'],
			}),
		position: z
			.object({
				x: z.number().int().min(0).max(6),
				y: z.number().int().min(0).max(4),
			})
			.optional()
			.openapi({
				description: 'Board position for placement',
				example: { x: 2, y: 1 },
			}),
	})
	.openapi({ description: 'Game action data' });

export const PurchaseRequestSchema = z
	.object({
		playerId: z.string().uuid().openapi({
			description: 'ID of the player making the purchase',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		itemId: z.string().uuid().openapi({
			description: 'ID of the item to purchase',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		quantity: z.number().int().min(1).default(1).openapi({
			description: 'Quantity to purchase',
			example: 1,
		}),
		currencyType: z.enum(['coins', 'gems']).openapi({
			description: 'Type of currency to use',
			example: 'coins',
		}),
	})
	.openapi({ description: 'Purchase request data' });

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export type MagicLinkRequest = z.infer<typeof MagicLinkRequestSchema>;

export type MagicLinkVerify = z.infer<typeof MagicLinkVerifySchema>;

export type CardQueryParams = z.infer<typeof CardQueryParamsSchema>;

export type CreateCardRequest = z.infer<typeof CreateCardRequestSchema>;

export type UpdateCardRequest = z.infer<typeof UpdateCardRequestSchema>;

export type DeckQueryParams = z.infer<typeof DeckQueryParamsSchema>;

export type CreateDeckRequest = z.infer<typeof CreateDeckRequestSchema>;

export type UpdateDeckRequest = z.infer<typeof UpdateDeckRequestSchema>;

export type PlayerQueryParams = z.infer<typeof PlayerQueryParamsSchema>;

export type UpdatePlayerPreferencesRequest = z.infer<typeof UpdatePlayerPreferencesRequestSchema>;

export type CreateGameRequest = z.infer<typeof CreateGameRequestSchema>;

export type GameActionRequest = z.infer<typeof GameActionRequestSchema>;

export type PurchaseRequest = z.infer<typeof PurchaseRequestSchema>;
