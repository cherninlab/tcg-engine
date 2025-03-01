import { z } from '@hono/zod-openapi';

/**
 * Schema Definitions
 * -----------------
 */

/**
 * Combat phases schema
 * Defines the sequential phases of combat
 */
export const CombatPhaseSchema = z.enum(['begin', 'declare_attackers', 'declare_blockers', 'damage', 'end']).openapi({
  description: 'Current phase of combat',
  example: 'declare_attackers',
});

/**
 * Combat creature schema
 * Represents a creature participating in combat with combat-relevant properties
 */
export const CombatCreatureSchema = z
  .object({
    id: z.string().uuid().openapi({
      description: 'ID of the creature card',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    controllerId: z.string().uuid().openapi({
      description: 'ID of the player controlling this creature',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    power: z.number().int().openapi({
      description: 'Current power',
      example: 3,
    }),
    toughness: z.number().int().openapi({
      description: 'Current toughness',
      example: 4,
    }),
    damage: z.number().int().min(0).openapi({
      description: 'Current damage marked',
      example: 2,
    }),
    // Combat-relevant keywords as simple booleans
    keywords: z
      .object({
        firstStrike: z.boolean().default(false),
        doubleStrike: z.boolean().default(false),
        deathtouch: z.boolean().default(false),
        indestructible: z.boolean().default(false),
        trample: z.boolean().default(false),
        vigilance: z.boolean().default(false),
      })
      .openapi({
        description: 'Combat-relevant keywords',
      }),
  })
  .openapi({
    description: 'A creature participating in combat',
  });

/**
 * Combat assignment schema
 * Represents an assignment of attackers and blockers
 */
export const CombatAssignmentSchema = z
  .object({
    attackerId: z.string().uuid().openapi({
      description: 'ID of the attacking creature',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    blockerIds: z.array(z.string().uuid()).openapi({
      description: 'IDs of blocking creatures',
      example: ['123e4567-e89b-12d3-a456-426614174000'],
    }),
    damageAssignment: z
      .array(
        z.object({
          targetId: z.string().uuid(),
          amount: z.number().int().min(0),
        })
      )
      .optional()
      .openapi({
        description: 'How combat damage is assigned',
      }),
  })
  .openapi({
    description: 'A combat assignment between attacker and blockers',
  });

/**
 * Combat state schema
 * Represents the full state of combat
 */
export const CombatStateSchema = z
  .object({
    phase: CombatPhaseSchema,
    attackingPlayerId: z.string().uuid().openapi({
      description: 'ID of the attacking player',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    defendingPlayerId: z.string().uuid().openapi({
      description: 'ID of the defending player',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    creatures: z.record(CombatCreatureSchema).openapi({
      description: 'All creatures in combat by their ID',
    }),
    assignments: z.array(CombatAssignmentSchema).openapi({
      description: 'All combat assignments',
    }),
    damageDealt: z
      .array(
        z.object({
          sourceId: z.string().uuid(),
          targetId: z.string().uuid(),
          amount: z.number().int().min(0),
          isFirstStrike: z.boolean(),
          isDeathtouch: z.boolean(),
        })
      )
      .openapi({
        description: 'Damage that has been dealt',
      }),
    casualties: z
      .array(
        z.object({
          creatureId: z.string().uuid(),
          cause: z.enum(['damage', 'destruction', 'state_based']),
        })
      )
      .openapi({
        description: 'Creatures that have died',
      }),
  })
  .openapi({
    description: 'Current state of combat',
  });

/**
 * Combat declaration schema
 * Used when declaring attackers or blockers
 */
export const CombatDeclarationSchema = z
  .object({
    gameId: z.string().uuid().openapi({
      description: 'ID of the game',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    playerId: z.string().uuid().openapi({
      description: 'ID of the player making the declaration',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    phase: z.enum(['declare_attackers', 'declare_blockers']).openapi({
      description: 'Combat phase for this declaration',
      example: 'declare_attackers',
    }),
    declarations: z.array(
      z.object({
        creatureId: z.string().uuid(),
        targets: z.array(z.string().uuid()).optional(), // For blockers, target is attacker
      })
    ).openapi({
      description: 'List of creatures and their targets',
      example: [
        { creatureId: '123...', targets: [] }, // Attacker with no specific target
        { creatureId: '456...', targets: ['789...'] }, // Blocker blocking an attacker
      ],
    }),
  })
  .openapi({
    description: 'Declaration of attackers or blockers',
  });

/**
 * Type Definitions
 * ---------------
 */

/**
 * Combat phase type
 */
export type CombatPhase = z.infer<typeof CombatPhaseSchema>;

/**
 * Combat creature type
 */
export type CombatCreature = z.infer<typeof CombatCreatureSchema>;

/**
 * Combat assignment type
 */
export type CombatAssignment = z.infer<typeof CombatAssignmentSchema>;

/**
 * Combat state type
 */
export type CombatState = z.infer<typeof CombatStateSchema>;

/**
 * Combat declaration type
 */
export type CombatDeclaration = z.infer<typeof CombatDeclarationSchema>;

/**
 * Game-Specific Type Extensions
 * ---------------------------
 */

/**
 * Combat damage result interface
 * Used to track results of damage assignment
 */
export interface CombatDamageResult {
  /** Creature that died during combat */
  casualties: Array<{
    /** ID of the creature that died */
    creatureId: string;
    /** What caused the creature to die */
    cause: 'damage' | 'destruction' | 'state_based';
    /** ID of the creature that dealt lethal damage, if applicable */
    killedBy?: string;
  }>;

  /** Damage dealt to players */
  playerDamage: Array<{
    /** ID of the player who took damage */
    playerId: string;
    /** Amount of damage taken */
    amount: number;
    /** ID of the creature that dealt the damage */
    sourceId: string;
  }>;

  /** Combat triggers that fired */
  triggers: Array<{
    /** Type of trigger */
    type: 'on_damage' | 'on_death' | 'on_attack' | 'on_block';
    /** ID of the card that triggered */
    sourceId: string;
    /** Additional data related to the trigger */
    data: Record<string, unknown>;
  }>;
}

/**
 * Interface for combat log entries
 * Used to record a history of combat events
 */
export interface CombatLogEntry {
  /** Timestamp when the event occurred */
  timestamp: number;

  /** Type of combat event */
  type: 'attack_declaration' | 'block_declaration' | 'damage_assignment' | 'creature_death' | 'combat_end';

  /** Description of the event */
  description: string;

  /** IDs of cards involved in the event */
  cardIds: string[];

  /** IDs of players involved in the event */
  playerIds: string[];

  /** Additional data about the event */
  data?: Record<string, unknown>;
}
