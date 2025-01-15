import { z } from '@hono/zod-openapi';

export const StoreItemSchema = z
	.object({
		id: z.string().uuid().openapi({ description: 'Unique identifier of the store item.' }),
		name: z.string().openapi({ description: 'Name of the store item.' }),
		price: z.number().openapi({ description: 'Price of the store item.' }),
		type: z.enum(['card', 'lootbox', 'cosmetic']).openapi({ description: 'Type of the store item.' }),
	})
	.openapi({ description: 'An item available in the store.' });

export type StoreItem = z.infer<typeof StoreItemSchema>;
