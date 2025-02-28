import { Card as CommonCard } from '@tcg-game-template/common/src';

// Extend the common Card type with UI-specific properties
export interface Card extends Omit<CommonCard, 'logicEffect'> {
	attack?: number; // Mapped from power
	defense?: number; // Mapped from toughness
	description?: string; // Mapped from displayEffect
	imageUrl: string; // Image URL with a default if not provided
	effects: CardEffect[]; // Mapped from logicEffect
	isPlayable?: boolean;
	isSelected?: boolean;
	inHand?: boolean;
	onBoard?: boolean;
	zone?: CardZone;
}

export interface CardEffect {
	id: string;
	type: string;
	description: string;
	value?: number;
}

export type CardZone = 'hand' | 'deck' | 'board' | 'graveyard' | 'exile';

export interface Player {
	id: string;
	name: string;
	avatar: string;
	health: number;
	maxHealth: number;
	mana: number;
	maxMana: number;
	deck: Card[];
	hand: Card[];
	board: Card[];
	graveyard: Card[];
	isActive: boolean; // Whether it's this player's turn
}

export interface GameState {
	id: string;
	player: Player;
	opponent: Player;
	turn: number;
	phase: GamePhase;
	isPlayerTurn: boolean;
	selectedCard?: Card;
	targetingMode: boolean;
	history: GameAction[];
	winner?: string;
}

export type GamePhase = 'draw' | 'main1' | 'combat' | 'main2' | 'end';

export interface GameAction {
	id: string;
	type: 'play_card' | 'attack' | 'end_turn' | 'draw_card' | 'use_ability';
	player: string;
	timestamp: number;
	data: any;
	description: string;
}

// Mock data functions
export const createMockCard = (overrides: Partial<Card> = {}): Card => {
	const id = crypto.randomUUID();
	const types = ['creature', 'spell', 'artifact'] as const;
	const rarities = ['common', 'uncommon', 'rare', 'legendary'] as const;

	const type = overrides.type || types[Math.floor(Math.random() * types.length)];
	const isCreature = type === 'creature';

	return {
		id,
		name: overrides.name || `Card ${id.substring(0, 4)}`,
		imageUrl: overrides.imageUrl || `https://picsum.photos/seed/${id}/200/300`,
		type,
		cost: overrides.cost ?? Math.floor(Math.random() * 8) + 1,
		power: isCreature ? overrides.power ?? Math.floor(Math.random() * 5) + 1 : undefined,
		toughness: isCreature ? overrides.toughness ?? Math.floor(Math.random() * 5) + 1 : undefined,
		attack: isCreature ? overrides.attack ?? overrides.power ?? Math.floor(Math.random() * 5) + 1 : undefined,
		defense: isCreature ? overrides.defense ?? overrides.toughness ?? Math.floor(Math.random() * 5) + 1 : undefined,
		displayEffect: overrides.displayEffect || (isCreature ? 'This creature attacks each turn if able.' : 'Deal 2 damage to any target.'),
		description: overrides.description || (isCreature ? 'This creature attacks each turn if able.' : 'Deal 2 damage to any target.'),
		rarity: overrides.rarity || rarities[Math.floor(Math.random() * rarities.length)],
		effects: overrides.effects || [],
		isPlayable: overrides.isPlayable ?? true,
		isSelected: overrides.isSelected ?? false,
		inHand: overrides.inHand ?? false,
		onBoard: overrides.onBoard ?? false,
		zone: overrides.zone,
	};
};

export const createMockPlayer = (overrides: Partial<Player> = {}): Player => {
	return {
		id: overrides.id || crypto.randomUUID(),
		name: overrides.name || 'Player',
		avatar: overrides.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${overrides.name || 'player'}`,
		health: overrides.health ?? 30,
		maxHealth: overrides.maxHealth ?? 30,
		mana: overrides.mana ?? 1,
		maxMana: overrides.maxMana ?? 10,
		deck:
			overrides.deck ||
			Array(20)
				.fill(null)
				.map(() => createMockCard({ zone: 'deck' })),
		hand:
			overrides.hand ||
			Array(4)
				.fill(null)
				.map(() => createMockCard({ zone: 'hand', inHand: true })),
		board:
			overrides.board ||
			Array(2)
				.fill(null)
				.map(() =>
					createMockCard({
						zone: 'board',
						onBoard: true,
						type: 'creature',
					})
				),
		graveyard: overrides.graveyard || [],
		isActive: overrides.isActive ?? false,
	};
};

export const createMockGameState = (): GameState => {
	const playerIsFirst = Math.random() > 0.5;

	const player = createMockPlayer({
		name: 'You',
		isActive: playerIsFirst,
		mana: playerIsFirst ? 1 : 0,
		maxMana: playerIsFirst ? 1 : 0,
	});

	const opponent = createMockPlayer({
		name: 'Opponent',
		isActive: !playerIsFirst,
		mana: !playerIsFirst ? 1 : 0,
		maxMana: !playerIsFirst ? 1 : 0,
	});

	return {
		id: crypto.randomUUID(),
		player,
		opponent,
		turn: 1,
		phase: 'main1',
		isPlayerTurn: playerIsFirst,
		targetingMode: false,
		history: [
			{
				id: crypto.randomUUID(),
				type: 'draw_card',
				player: playerIsFirst ? player.id : opponent.id,
				timestamp: Date.now(),
				data: { count: 1 },
				description: `${playerIsFirst ? 'You' : 'Opponent'} drew a card.`,
			},
		],
	};
};
