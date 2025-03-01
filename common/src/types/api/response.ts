import { z } from '@hono/zod-openapi';
import { CardSchema } from '../base/card';
import { DeckSchema } from '../base/deck';
import { PlayerSchema } from '../base/player';

/**
 * Base schema for paginated responses
 */
export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
	z
		.object({
			items: z.array(itemSchema).openapi({
				description: 'Array of items for the current page',
			}),
			total: z.number().int().min(0).openapi({
				description: 'Total number of items across all pages',
				example: 100,
			}),
			page: z.number().int().min(1).openapi({
				description: 'Current page number',
				example: 1,
			}),
			pageSize: z.number().int().min(1).openapi({
				description: 'Number of items per page',
				example: 20,
			}),
			totalPages: z.number().int().min(1).openapi({
				description: 'Total number of pages',
				example: 5,
			}),
		})
		.openapi({
			description: 'Paginated response wrapper',
		});

/**
 * Authentication response schemas
 */
export const AuthTokenResponseSchema = z
	.object({
		accessToken: z.string().openapi({
			description: 'JWT access token',
			example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
		}),
		refreshToken: z.string().openapi({
			description: 'JWT refresh token',
			example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
		}),
		expiresIn: z.number().int().openapi({
			description: 'Token expiration time in seconds',
			example: 3600,
		}),
	})
	.openapi({
		description: 'Authentication token response',
	});

/**
 * Card response schemas
 */
export const CardResponseSchema = CardSchema;
export const CardsResponseSchema = PaginatedResponseSchema(CardSchema).openapi({
	description: 'Paginated list of cards',
});

/**
 * Deck response schemas
 */
export const DeckResponseSchema = DeckSchema;
export const DecksResponseSchema = PaginatedResponseSchema(DeckSchema).openapi({
	description: 'Paginated list of decks',
});

/**
 * Player response schemas
 */
export const PlayerResponseSchema = PlayerSchema;
export const PlayersResponseSchema = PaginatedResponseSchema(PlayerSchema).openapi({
	description: 'Paginated list of players',
});

/**
 * Error response schema
 */
export const ErrorResponseSchema = z
	.object({
		error: z
			.object({
				code: z.string().openapi({
					description: 'Error code',
					example: 'INVALID_INPUT',
				}),
				message: z.string().openapi({
					description: 'Human-readable error message',
					example: 'Invalid input parameters',
				}),
				details: z
					.array(
						z.object({
							field: z.string().optional().openapi({
								description: 'Field that caused the error',
								example: 'email',
							}),
							message: z.string().openapi({
								description: 'Detailed error message',
								example: 'Email must be a valid email address',
							}),
						})
					)
					.optional()
					.openapi({
						description: 'Additional error details',
					}),
			})
			.openapi({
				description: 'Error information',
			}),
	})
	.openapi({
		description: 'Standard error response',
	});


export type PaginatedResponse<T> = z.infer<ReturnType<typeof PaginatedResponseSchema<z.ZodType<T>>>>;

export type AuthTokenResponse = z.infer<typeof AuthTokenResponseSchema>;

export type CardResponse = z.infer<typeof CardResponseSchema>;

export type CardsResponse = z.infer<typeof CardsResponseSchema>;

export type DeckResponse = z.infer<typeof DeckResponseSchema>;

export type DecksResponse = z.infer<typeof DecksResponseSchema>;

export type PlayerResponse = z.infer<typeof PlayerResponseSchema>;

export type PlayersResponse = z.infer<typeof PlayersResponseSchema>;

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
