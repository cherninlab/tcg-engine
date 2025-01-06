import { z } from '@hono/zod-openapi';

export const StoreItemSchema = z
	.object({
		id: z.string().uuid().openapi({ description: 'Unique identifier of the store item.' }),
		name: z.string().openapi({ description: 'Name of the store item.' }),
		price: z.number().openapi({ description: 'Price of the store item.' }),
		type: z.enum(['card', 'lootbox', 'cosmetic']).openapi({ description: 'Type of the store item.' }),
	})
	.openapi({ description: 'An item available in the store.' });

export const PurchaseItemSchema = z
	.object({
		playerId: z.string().uuid().openapi({ description: 'ID of the player making the purchase.' }),
		itemId: z.string().uuid().openapi({ description: 'ID of the item being purchased.' }),
	})
	.openapi({ description: 'Request to purchase an item from the store.' });

export type StoreItem = z.infer<typeof StoreItemSchema>;
export type PurchaseItem = z.infer<typeof PurchaseItemSchema>;
