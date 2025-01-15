import { z } from '@hono/zod-openapi';

export const GameStatisticsSchema = z
	.object({
		totalGamesPlayed: z.number().openapi({ description: 'Total number of games played.' }),
		averageGameDuration: z.number().openapi({ description: 'Average duration of a game in seconds.' }),
		mostPopularDeck: z.string().openapi({ description: 'ID of the most popular deck.' }),
	})
	.openapi({ description: 'Statistics about the game.' });

export type GameStatistics = z.infer<typeof GameStatisticsSchema>;
