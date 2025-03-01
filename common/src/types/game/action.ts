import { z } from '@hono/zod-openapi';

export const ActionTypeSchema = z
	.enum([
		// Turn actions
		'start_turn',
		'end_turn',
		'pass_priority',
		// Card actions
		'draw_card',
		'play_card',
		'discard_card',
		'activate_ability',
		// Combat actions
		'declare_attackers',
		'declare_blockers',
		'assign_damage',
		// Resource actions
		'gain_mana',
		'spend_mana',
		'gain_energy',
		'spend_energy',
		// Game state actions
		'mulligan',
		'keep_hand',
		'concede',
	])
	.openapi({
		description: 'Type of game action',
		example: 'play_card',
	});

export const ActionSchema = z
	.object({
		id: z.string().uuid().openapi({
			description: 'Unique ID of this action',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		type: ActionTypeSchema,
		playerId: z.string().uuid().openapi({
			description: 'ID of the player taking this action',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		timestamp: z.string().datetime().openapi({
			description: 'When this action was taken',
			example: '2024-03-20T10:30:00Z',
		}),
		// Optional fields that may be present for any action type
		targetId: z.string().uuid().optional().openapi({
			description: 'ID of the target (card, player, etc)',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		sourceId: z.string().uuid().optional().openapi({
			description: 'ID of the source (card, ability, etc)',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		amount: z.number().int().optional().openapi({
			description: 'Numeric value for actions that need it',
			example: 2,
		}),
		// Action-specific data
		data: z
			.record(z.unknown())
			.optional()
			.openapi({
				description: 'Additional data specific to this action type',
				example: {
					abilityIndex: 0,
					modifiers: ['tap', 'untap'],
					damageAssignment: [{ targetId: '123...', amount: 2 }],
				},
			}),
		// Optional game ID
		gameId: z.string().uuid().optional().openapi({
			description: 'ID of the game this action belongs to',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		// Optional turn number
		turnNumber: z.number().int().min(1).optional().openapi({
			description: 'Turn number when this action was taken',
			example: 1,
		}),
		// Optional priority
		priority: z.number().int().min(0).optional().openapi({
			description: 'Priority level of this action (0 is highest)',
			example: 0,
		}),
	})
	.openapi({
		description: 'A game action',
	});

export const ActionResponseSchema = z
	.object({
		success: z.boolean().openapi({
			description: 'Whether the action was successfully processed',
			example: true,
		}),
		actionId: z.string().uuid().openapi({
			description: 'ID of the processed action',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		resultingActions: z.array(ActionSchema).optional().openapi({
			description: 'Additional actions triggered as a result of this action',
		}),
		effects: z
			.array(
				z.object({
					type: z.string(),
					targetId: z.string().uuid(),
					value: z.union([z.string(), z.number(), z.boolean()]).optional(),
				})
			)
			.optional()
			.openapi({
				description: 'Effects applied as a result of this action',
				example: [
					{ type: 'damage', targetId: '123...', value: 3 },
					{ type: 'draw', targetId: '456...', value: 1 },
				],
			}),
		message: z.string().optional().openapi({
			description: 'Human-readable message about the action',
			example: 'Fireball dealt 3 damage to Stone Golem',
		}),
		gameStateUpdate: z.record(z.unknown()).optional().openapi({
			description: 'Partial game state update, if any',
		}),
	})
	.openapi({
		description: 'Response to a game action',
	});

export type ActionType = z.infer<typeof ActionTypeSchema>;

export type GameAction = z.infer<typeof ActionSchema>;

export type ActionResponse = z.infer<typeof ActionResponseSchema>;

export interface PendingAction extends GameAction {
	status: 'pending';
	queuedAt: number;
}

export interface CompletedAction extends GameAction {
	status: 'completed';
	result: ActionResponse;
	completedAt: number;
}

export interface FailedAction extends GameAction {
	status: 'failed';
	error: {
		code: string;
		message: string;
	};
	failedAt: number;
}

export type ActionWithStatus = PendingAction | CompletedAction | FailedAction;

export interface ActionQueue {
	pending: PendingAction[];
	processing: PendingAction | null;
	completed: CompletedAction[];
	failed: FailedAction[];
}
