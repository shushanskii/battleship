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

export const place = tool(({ origin, direction, size }) => ({ origin, direction, size }), {
  name: "place",
  description: "Place a ship on the battleground",
  schema: z.object({
    size: z.number().describe("Size of the ship to place — must be one of the remaining fleet sizes"),
    origin: z
      .string()
      .describe(
        "First deck coordinate (leftmost if horizontal, topmost if vertical)",
      ),
    direction: z
      .enum([Ship.ShipDirection.HORIZONTAL, Ship.ShipDirection.VERTICAL])
      .describe("Ship orientation"),
    description: z.string().describe(
      "Explain your reasoning: which ship size you chose and why, grid area, how it fits your strategy. Example: \"Size 3, top-right corner J1-J3, vertical. Largest remaining, edge placement per strategy.\"",
    ),
  }),
})