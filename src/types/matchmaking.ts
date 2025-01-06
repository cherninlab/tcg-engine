import { z } from '@hono/zod-openapi';

// Matchmaking
export const CreateGameSessionSchema = z
	.object({
		playerId: z.string().uuid().openapi({ description: 'ID of the player creating the session.' }),
		deckId: z.string().uuid().openapi({ description: 'ID of the deck the player is using.' }),
	})
	.openapi({ description: 'Request to create a new game session.' });

export const JoinGameSessionSchema = z
	.object({
		sessionId: z.string().uuid().openapi({ description: 'ID of the session to join.' }),
		playerId: z.string().uuid().openapi({ description: 'ID of the player joining the session.' }),
		deckId: z.string().uuid().openapi({ description: 'ID of the deck the player is using.' }),
	})
	.openapi({ description: 'Request to join an existing game session.' });

export const GameSessionStateSchema = z
	.object({
		sessionId: z.string().uuid().openapi({ description: 'ID of the session.' }),
		players: z.array(z.string().uuid()).openapi({ description: 'IDs of the players in the session.' }),
		state: z.enum(['waiting', 'in_progress', 'ended']).openapi({ description: 'Current state of the session.' }),
		createdAt: z.number().openapi({ description: 'Timestamp when the session was created.' }),
	})
	.openapi({ description: 'Current state of a game session.' });

export type CreateGameSession = z.infer<typeof CreateGameSessionSchema>;
export type JoinGameSession = z.infer<typeof JoinGameSessionSchema>;
export type GameSessionState = z.infer<typeof GameSessionStateSchema>;
