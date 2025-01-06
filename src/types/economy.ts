import { z } from '@hono/zod-openapi';

export const BalanceSchema = z
	.object({
		playerId: z.string().uuid().openapi({ description: 'ID of the player.' }),
		balance: z.number().openapi({ description: 'Current balance of the player.' }),
	})
	.openapi({ description: 'In-game currency balance of a player.' });

export const PurchaseItemSchema = z
	.object({
		playerId: z.string().uuid().openapi({ description: 'ID of the player.' }),
		itemId: z.string().uuid().openapi({ description: 'ID of the item to purchase.' }),
	})
	.openapi({ description: 'Data required to purchase an item.' });

export type Balance = z.infer<typeof BalanceSchema>;
