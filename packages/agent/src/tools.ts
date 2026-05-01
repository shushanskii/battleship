import { tool } from "langchain/tools"
import * as z from "zod"
import * as Ship from "@battleship/core/ship"

export const defineStrategy = tool(
  ({ strategy }) => strategy,
  {
    name: "defineStrategy",
    description: "Submit your game strategy",
    schema: z.object({
      strategy: z.string().describe("Your strategy for this game"),
    }),
  },
)

export const place = tool(({ origin, direction, description }) => ({ origin, direction }), {
  name: "place",
  description: "Place the current ship on the battleground",
  schema: z.object({
    origin: z
      .string()
      .describe(
        "First deck coordinate (leftmost if horizontal, topmost if vertical)",
      ),
    direction: z
      .enum([Ship.ShipDirection.HORIZONTAL, Ship.ShipDirection.VERTICAL])
      .describe("Ship orientation"),
    description: z.string().describe(
      "Explain your reasoning: which area of the grid you chose, why it fits your strategy, and which constraints you satisfy. Example: \"Top-left corner A1-D1, horizontal. Edge placement per strategy, no ships nearby.\"",
    ),
  }),
})