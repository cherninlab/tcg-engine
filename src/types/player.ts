import { z } from '@hono/zod-openapi';

export const PlayerSchema = z
	.object({
		id: z.string().uuid().openapi({ description: 'Unique identifier of the player.' }),
		username: z.string().openapi({ description: 'Username of the player.' }),
		email: z.string().email().openapi({ description: 'Email address of the player.' }),
		balance: z.number().openapi({ description: 'In-game currency balance of the player.' }),
		decks: z.array(z.string().uuid()).openapi({ description: 'IDs of the decks owned by the player.' }),
	})
	.openapi({ description: 'Information about a player.' });

export const UpdatePlayerSchema = z
	.object({
		username: z.string().optional().openapi({ description: 'New username for the player.' }),
		email: z.string().email().optional().openapi({ description: 'New email address for the player.' }),
	})
	.openapi({ description: 'Request to update player information.' });

export type Player = z.infer<typeof PlayerSchema>;
export type UpdatePlayer = z.infer<typeof UpdatePlayerSchema>;
