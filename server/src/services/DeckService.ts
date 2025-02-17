import { Context } from 'hono';
import { gameConfig } from '../config/game';

// TODO: Create proper deck types in types folder
interface Deck {
	id: string;
	name: string;
	cards: string[];
	ownerId: string;
}

export class DeckService {
	static async getDeck(c: Context<{ Bindings: Env }>, deckId: string): Promise<Deck | null> {
		try {
			return await c.env.DECK_KV.get(deckId, 'json');
		} catch (error) {
			console.error(`Error fetching deck ${deckId}:`, error);
			return null;
		}
	}

	static async getPlayerDecks(c: Context<{ Bindings: Env }>, playerId: string): Promise<Deck[]> {
		try {
			return [];
		} catch (error) {
			console.error(`Error fetching player decks:`, error);
			return [];
		}
	}

	static async createDeck(c: Context<{ Bindings: Env }>, deckData: Omit<Deck, 'id'>): Promise<Deck> {
		try {
			if (deckData.cards.length < gameConfig.deck.minPerDeck || deckData.cards.length > gameConfig.deck.maxPerDeck) {
				throw new Error('Invalid deck size');
			}

			const newDeck: Deck = {
				...deckData,
				id: crypto.randomUUID(),
			};

			await c.env.DECK_KV.put(`player:${deckData.ownerId}:deck:${newDeck.id}`, JSON.stringify(newDeck));

			return newDeck;
		} catch (error) {
			console.error('Error creating deck:', error);
			throw new Error('Failed to create deck');
		}
	}

	static async updateDeck(c: Context<{ Bindings: Env }>, deckId: string, updateData: Partial<Deck>): Promise<Deck> {
		try {
			const existingDeck = await this.getDeck(c, deckId);
			if (!existingDeck) throw new Error('Deck not found');

			const updatedDeck = {
				...existingDeck,
				...updateData,
				id: deckId, // Ensure ID doesn't change
			};

			await c.env.DECK_KV.put(`player:${updatedDeck.ownerId}:deck:${deckId}`, JSON.stringify(updatedDeck));

			return updatedDeck;
		} catch (error) {
			console.error('Error updating deck:', error);
			throw new Error('Failed to update deck');
		}
	}

	static async deleteDeck(c: Context<{ Bindings: Env }>, deckId: string, ownerId: string): Promise<boolean> {
		try {
			await c.env.DECK_KV.delete(`player:${ownerId}:deck:${deckId}`);
			return true;
		} catch (error) {
			console.error('Error deleting deck:', error);
			return false;
		}
	}

	static async validateDeck(c: Context<{ Bindings: Env }>, deck: Deck): Promise<boolean> {
		// Check deck size
		if (deck.cards.length < gameConfig.deck.minPerDeck || deck.cards.length > gameConfig.deck.maxPerDeck) {
			return false;
		}

		// Check card copy limits
		const cardCounts = deck.cards.reduce((acc, cardId) => {
			acc[cardId] = (acc[cardId] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		return !Object.values(cardCounts).some((count) => count > gameConfig.deck.maxCopiesPerCard);
	}

	static async listDecks(c: Context<{ Bindings: Env }>): Promise<Deck[]> {
		try {
			const { keys } = await c.env.DECK_KV.list({ prefix: 'player:' });
			const decks = await Promise.all(
				keys.map(async (key) => {
					const deck = await c.env.DECK_KV.get(key.name, 'json');
					return deck;
				})
			);
			return decks.filter((deck): deck is Deck => deck !== null);
		} catch (error) {
			console.error('Error listing decks:', error);
			return [];
		}
	}
}
