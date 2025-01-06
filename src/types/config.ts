import { z } from 'zod';

const DeckConfigSchema = z.object({
	maxPerDeck: z.number(),
	minPerDeck: z.number(),
	maxCopiesPerCard: z.number(),
	startingHandSize: z.number(),
	maxHandSize: z.number(),
	drawPerTurn: z.number(),
});

const RuleConfigSchema = z.object({
	startingLife: z.number(),
	maxLife: z.number(),
	maxBoardCreatures: z.number(),
	maxTurns: z.number(),
	timeoutSeconds: z.number(),
	mulligan: z.boolean(),
});

const EconomyConfigSchema = z.object({
	startingBalance: z.number(),
	dailyReward: z.number(),
	winReward: z.number(),
	lossReward: z.number(),
	cardCosts: z.object({
		common: z.number(),
		uncommon: z.number(),
		rare: z.number(),
		legendary: z.number(),
	}),
	packCosts: z.object({
		basic: z.number(),
		premium: z.number(),
		legendary: z.number(),
	}),
});

const MatchmakingConfigSchema = z.object({
	criteria: z.array(z.string()),
	minWaitTime: z.number(),
	maxWaitTime: z.number(),
	ratingSystem: z.object({
		initialRating: z.number(),
		kFactor: z.number(),
		minRating: z.number(),
	}),
});

const SessionConfigSchema = z.object({
	maxDuration: z.number(),
	inactivityTimeout: z.number(),
	reconnectWindow: z.number(),
});

const ActionLimitsConfigSchema = z.object({
	maxActionsPerTurn: z.number(),
	maxCardsPlayedPerTurn: z.number(),
	maxAttacksPerTurn: z.number(),
});

const GameConfigSchema = z.object({
	deck: DeckConfigSchema,
	rules: RuleConfigSchema,
	economy: EconomyConfigSchema,
	matchmaking: MatchmakingConfigSchema,
	session: SessionConfigSchema,
	actionLimits: ActionLimitsConfigSchema,
});

export type DeckConfig = z.infer<typeof DeckConfigSchema>;
export type RuleConfig = z.infer<typeof RuleConfigSchema>;
export type EconomyConfig = z.infer<typeof EconomyConfigSchema>;
export type MatchmakingConfig = z.infer<typeof MatchmakingConfigSchema>;
export type SessionConfig = z.infer<typeof SessionConfigSchema>;
export type ActionLimitsConfig = z.infer<typeof ActionLimitsConfigSchema>;
export type GameConfig = z.infer<typeof GameConfigSchema>;
