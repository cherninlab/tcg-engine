import { z } from '@hono/zod-openapi';

export const SessionStateSchema = z.enum(['waiting', 'in_progress', 'ended']).openapi({ description: 'The current state of the session.' });

export const BoardStateSchema = z
	.object({
		player1Board: z.array(z.string().uuid()).openapi({ description: "Cards on Player 1's board." }),
		player2Board: z.array(z.string().uuid()).openapi({ description: "Cards on Player 2's board." }),
	})
	.openapi({ description: 'The state of the game board for both players.' });

export const PlayerStateSchema = z
	.object({
		playerId: z.string().uuid().openapi({ description: 'Unique identifier of the player.' }),
		life: z.number().openapi({ description: 'Current life total of the player.' }),
		hand: z.array(z.string().uuid()).openapi({ description: "Cards in the player's hand." }),
		deck: z.array(z.string().uuid()).openapi({ description: "Cards remaining in the player's deck." }),
		discardPile: z.array(z.string().uuid()).optional().openapi({
			description: "Cards in the player's discard pile, if applicable.",
		}),
		graveyard: z.array(z.string().uuid()).optional().openapi({
			description: "Cards in the player's graveyard, if applicable.",
		}),
		active: z.boolean().openapi({
			description: 'Whether the player is currently active in the session.',
		}),
		mana: z.number().min(0).default(0).openapi({ description: 'Current mana available to the player.' }),
		effects: z
			.array(
				z.object({
					id: z.string().uuid(),
					type: z.string(),
					duration: z.number(),
					value: z.any(),
				})
			)
			.optional()
			.openapi({ description: 'Active effects on the player.' }),
	})
	.openapi({ description: 'The current state of a player in the session.' });

export const SessionSchema = z
	.object({
		id: z.string().uuid().openapi({ description: 'Unique identifier of the session.' }),
		players: z.array(z.string().uuid()).openapi({ description: 'IDs of the players in the session.' }),
		state: SessionStateSchema,
		createdAt: z.number().openapi({ description: 'Timestamp when the session was created.' }),
		lastActiveAt: z.number().optional().openapi({ description: 'Timestamp of the last activity in the session.' }),
		endedAt: z.number().optional().openapi({ description: 'Timestamp when the session ended, if applicable.' }),
		winnerId: z.string().uuid().optional().openapi({ description: 'ID of the winning player, if the game has ended.' }),
		turn: z.number().optional().openapi({ description: 'Current turn number, if applicable.' }),
		phase: z.enum(['draw', 'main1', 'combat', 'main2', 'end']).optional().openapi({ description: 'Current phase of the turn.' }),
		boardState: BoardStateSchema.optional().openapi({
			description: 'Current state of the game board, if applicable.',
		}),
		playerStates: z.array(PlayerStateSchema).openapi({ description: 'States of all players in the session.' }),
		actionLog: z
			.array(
				z.object({
					id: z.string().uuid(),
					type: z.string(),
					playerId: z.string().uuid(),
					timestamp: z.number(),
					data: z.any(),
				})
			)
			.optional()
			.openapi({ description: 'Log of actions performed in the session.' }),
	})
	.openapi({ description: 'A session representing a game between players.' });

export const CreateSessionSchema = z
	.object({
		playerId: z.string().uuid().openapi({ description: 'ID of the player creating the session.' }),
		deckId: z.string().uuid().openapi({ description: 'ID of the deck to use in the session.' }),
	})
	.openapi({ description: 'Data required to create a new session.' });

export const JoinSessionSchema = z
	.object({
		sessionId: z.string().uuid().openapi({ description: 'ID of the session to join.' }),
		playerId: z.string().uuid().openapi({ description: 'ID of the player joining the session.' }),
		deckId: z.string().uuid().openapi({ description: 'ID of the deck to use in the session.' }),
	})
	.openapi({ description: 'Data required to join an existing session.' });

export type SessionState = z.infer<typeof SessionStateSchema>;
export type BoardState = z.infer<typeof BoardStateSchema>;
export type PlayerState = z.infer<typeof PlayerStateSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type CreateSession = z.infer<typeof CreateSessionSchema>;
export type JoinSession = z.infer<typeof JoinSessionSchema>;
