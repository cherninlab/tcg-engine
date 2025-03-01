import { z } from '@hono/zod-openapi';
import { GameAction } from './action';
import { CombatStateSchema } from './combat';

/**
 * Schema Definitions
 * -----------------
 */

/**
 * Game phases schema
 * Defines the possible phases during a game turn
 */
export const GamePhaseSchema = z.enum(['setup', 'mulligan', 'main', 'combat', 'end']).openapi({
	description: 'Current phase of the game',
	example: 'main',
});

/**
 * Detailed game turn phases schema
 * Defines all possible sub-phases within a turn
 */
export const DetailedGamePhaseSchema = z
	.enum([
		'untap',
		'upkeep',
		'draw',
		'main1',
		'combat_begin',
		'combat_attack',
		'combat_block',
		'combat_damage',
		'combat_end',
		'main2',
		'end',
		'cleanup',
	])
	.openapi({
		description: 'Detailed current phase of the turn',
		example: 'main1',
	});

/**
 * Game zones schema
 * Defines the possible locations where cards can exist
 */
export const ZoneTypeSchema = z.enum(['deck', 'hand', 'board', 'graveyard', 'exile']).openapi({
	description: 'Game zone where cards can be located',
	example: 'hand',
});

/**
 * Player state schema
 * Represents a player's current state in the game
 */
export const PlayerStateSchema = z
	.object({
		id: z.string().uuid().openapi({
			description: 'Player ID',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		health: z.number().int().openapi({
			description: 'Current health',
			example: 20,
		}),
		mana: z.number().int().openapi({
			description: 'Current mana',
			example: 3,
		}),
		energy: z.number().int().openapi({
			description: 'Current energy',
			example: 2,
		}),
		zones: z.record(z.array(z.string().uuid())).openapi({
			description: 'Cards in each zone by ID',
			example: {
				hand: ['card-1', 'card-2'],
				board: ['card-3'],
				graveyard: [],
			},
		}),
		modifiers: z
			.array(
				z.object({
					type: z.string(),
					value: z.number().optional(),
					duration: z.number().optional(),
				})
			)
			.openapi({
				description: 'Active modifiers on the player',
				example: [{ type: 'draw_bonus', value: 1, duration: 2 }],
			}),
	})
	.openapi({
		description: 'Current state of a player',
	});

/**
 * Card state schema
 * Represents a card's current state in the game
 */
export const CardStateSchema = z
	.object({
		id: z.string().uuid().openapi({
			description: 'Card ID',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		cardDefId: z.string().openapi({
			description: 'ID of the card definition',
			example: 'fire_elemental',
		}),
		controllerId: z.string().uuid().openapi({
			description: 'ID of the controlling player',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		zone: ZoneTypeSchema,
		power: z.number().int().optional().openapi({
			description: 'Current power if creature',
			example: 3,
		}),
		toughness: z.number().int().optional().openapi({
			description: 'Current toughness if creature',
			example: 4,
		}),
		damage: z.number().int().optional().openapi({
			description: 'Current damage if creature',
			example: 2,
		}),
		isTapped: z.boolean().openapi({
			description: 'Whether the card is tapped',
			example: false,
		}),
		modifiers: z
			.array(
				z.object({
					type: z.string(),
					value: z.number().optional(),
					duration: z.number().optional(),
				})
			)
			.openapi({
				description: 'Active modifiers on the card',
				example: [{ type: 'power_bonus', value: 2, duration: 1 }],
			}),
		counters: z.record(z.number()).openapi({
			description: 'Counter types and amounts',
			example: { '+1/+1': 2, charge: 1 },
		}),
	})
	.openapi({
		description: 'Current state of a card',
	});

/**
 * Stack item schema
 * Represents an item on the game stack waiting to resolve
 */
export const StackItemSchema = z
	.object({
		id: z.string().uuid().openapi({
			description: 'Unique ID of the stack item',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		type: z.string().openapi({
			description: 'Type of stack item',
			example: 'spell',
		}),
		sourceId: z.string().uuid().openapi({
			description: 'ID of the source of this stack item',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		controllerId: z.string().uuid().openapi({
			description: 'ID of the player who controls this stack item',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		targetIds: z.array(z.string().uuid()).openapi({
			description: 'IDs of the targets of this stack item',
			example: ['123e4567-e89b-12d3-a456-426614174000'],
		}),
		data: z.record(z.unknown()).openapi({
			description: 'Additional data for this stack item',
			example: { damage: 3, effect: 'destroy' },
		}),
	})
	.openapi({
		description: 'An item on the stack waiting to resolve',
	});

/**
 * Game state schema
 * Represents the complete state of a game
 */
export const GameStateSchema = z
	.object({
		id: z.string().uuid().openapi({
			description: 'Game ID',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		status: z.enum(['waiting', 'in_progress', 'finished']).openapi({
			description: 'Current status of the game',
			example: 'in_progress',
		}),
		phase: GamePhaseSchema,
		detailedPhase: DetailedGamePhaseSchema.optional(),
		turn: z.number().int().min(1).openapi({
			description: 'Current turn number',
			example: 1,
		}),
		activePlayerId: z.string().uuid().openapi({
			description: 'ID of the active player',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		priorityPlayerId: z.string().uuid().openapi({
			description: 'ID of the player with priority',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		players: z.record(PlayerStateSchema).openapi({
			description: 'Player states by ID',
		}),
		cards: z.record(CardStateSchema).openapi({
			description: 'Card states by ID',
		}),
		combat: CombatStateSchema.optional().openapi({
			description: 'Current combat state if in combat',
		}),
		stack: z.array(StackItemSchema).openapi({
			description: 'Effects/abilities waiting to resolve',
		}),
		actionLog: z.array(z.any()).openapi({
			// Using z.any() for GameAction as it's a circular reference
			description: 'Log of actions taken this turn',
		}),
		winner: z.string().uuid().optional().openapi({
			description: 'ID of the winning player, if game is over',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		startedAt: z.string().datetime().openapi({
			description: 'When the game started',
			example: '2024-03-20T15:00:00Z',
		}),
		lastUpdateAt: z.string().datetime().openapi({
			description: 'When the game state was last updated',
			example: '2024-03-20T15:10:25Z',
		}),
		finishedAt: z.string().datetime().optional().openapi({
			description: 'When the game finished, if applicable',
			example: '2024-03-20T16:00:00Z',
		}),
	})
	.openapi({
		description: 'Complete game state',
	});

/**
 * Game creation schema
 * Data required to create a new game
 */
export const CreateGameSchema = z
	.object({
		format: z.enum(['standard', 'modern', 'legacy', 'commander']).openapi({
			description: 'Format to play',
			example: 'standard',
		}),
		players: z
			.array(
				z.object({
					id: z.string().uuid(),
					deckId: z.string().uuid(),
				})
			)
			.length(2)
			.openapi({
				description: 'Players and their decks',
				example: [
					{ id: '123e4567-e89b-12d3-a456-426614174000', deckId: '123e4567-e89b-12d3-a456-426614174001' },
					{ id: '123e4567-e89b-12d3-a456-426614174002', deckId: '123e4567-e89b-12d3-a456-426614174003' },
				],
			}),
		options: z
			.object({
				startingLife: z.number().int().min(1).optional(),
				mulligan: z.boolean().optional(),
				timeLimit: z.number().int().min(0).optional(),
				allowSpectators: z.boolean().optional(),
			})
			.optional()
			.openapi({
				description: 'Game options',
				example: {
					startingLife: 20,
					mulligan: true,
					timeLimit: 1800,
					allowSpectators: true,
				},
			}),
	})
	.openapi({
		description: 'Data required to create a new game',
	});

/**
 * Game options schema
 * Configurable options for a game
 */
export const GameOptionsSchema = z
	.object({
		startingLife: z.number().int().min(1).default(20).openapi({
			description: 'Starting life points for players',
			example: 20,
		}),
		mulligan: z.boolean().default(true).openapi({
			description: 'Whether mulligan is allowed',
			example: true,
		}),
		timeLimit: z.number().int().min(0).default(1800).openapi({
			description: 'Time limit in seconds (0 for no limit)',
			example: 1800,
		}),
		allowSpectators: z.boolean().default(true).openapi({
			description: 'Whether spectators are allowed',
			example: true,
		}),
		turnTimeLimit: z.number().int().min(0).default(60).openapi({
			description: 'Time limit per turn in seconds (0 for no limit)',
			example: 60,
		}),
		maxPauseTime: z.number().int().min(0).default(300).openapi({
			description: 'Maximum total pause time in seconds',
			example: 300,
		}),
	})
	.openapi({
		description: 'Game options',
	});

/**
 * Game timer state schema
 * Tracks time usage in the game
 */
export const GameTimerSchema = z
	.object({
		gameId: z.string().uuid().openapi({
			description: 'ID of the game',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		playerTimers: z
			.record(
				z.object({
					timeUsed: z.number().int().min(0).openapi({
						description: 'Total time used by this player in seconds',
						example: 300,
					}),
					turnStartTime: z.number().optional().openapi({
						description: 'Timestamp when current turn started (if player is active)',
						example: 1616252525000,
					}),
					pauseTimeUsed: z.number().int().min(0).openapi({
						description: 'Total pause time used by this player in seconds',
						example: 60,
					}),
					isPaused: z.boolean().openapi({
						description: 'Whether the player has paused the game',
						example: false,
					}),
					pauseStartTime: z.number().optional().openapi({
						description: 'Timestamp when pause started (if paused)',
						example: 1616252525000,
					}),
				})
			)
			.openapi({
				description: 'Time tracking for each player',
				example: {
					'player-1': {
						timeUsed: 300,
						turnStartTime: 1616252525000,
						pauseTimeUsed: 60,
						isPaused: false,
					},
				},
			}),
		gameStartTime: z.number().openapi({
			description: 'Timestamp when the game started',
			example: 1616252525000,
		}),
		totalGameTime: z.number().int().min(0).openapi({
			description: 'Total elapsed game time in seconds',
			example: 750,
		}),
		turnTimeLimit: z.number().int().min(0).openapi({
			description: 'Time limit per turn in seconds (0 for no limit)',
			example: 60,
		}),
		gameTimeLimit: z.number().int().min(0).openapi({
			description: 'Total game time limit in seconds (0 for no limit)',
			example: 1800,
		}),
	})
	.openapi({
		description: 'Game timer state',
	});

/**
 * Type Definitions
 * ---------------
 */

/**
 * Game phase type
 */
export type GamePhase = z.infer<typeof GamePhaseSchema>;

/**
 * Detailed game phase type
 */
export type DetailedGamePhase = z.infer<typeof DetailedGamePhaseSchema>;

/**
 * Zone type
 */
export type ZoneType = z.infer<typeof ZoneTypeSchema>;

/**
 * Player state type
 */
export type PlayerState = z.infer<typeof PlayerStateSchema>;

/**
 * Card state type
 */
export type CardState = z.infer<typeof CardStateSchema>;

/**
 * Stack item type
 */
export type StackItem = z.infer<typeof StackItemSchema>;

/**
 * Game state type
 */
export type GameState = Omit<z.infer<typeof GameStateSchema>, 'actionLog'> & {
	actionLog: GameAction[];
};

/**
 * Game creation type
 */
export type CreateGame = z.infer<typeof CreateGameSchema>;

/**
 * Game options type
 */
export type GameOptions = z.infer<typeof GameOptionsSchema>;

/**
 * Game timer state type
 */
export type GameTimer = z.infer<typeof GameTimerSchema>;

export interface GameStateSnapshot {
	/** The full game state */
	state: GameState;

	/** Timestamp when the snapshot was taken */
	timestamp: number;

	/** ID of the action that led to this state */
	actionId: string;

	/** Turn number at snapshot time */
	turn: number;

	/** Phase at snapshot time */
	phase: GamePhase;

	/** Hash for integrity verification */
	stateHash: string;
}

export interface GamePermissions {
	/** Whether the player can play cards */
	canPlayCards: boolean;

	/** Whether the player can attack */
	canAttack: boolean;

	/** Whether the player can block */
	canBlock: boolean;

	/** Whether the player can activate abilities */
	canActivateAbilities: boolean;

	/** Whether the player can mulligan */
	canMulligan: boolean;

	/** Whether the player can concede */
	canConcede: boolean;

	/** Whether the player has priority */
	hasPriority: boolean;

	/** Custom permissions */
	custom: Record<string, boolean>;
}

export interface GameHistoryEntry {
	/** Unique ID of this history entry */
	id: string;

	/** Type of event */
	type: 'game_start' | 'turn_start' | 'card_played' | 'combat' | 'life_change' | 'game_end';

	/** Human-readable description of the event */
	description: string;

	/** Turn number when this event occurred */
	turn: number;

	/** Phase when this event occurred */
	phase: GamePhase;

	/** Timestamp when this event occurred */
	timestamp: number;

	/** IDs of players involved */
	playerIds: string[];

	/** IDs of cards involved */
	cardIds: string[];

	/** Additional data */
	data: Record<string, unknown>;
}

export interface PlayerGameView {
	/** Game ID */
	gameId: string;

	/** Game status */
	status: 'waiting' | 'in_progress' | 'finished';

	/** Current phase */
	phase: GamePhase;

	/** Current turn number */
	turn: number;

	/** Current active player ID */
	activePlayerId: string;

	/** Current player with priority */
	priorityPlayerId: string;

	/** Your player state */
	you: PlayerState & {
		/** Cards in your hand (full details) */
		hand: CardState[];
	};

	/** Opponent's state */
	opponent: Omit<PlayerState, 'zones'> & {
		/** Number of cards in opponent's hand */
		handCount: number;

		/** Number of cards in opponent's deck */
		deckCount: number;
	};

	/** Cards on the board (full details) */
	board: CardState[];

	/** Cards in your graveyard (full details) */
	yourGraveyard: CardState[];

	/** Cards in opponent's graveyard (full details) */
	opponentGraveyard: CardState[];

	/** Current stack items */
	stack: StackItem[];

	/** Your permissions */
	permissions: GamePermissions;

	/** Game timer info */
	timer: GameTimer;

	/** Recent history entries */
	recentHistory: GameHistoryEntry[];
}
