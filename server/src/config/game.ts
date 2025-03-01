import { GameConfig } from '@rism-tcg/common/src';

export const gameConfig: GameConfig = {
	deck: {
		maxPerDeck: 60,
		minPerDeck: 40,
		maxCopiesPerCard: 4,
		startingHandSize: 7,
		maxHandSize: 10,
		drawPerTurn: 1,
	},
	rules: {
		startingLife: 20,
		maxLife: 999,
		maxBoardCreatures: 5,
		maxTurns: 50,
		timeoutSeconds: 45,
		mulligan: false,
	},
	economy: {
		startingBalance: 1000,
		dailyReward: 100,
		winReward: 50,
		lossReward: 10,
		cardCosts: {
			common: 100,
			uncommon: 250,
			rare: 500,
			legendary: 1000,
		},
		packCosts: {
			basic: 500,
			premium: 1000,
			legendary: 2000,
		},
	},
	matchmaking: {
		criteria: ['rank'],
		minWaitTime: 10,
		maxWaitTime: 60,
		ratingSystem: {
			initialRating: 1000,
			kFactor: 32,
			minRating: 0,
		},
	},
	session: {
		maxDuration: 3600, // 1 hour in seconds
		inactivityTimeout: 300, // 5 minutes in seconds
		reconnectWindow: 60, // 1 minute in seconds
	},
	actionLimits: {
		maxActionsPerTurn: 20,
		maxCardsPlayedPerTurn: 3,
		maxAttacksPerTurn: 5,
	},
};
