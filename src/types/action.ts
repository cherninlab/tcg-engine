import { z } from "@hono/zod-openapi";

export const ActionType = z
  .enum([
    "play_card",
    "attack",
    "cast_spell",
    "end_turn",
    "draw_card",
    "discard_card",
  ])
  .openapi({ description: "The type of action performed." });

export const ActionSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .openapi({ description: "Unique identifier of the action." }),
    type: ActionType,
    timestamp: z
      .number()
      .openapi({ description: "Timestamp when the action was performed." }),
    data: z
      .any()
      .openapi({ description: "Additional data related to the action." }),
    playerId: z
      .string()
      .uuid()
      .openapi({ description: "ID of the player performing the action." }),
  })
  .openapi({ description: "A generic action performed by a player." });

export const PlayCardActionSchema = z
  .object({
    cardId: z
      .string()
      .uuid()
      .openapi({ description: "ID of the card being played." }),
    targetId: z.string().uuid().optional().openapi({
      description: "ID of the target for the card, if applicable.",
    }),
  })
  .openapi({ description: "Action representing a player playing a card." });

export const AttackActionSchema = z
  .object({
    attackerId: z
      .string()
      .uuid()
      .openapi({ description: "ID of the attacking creature." }),
    defenderId: z
      .string()
      .uuid()
      .openapi({ description: "ID of the defending creature or player." }),
  })
  .openapi({ description: "Action representing an attack by a player." });

export const CastSpellActionSchema = z
  .object({
    spellId: z
      .string()
      .uuid()
      .openapi({ description: "ID of the spell being cast." }),
    targetId: z.string().uuid().optional().openapi({
      description: "ID of the target for the spell, if applicable.",
    }),
  })
  .openapi({ description: "Action representing a player casting a spell." });

export const EndTurnActionSchema = z
  .object({})
  .openapi({ description: "Action representing a player ending their turn." });

export const DrawCardActionSchema = z
  .object({})
  .openapi({ description: "Action representing a player drawing a card." });

export const DiscardCardActionSchema = z
  .object({
    cardId: z
      .string()
      .uuid()
      .openapi({ description: "ID of the card being discarded." }),
  })
  .openapi({ description: "Action representing a player discarding a card." });

export const ActionResultType = z
  .enum(["success", "failure", "effect_triggered"])
  .openapi({ description: "The outcome of the action." });

export const ActionResultSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .openapi({ description: "Unique identifier of the action result." }),
    type: ActionResultType,
    data: z
      .any()
      .openapi({ description: "Additional data related to the result." }),
    timestamp: z
      .number()
      .openapi({ description: "Timestamp when the result was generated." }),
  })
  .openapi({ description: "The result of an action performed in the game." });

export const ActionResponseSchema = z
  .object({
    action: ActionSchema,
    result: ActionResultSchema,
  })
  .openapi({ description: "Response containing the action and its result." });

export type ActionType = z.infer<typeof ActionType>;
export type Action = z.infer<typeof ActionSchema>;
export type PlayCardAction = z.infer<typeof PlayCardActionSchema>;
export type AttackAction = z.infer<typeof AttackActionSchema>;
export type CastSpellAction = z.infer<typeof CastSpellActionSchema>;
export type EndTurnAction = z.infer<typeof EndTurnActionSchema>;
export type DrawCardAction = z.infer<typeof DrawCardActionSchema>;
export type DiscardCardAction = z.infer<typeof DiscardCardActionSchema>;
export type ActionResult = z.infer<typeof ActionResultSchema>;
export type ActionResponse = z.infer<typeof ActionResponseSchema>;
