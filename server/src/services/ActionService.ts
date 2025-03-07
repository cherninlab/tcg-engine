import { Action, ActionResponse } from '@rism-tcg/common/src';
import { Context } from 'hono';

export class ActionService {
	static async processAction(c: Context<{ Bindings: Env }>, actionData: Action): Promise<ActionResponse> {
		try {
			return {} as ActionResponse;
		} catch (error) {
			console.error('Error processing action:', error);
			throw new Error('Failed to process action');
		}
	}

	static async getActionHistory(c: Context<{ Bindings: Env }>, playerId: string): Promise<Action[]> {
		try {
			return [];
		} catch (error) {
			console.error('Error fetching action history:', error);
			return [];
		}
	}
}
