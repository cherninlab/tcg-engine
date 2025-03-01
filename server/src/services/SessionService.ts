import { Deck, Session } from '@rism-tcg/common/src';
import { Context } from 'hono';
import { gameConfig } from '../config/game';

export class SessionService {
	static async createSession(c: Context<{ Bindings: Env }>, playerId: string, deckId: string): Promise<Session> {
		try {
			// Get player's deck
			const deck: Deck | null = await c.env.DECK_KV.get(`player:${playerId}:deck:${deckId}`, 'json');
			if (!deck) throw new Error('Deck not found');

			const session: Session = {
				id: crypto.randomUUID(),
				players: [playerId],
				state: 'waiting',
				createdAt: Date.now(),
				playerStates: [
					{
						playerId,
						life: gameConfig.rules.startingLife,
						hand: [],
						deck: [...deck.cards], // Clone deck array
						mana: 0,
						active: true,
						discardPile: [],
						graveyard: [],
					},
				],
				boardState: {
					player1Board: [],
					player2Board: [],
				},
			};

			await c.env.SESSION_KV.put(session.id, JSON.stringify(session));
			return session;
		} catch (error) {
			console.error('Error creating session:', error);
			throw new Error('Failed to create session');
		}
	}

	static async joinSession(c: Context<{ Bindings: Env }>, sessionId: string, playerId: string, deckId: string): Promise<Session> {
		try {
			const session = await this.getSession(c, sessionId);
			if (!session) throw new Error('Session not found');
			if (session.state !== 'waiting') throw new Error('Session is not available to join');
			if (session.players.includes(playerId)) throw new Error('Player already in session');
			if (session.players.length >= 2) throw new Error('Session is full');

			// Get player's deck
			const deck: Deck | null = await c.env.DECK_KV.get(`player:${playerId}:deck:${deckId}`, 'json');
			if (!deck) throw new Error('Deck not found');

			// Add player to session
			session.players.push(playerId);
			session.playerStates.push({
				playerId,
				life: gameConfig.rules.startingLife,
				hand: [],
				deck: [...deck.cards], // Clone deck array
				mana: 0,
				active: false,
				discardPile: [],
				graveyard: [],
			});

			// If we now have 2 players, start the game
			if (session.players.length === 2) {
				session.state = 'in_progress';
				session.turn = 1;

				// Deal starting hands
				for (const playerState of session.playerStates) {
					for (let i = 0; i < gameConfig.deck.startingHandSize; i++) {
						const card = playerState.deck.pop();
						if (card) playerState.hand.push(card);
					}
				}
			}

			await c.env.SESSION_KV.put(sessionId, JSON.stringify(session));
			return session;
		} catch (error) {
			console.error('Error joining session:', error);
			throw error;
		}
	}

	static async getSession(c: Context<{ Bindings: Env }>, sessionId: string): Promise<Session | null> {
		try {
			return await c.env.SESSION_KV.get(sessionId, 'json');
		} catch (error) {
			console.error(`Error fetching session ${sessionId}:`, error);
			return null;
		}
	}

	static async endSession(c: Context<{ Bindings: Env }>, sessionId: string, winnerId: string): Promise<Session> {
		try {
			const session = await this.getSession(c, sessionId);
			if (!session) throw new Error('Session not found');
			if (session.state !== 'in_progress') throw new Error('Session is not in progress');

			session.state = 'ended';
			session.winnerId = winnerId;
			session.endedAt = Date.now();

			await c.env.SESSION_KV.put(sessionId, JSON.stringify(session));
			return session;
		} catch (error) {
			console.error('Error ending session:', error);
			throw error;
		}
	}

	static async updateSessionState(
		c: Context<{ Bindings: Env }>,
		sessionId: string,
		updateFn: (session: Session) => Promise<Session>
	): Promise<Session> {
		try {
			const session = await this.getSession(c, sessionId);
			if (!session) throw new Error('Session not found');

			const updatedSession = await updateFn(session);
			await c.env.SESSION_KV.put(sessionId, JSON.stringify(updatedSession));

			return updatedSession;
		} catch (error) {
			console.error('Error updating session:', error);
			throw error;
		}
	}

	static async cleanupInactiveSessions(c: Context<{ Bindings: Env }>): Promise<void> {
		try {
			const now = Date.now();
			const list = await c.env.SESSION_KV.list();

			for (const key of list.keys) {
				const session = (await c.env.SESSION_KV.get(key.name, 'json')) as Session;
				if (!session) continue;

				const shouldCleanup =
					(session.state === 'waiting' && now - session.createdAt > gameConfig.session.maxDuration) ||
					(session.state === 'in_progress' && session.lastActiveAt && now - session.lastActiveAt > gameConfig.session.inactivityTimeout);

				if (shouldCleanup) {
					await c.env.SESSION_KV.delete(key.name);
				}
			}
		} catch (error) {
			console.error('Error cleaning up inactive sessions:', error);
		}
	}
}
