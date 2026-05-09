import * as Board from "@battleship/core/board"
import * as Ship from "@battleship/core/ship"
import {
  AIMessage,
} from "@langchain/core/messages"
import {
  type ConditionalEdgeRouter,
  END,
  type GraphNode,
  interrupt,
  MemorySaver,
  MessagesValue,
  ReducedValue,
  START,
  StateGraph,
  StateSchema,
} from "@langchain/langgraph"
import { InterruptType } from "@battleship/core"
import { ChatOpenAI } from "@langchain/openai"
import * as z from "zod"
import { askForStrategy, askToPlace } from "./nodes/llm"
import { defineStrategy, place } from "./tools"

export const getModel = (modelName: string) =>
  new ChatOpenAI({
    apiKey: "some-key",
    model: modelName,
    configuration: {
      baseURL: "http://192.168.0.36:1234/v1",
    },
  }).bindTools([defineStrategy, place])

const initTargetBoard = (): Board.Board => {
  const board = Board.init()
  for (const cell of Object.values(board.cells)) {
    cell.status = Board.CellStatus.UNKNOWN
  }
  return board
}

export const BattleshipState = new StateSchema({
  board: new ReducedValue(z.custom<Board.Board>().default(Board.init()), {
    reducer: (_, next) => next,
  }),
  targetBoard: new ReducedValue(z.custom<Board.Board>().default(initTargetBoard()), {
    inputSchema: z.object({ coordinate: z.string(), hit: z.boolean() }),
    reducer: (board: Board.Board, { coordinate, hit }: { coordinate: string; hit: boolean }) => {
      const next = Board.clone(board)
      Board.setStatus(next, coordinate, hit ? Board.CellStatus.HIT : Board.CellStatus.MISS)
      return next
    },
  }),
  ships: new ReducedValue(z.custom<Ship.Ship[]>().default([]), {
    inputSchema: z.custom<Ship.Ship>(),
    reducer: (current: Ship.Ship[], placed: Ship.Ship) => [...current, placed],
  }),
  unplacedShips: new ReducedValue(
    z.array(z.number()).default([4, 3, 3, 2, 2, 2, 1, 1, 1, 1]),
    {
      inputSchema: z.number(),
      reducer: (current: number[], removed: number) => {
        const idx = current.indexOf(removed)
        return idx === -1 ? current : [...current.slice(0, idx), ...current.slice(idx + 1)]
      },
    },
  ),
  messages: MessagesValue,
  llmCalls: new ReducedValue(z.number().default(0), {
    reducer: (x, y) => x + y,
  }),
  strategy: new ReducedValue(z.string().default(""), {
    reducer: (_, next) => next,
  }),
  history: new ReducedValue(z.array(z.string()).default([]), {
    inputSchema: z.string(),
    reducer: (current: string[], next: string) => [...current, next],
  }),
})



const toolNode: GraphNode<typeof BattleshipState> = async (state, config) => {
  const lastMessage = state.messages[state.messages.length - 1]

  if (!AIMessage.isInstance(lastMessage)) {
    return { messages: [] }
  }

  const toolCall = lastMessage.tool_calls?.[0]
  if (!toolCall) {
    return { messages: [] }
  }

  if (toolCall.name === place.name) {
    const { origin, direction, size, description } = toolCall.args as {
      origin: string
      direction: Ship.ShipDirection
      size: number
      description: string
    }
    const ship = Ship.init(origin, direction, size)

    const board = Board.init()
    for (const s of state.ships) {
      Board.place(board, s)
    }
    Board.place(board, ship)

    config?.writer && config.writer({ agent: "Ship placed" })
    return { board, ships: ship, unplacedShips: size, history: `size ${size}, ${origin}, ${direction} — ${description}` }
  }

  if (toolCall.name === defineStrategy.name) {
    const { strategy } = toolCall.args as {
      strategy: string
    }

    config?.writer && config.writer({ agent: "Strategy defined" })
    return { strategy }
  }

  return { messages: [] }
}

const shouldPlace: ConditionalEdgeRouter<typeof BattleshipState, any> = (
  state,
  config
) => {
  const lastMessage = state.messages[state.messages.length - 1]
  if (!AIMessage.isInstance(lastMessage)) {
    return END
  }

  const toolCall = lastMessage.tool_calls?.[0]
  if (!toolCall) {
    return "askToPlace"
  }

  const { origin, direction, size } = toolCall.args as {
    origin: string
    direction: Ship.ShipDirection
    size: number
  }

  if (!state.unplacedShips.includes(size)) {
    config?.writer && config.writer({ agent: "Invalid size, retrying" })
    return "askToPlace"
  }

  const ship = Ship.init(origin, direction, size)

  const board = Board.init()
  for (const s of state.ships) {
    Board.place(board, s)
  }

  if (Board.canPlace(board, ship)) {
    return "toolNode"
  } else {
    config?.writer && config.writer({ agent: "Invalid position, retrying" })
    return "askToPlace"
  }
}

const routeAfterTool: ConditionalEdgeRouter<typeof BattleshipState, any> = (state) => {
  if (state.unplacedShips.length > 0) {
    return "askToPlace"
  }
  return "awaitTurnNode"
}

const awaitTurnNode: GraphNode<typeof BattleshipState> = async (_state, config) => {
  config?.writer && config.writer({ agent: "Fleet ready" })
  interrupt({ type: InterruptType.READY, payload: null })
  return {}
}

export const newAgent = () =>
  new StateGraph(BattleshipState)
    .addNode("askForStrategy", askForStrategy)
    .addNode("askToPlace", askToPlace)
    .addNode("toolNode", toolNode)
    .addNode("awaitTurnNode", awaitTurnNode)
    .addEdge(START, "askForStrategy")
    .addEdge("askForStrategy", "toolNode")
    .addEdge("awaitTurnNode", END)
    .addConditionalEdges("askToPlace", shouldPlace, ["toolNode", "askToPlace", END])
    .addConditionalEdges("toolNode", routeAfterTool, ["askToPlace", "awaitTurnNode"])
    .compile({ checkpointer: new MemorySaver() })
