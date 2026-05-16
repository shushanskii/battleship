import * as Board from "@battleship/core/board"
import { InterruptType } from "@battleship/core"
import { GraphNode, interrupt } from "@langchain/langgraph"
import { HumanMessage, SystemMessage } from "langchain"
import { BattleshipState, getModel } from "../agent"
import { shoot } from "../tools"

export const askForStrategy: GraphNode<typeof BattleshipState> = async (state, config) => {
    config?.writer && config.writer({ agent: "Define strategy" })

    const model = getModel(config?.configurable?.modelName as string)
    const response = await model
        .invoke([
            new SystemMessage(`
You are playing Battleship on a 10×10 grid (columns A–J, rows 1–10).
Fleet to place (sizes): ${state.unplacedShips.join(", ")}

The game has two phases: fleet placement, then shooting turns.

## Phase 1 — Fleet placement (minimize own losses)

Your goal is to make your fleet as hard to find as possible.
- Spread ships across all grid sectors: corners, edges, and interior
- Avoid clustering ships — concentrated fleets are easier to sweep
- Mix horizontal and vertical orientations unpredictably
- Prefer edge and corner positions; opponents often start sweeping the center

## Phase 2 — Shooting (maximize damage to opponent)

Your goal is to destroy the opponent's fleet as efficiently as possible.
- Open with a checkerboard (parity) pattern: only shoot cells of one color on
  an imaginary chessboard overlay. This guarantees hitting every ship of size ≥ 2
  in at most 50 shots.
- On a hit, immediately probe orthogonal neighbors to determine ship orientation,
  then finish the ship before resuming the search pattern.
- Track every miss — never repeat a coordinate.
- Adjust density of search based on remaining ship sizes (smaller ships need
  a tighter pattern).

Define your strategy for both phases. You MUST call the "defineStrategy" tool.
      `),
            new HumanMessage(`Define your strategy. You MUST call the "defineStrategy" tool.`),
        ])

    return { messages: [response], llmCalls: 1 }
}

export const askToPlace: GraphNode<typeof BattleshipState> = async (state, config) => {
    config?.writer && config.writer({ agent: "Place ship" })

    const board = state.board

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
${Board.print(board)}

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

export const agentShootNode: GraphNode<typeof BattleshipState> = async (state, config) => {
    config?.writer && config.writer({ agent: "Choosing target" })

//     const model = getModel(config?.configurable?.modelName as string, [shoot])
//     const response = await model.invoke([
//         new SystemMessage(`
// You are playing Battleship. It is your turn to fire at the opponent's fleet.
// Grid: columns A–J, rows 1–10. Coordinate format: column + row (e.g. A1, J10).

// ## Your strategy
// ${state.strategy}

// ## Target grid (your shots so far)
// ${Board.print(state.targetBoard)}

// Rules:
// - Only shoot at unknown cells
// - Follow your strategy's search pattern
// - Never repeat a coordinate
//         `),
//         new HumanMessage(`Choose your next shot. You MUST call the "shoot" tool.`),
//     ])

//     const toolCall = response.tool_calls?.[0]
//     if (!toolCall || toolCall.name !== shoot.name) {
//         return { messages: [response], llmCalls: 1 }
//     }

//     const { coordinate } = toolCall.args as { coordinate: string }

//     const result = interrupt({ type: InterruptType.SHOT, payload: { coordinate } }) as { hit: boolean }

//     config?.writer && config.writer({
//         agent: result.hit ? `Hit at ${coordinate}!` : `Miss at ${coordinate}`,
//     })

    return {
        messages: [],
        llmCalls: 1,
    }
}