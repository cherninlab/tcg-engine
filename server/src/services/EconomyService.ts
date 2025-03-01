import { Balance, Player, PurchaseItem, StoreItem } from '@rism-tcg/common/src';
import { Context } from 'hono';
import { gameConfig } from '../config/game';

export class EconomyService {
	static async getBalance(c: Context<{ Bindings: Env }>, playerId: string): Promise<number> {
		try {
			const player: Player | null = await c.env.PLAYER_KV.get(playerId, 'json');
			return player?.balance ?? 0;
		} catch (error) {
			console.error(`Error fetching balance for player ${playerId}:`, error);
			return 0;
		}
	}

	static async addBalance(c: Context<{ Bindings: Env }>, playerId: string, amount: number): Promise<Balance> {
		try {
			const currentBalance = await this.getBalance(c, playerId);
			const newBalance = currentBalance + amount;

			const player: Player | null = await c.env.PLAYER_KV.get(playerId, 'json');
			await c.env.PLAYER_KV.put(
				playerId,
				JSON.stringify({
					...player,
					balance: newBalance,
				})
			);

			return {
				playerId,
				balance: newBalance,
			};
		} catch (error) {
			console.error('Error adding balance:', error);
			throw new Error('Failed to add balance');
		}
	}

	static async deductBalance(c: Context<{ Bindings: Env }>, playerId: string, amount: number): Promise<Balance> {
		try {
			const currentBalance = await this.getBalance(c, playerId);
			if (currentBalance < amount) {
				throw new Error('Insufficient funds');
			}

			const newBalance = currentBalance - amount;
			const player: Player | null = await c.env.PLAYER_KV.get(playerId, 'json');

			await c.env.PLAYER_KV.put(
				playerId,
				JSON.stringify({
					...player,
					balance: newBalance,
				})
			);

			return {
				playerId,
				balance: newBalance,
			};
		} catch (error) {
			console.error('Error deducting balance:', error);
			throw error;
		}
	}

	static async purchaseItem(c: Context<{ Bindings: Env }>, purchaseData: PurchaseItem): Promise<boolean> {
		try {
			const player = await c.env.PLAYER_KV.get(purchaseData.playerId, 'json');
			if (!player) throw new Error('Player not found');

			const item = (await c.env.CARD_KV.get(purchaseData.itemId, 'json')) as StoreItem;
			if (!item) throw new Error('Item not found');

			await this.deductBalance(c, purchaseData.playerId, item.price);

			// Record purchase history
			await c.env.PLAYER_KV.put(
				`purchase:${purchaseData.playerId}:${Date.now()}`,
				JSON.stringify({
					...purchaseData,
					timestamp: Date.now(),
					price: item.price,
				})
			);

			return true;
		} catch (error) {
			console.error('Error processing purchase:', error);
			throw error;
		}
	}

	static async getDailyReward(c: Context<{ Bindings: Env }>, playerId: string): Promise<Balance> {
		try {
			const lastRewardKey = `daily_reward:${playerId}`;
			const lastReward = await c.env.PLAYER_KV.get(lastRewardKey);

			if (lastReward) {
				const lastRewardTime = parseInt(lastReward);
				const now = Date.now();
				const oneDayMs = 24 * 60 * 60 * 1000;

				if (now - lastRewardTime < oneDayMs) {
					throw new Error('Daily reward already claimed');
				}
			}

			await c.env.PLAYER_KV.put(lastRewardKey, Date.now().toString());
			return await this.addBalance(c, playerId, gameConfig.economy.dailyReward);
		} catch (error) {
			console.error('Error processing daily reward:', error);
			throw error;
		}
	}
}
