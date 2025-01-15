import { Player, UpdatePlayer } from '@tcg-game-template/common/src';
import { Context } from 'hono';
import { gameConfig } from '../config/game';

export class PlayerService {
	static async getPlayer(c: Context<{ Bindings: Env }>, playerId: string): Promise<Player | null> {
		try {
			return await c.env.PLAYER_KV.get(playerId, 'json');
		} catch (error) {
			console.error(`Error fetching player ${playerId}:`, error);
			return null;
		}
	}

	static async createPlayer(c: Context<{ Bindings: Env }>, playerData: Omit<Player, 'id' | 'balance' | 'decks'>): Promise<Player> {
		try {
			const newPlayer: Player = {
				id: crypto.randomUUID(),
				balance: gameConfig.economy.startingBalance,
				decks: [],
				...playerData,
			};

			await c.env.PLAYER_KV.put(newPlayer.id, JSON.stringify(newPlayer));
			return newPlayer;
		} catch (error) {
			console.error('Error creating player:', error);
			throw new Error('Failed to create player');
		}
	}

	static async updatePlayer(c: Context<{ Bindings: Env }>, playerId: string, updateData: UpdatePlayer): Promise<Player> {
		try {
			const existingPlayer = await this.getPlayer(c, playerId);
			if (!existingPlayer) throw new Error('Player not found');

			const updatedPlayer = {
				...existingPlayer,
				...updateData,
			};

			await c.env.PLAYER_KV.put(playerId, JSON.stringify(updatedPlayer));
			return updatedPlayer;
		} catch (error) {
			console.error('Error updating player:', error);
			throw new Error('Failed to update player');
		}
	}

	static async deletePlayer(c: Context<{ Bindings: Env }>, playerId: string): Promise<boolean> {
		try {
			await c.env.PLAYER_KV.delete(playerId);
			return true;
		} catch (error) {
			console.error('Error deleting player:', error);
			return false;
		}
	}

	static async addDeckToPlayer(c: Context<{ Bindings: Env }>, playerId: string, deckId: string): Promise<Player> {
		try {
			const player = await this.getPlayer(c, playerId);
			if (!player) throw new Error('Player not found');

			if (!player.decks.includes(deckId)) {
				player.decks.push(deckId);
				await c.env.PLAYER_KV.put(playerId, JSON.stringify(player));
			}

			return player;
		} catch (error) {
			console.error('Error adding deck to player:', error);
			throw new Error('Failed to add deck to player');
		}
	}

	static async removeDeckFromPlayer(c: Context<{ Bindings: Env }>, playerId: string, deckId: string): Promise<Player> {
		try {
			const player = await this.getPlayer(c, playerId);
			if (!player) throw new Error('Player not found');

			player.decks = player.decks.filter((id) => id !== deckId);
			await c.env.PLAYER_KV.put(playerId, JSON.stringify(player));

			return player;
		} catch (error) {
			console.error('Error removing deck from player:', error);
			throw new Error('Failed to remove deck from player');
		}
	}
}
