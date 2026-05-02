import * as Board from "@battleship/core/board"
import { GraphNode } from "@langchain/langgraph"
import { HumanMessage, SystemMessage } from "langchain"
import { BattleshipState, getModel } from "../agent"

export const askForStrategy: GraphNode<typeof BattleshipState> = async (state, config) => {
    config?.writer && config.writer({ agent: "Define strategy" })

    const model = getModel(config?.configurable?.modelName as string)
    const response = await model
        .invoke([
            new SystemMessage(`
You are about to place ships on a 10×10 Battleship grid (columns A–J, rows 1–10).
Ships to place (sizes): ${state.unplacedShips.join(", ")}

## Input

You will receive:
- the current state of the battleground
- the size of the ship to place

## Grid

10×10 grid. Columns are letters A–J, rows are numbers 1–10.
A coordinate is a letter + number: A1, J10.

Legend:
  (space) — empty
  S — ship already placed

## Placement rules

- A ship occupies a continuous line of cells horizontally or vertically.
- Ships cannot overlap.
- Ships cannot touch each other, including diagonally.
- Ships cannot extend beyond the grid boundaries.

      `),
            new HumanMessage(`Define your strategy for positioning the fleet. You MUST call the "defineStrategy" tool.`),
        ])

    return { messages: [response], llmCalls: 1 }
}

export const askToPlace: GraphNode<typeof BattleshipState> = async (state, config) => {
    config?.writer && config.writer({ agent: "Place ship" })

    const board = Board.init()
    for (const ship of state.ships) {
        Board.place(board, ship)
    }

    const model = getModel(config?.configurable?.modelName as string)
    const response = await model
        .invoke([
            new SystemMessage(`
You are placing ships on a 10×10 Battleship grid (columns A–J, rows 1–10).
A coordinate is column letter + row number: A1, J10.
"origin" is the leftmost cell (horizontal) or topmost cell (vertical).

## Placement constraints

- Ships cannot overlap.
- Ships cannot touch each other — not even diagonally. Every cell adjacent (including corners) to a placed ship is forbidden.
- Ships cannot extend beyond the grid boundaries.

## Your strategy

${state.strategy}

## How to fill "description"

Briefly explain your choice: grid area, how it fits your strategy, which constraints you are satisfying.
Example: "Top-right corner J1-J3, vertical. Keeps fleet spread to edges, far from existing ships."
    `),
            new HumanMessage(`
Current battleground (S = ship):
${Board.print(board, state.ships)}

Placement history:
${state.history.length > 0 ? state.history.join('\n') : '(none yet)'}

Ships remaining to place (sizes): ${state.unplacedShips.join(', ')}

Choose which ship to place next according to your strategy and specify its position. You MUST call the "place" tool.
    `),
        ])
    return {
        messages: [response],
        llmCalls: 1,
    }
}