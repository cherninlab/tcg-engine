import type { Card } from '../base/card';
import type { GamePlayer } from '../base/player';
import type { GameAction } from '../game/action';
import type { GamePhase } from '../game/state';

export type CardZone = 'hand' | 'deck' | 'board' | 'graveyard' | 'exile';

export interface CardAnimation {
	type: 'enter' | 'exit' | 'attack' | 'damage' | 'heal' | 'buff' | 'debuff';
	duration: number;
	delay?: number;
}

export interface UICard extends Card {
	/** Current attack value (may be modified from base power) */
	attack?: number;

	/** Current defense value (may be modified from base toughness) */
	defense?: number;

	/** Whether the card can be played right now */
	isPlayable?: boolean;

	/** Whether the card is currently selected */
	isSelected?: boolean;

	/** Current location of the card */
	zone?: CardZone;

	/** Whether the card is in hand */
	inHand?: boolean;

	/** Whether the card is on board */
	onBoard?: boolean;

	/** Active animations on the card */
	animations?: CardAnimation[];

	/** Temporary modifications to the card */
	modifiers?: Array<{
		type: string;
		value: number;
		duration?: number;
	}>;

	/** Description - simplified version of displayEffect for UI */
	description?: string;
}

export interface ClientGameState {
	// Server-provided state (subset of full GameState)
	id: string;
	status: 'waiting' | 'in_progress' | 'finished';
	turn: number;
	phase: GamePhase;

	// Player view of game (what server sends to this specific player)
	player: GamePlayer;
	opponent: GamePlayer;

	// UI-only states (not sent to server except as actions)
	isPlayerTurn: boolean;
	selectedCardId?: string;
	targetingMode: boolean;
	history: GameAction[];

	// Other server-provided data
	winner?: string;
	lastAction?: GameAction;

	// Pure UI concerns
	animations: {
		active: boolean;
		queue: CardAnimation[];
	};
}

// Mock data generators
export const createMockCard = (overrides: Partial<UICard> = {}): UICard => {
	const id = crypto.randomUUID();
	const types = ['creature', 'spell', 'artifact'] as const;
	const rarities = ['common', 'uncommon', 'rare', 'legendary'] as const;

	const type = overrides.type || types[Math.floor(Math.random() * types.length)];
	const isCreature = type === 'creature';

	const card: UICard = {
		id,
		name: overrides.name || `Card ${id.substring(0, 4)}`,
		imageUrl: overrides.imageUrl || `https://picsum.photos/seed/${id}/200/300`,
		type,
		cost: overrides.cost ?? Math.floor(Math.random() * 8) + 1,
		power: isCreature ? overrides.power ?? Math.floor(Math.random() * 5) + 1 : undefined,
		toughness: isCreature ? overrides.toughness ?? Math.floor(Math.random() * 5) + 1 : undefined,
		rarity: overrides.rarity || rarities[Math.floor(Math.random() * rarities.length)],
		displayEffect: overrides.displayEffect || (isCreature ? 'This creature attacks each turn if able.' : 'Deal 2 damage to any target.'),
		set: 'core-set',
		isPlayable: overrides.isPlayable ?? true,
		isSelected: overrides.isSelected ?? false,
		zone: overrides.zone,
		inHand: overrides.inHand ?? false,
		onBoard: overrides.onBoard ?? false,
		attack: isCreature ? overrides.attack ?? overrides.power ?? Math.floor(Math.random() * 5) + 1 : undefined,
		defense: isCreature ? overrides.defense ?? overrides.toughness ?? Math.floor(Math.random() * 5) + 1 : undefined,
		description: overrides.description ?? overrides.displayEffect,
		animations: overrides.animations || [],
		modifiers: overrides.modifiers || [],
	};

	return card;
};

export const createMockGameState = (): ClientGameState => {
	const playerIsFirst = Math.random() > 0.5;

	const basePlayer: Omit<GamePlayer, 'effects' | 'shields' | 'energy' | 'exile'> = {
		id: crypto.randomUUID(),
		username: 'You',
		avatarUrl: `https://api.dicebear.com/7.x/personas/svg?seed=player`,
		health: 30,
		maxHealth: 30,
		mana: playerIsFirst ? 1 : 0,
		maxMana: playerIsFirst ? 1 : 0,
		deck: Array(20).fill(''),
		hand: Array(4).fill(''),
		board: Array(2).fill(''),
		graveyard: [],
		isActive: playerIsFirst,
	};

	const player: GamePlayer = {
		...basePlayer,
		effects: [],
		shields: 0,
		energy: 0,
		exile: [],
	};

	const baseOpponent: Omit<GamePlayer, 'effects' | 'shields' | 'energy' | 'exile'> = {
		id: crypto.randomUUID(),
		username: 'Opponent',
		avatarUrl: `https://api.dicebear.com/7.x/personas/svg?seed=opponent`,
		health: 30,
		maxHealth: 30,
		mana: !playerIsFirst ? 1 : 0,
		maxMana: !playerIsFirst ? 1 : 0,
		deck: Array(20).fill(''),
		hand: Array(4).fill(''),
		board: Array(2).fill(''),
		graveyard: [],
		isActive: !playerIsFirst,
	};

	const opponent: GamePlayer = {
		...baseOpponent,
		effects: [],
		shields: 0,
		energy: 0,
		exile: [],
	};

	const playerId = player.id;

	return {
		id: crypto.randomUUID(),
		status: 'in_progress',
		player,
		opponent,
		turn: 1,
		phase: 'main',
		isPlayerTurn: playerIsFirst,
		targetingMode: false,
		history: [
			{
				id: crypto.randomUUID(),
				type: 'draw_card',
				playerId,
				timestamp: new Date().toISOString(),
				data: { count: 1 },
			},
		],
		animations: {
			active: false,
			queue: [],
		},
	};
};
