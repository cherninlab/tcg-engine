import { Card, CardCreate, CardUpdate } from '@rism-tcg/common/src';
import { Context } from 'hono';

export class CardService {
	static async getAllCards(c: Context<{ Bindings: Env }>): Promise<Card[]> {
		try {
			const cards = [];
			const list = await c.env.CARD_KV.list();

			for (const key of list.keys) {
				const card: Card | null = await c.env.CARD_KV.get(key.name, 'json');
				if (card) cards.push(card);
			}

			return cards;
		} catch (error) {
			console.error('Error fetching cards:', error);
			return [];
		}
	}

	static async getCard(c: Context<{ Bindings: Env }>, cardId: string): Promise<Card | null> {
		try {
			return await c.env.CARD_KV.get(cardId, 'json');
		} catch (error) {
			console.error(`Error fetching card ${cardId}:`, error);
			return null;
		}
	}

	static async createCard(c: Context<{ Bindings: Env }>, cardData: CardCreate): Promise<Card> {
		try {
			const card: Card = {
				...cardData,
				id: crypto.randomUUID(),
			};

			await c.env.CARD_KV.put(card.id, JSON.stringify(card));
			return card;
		} catch (error) {
			console.error('Error creating card:', error);
			throw new Error('Failed to create card');
		}
	}

	static async updateCard(c: Context<{ Bindings: Env }>, cardId: string, updateData: CardUpdate): Promise<Card> {
		try {
			const existingCard = await this.getCard(c, cardId);
			if (!existingCard) throw new Error('Card not found');

			const updatedCard: Card = {
				...existingCard,
				...updateData,
			};

			await c.env.CARD_KV.put(cardId, JSON.stringify(updatedCard));
			return updatedCard;
		} catch (error) {
			console.error('Error updating card:', error);
			throw new Error('Failed to update card');
		}
	}

	static async deleteCard(c: Context<{ Bindings: Env }>, cardId: string): Promise<boolean> {
		try {
			await c.env.CARD_KV.delete(cardId);
			return true;
		} catch (error) {
			console.error('Error deleting card:', error);
			return false;
		}
	}

	static async getCardImage(c: Context<{ Bindings: Env }>, cardId: string): Promise<ArrayBuffer | null> {
		try {
			const obj = await c.env.CARD_IMAGES.get(`cards/${cardId}.png`);
			if (!obj) return null;
			return await obj.arrayBuffer();
		} catch (error) {
			console.error('Error fetching card image:', error);
			return null;
		}
	}
}
