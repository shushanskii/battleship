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
import { InterruptType, MessageType } from "@battleship/core"
import { ChatOpenAI } from "@langchain/openai"
import * as z from "zod"
import { agentShootNode, askForStrategy, askToPlace } from "./nodes/llm"
import { defineStrategy, place } from "./tools"

export const getModel = (modelName: string, tools: any[] = [defineStrategy, place]) =>
  new ChatOpenAI({
    apiKey: "some-key",
    model: modelName,
    configuration: {
      baseURL: "http://192.168.0.36:1234/v1",
    },
  }).bindTools(tools)

export const BattleshipState = new StateSchema({
  board: new ReducedValue(z.custom<Board.Board>().default(Board.init()), {
    inputSchema: z.any(),
    reducer: (board: Board.Board, input: Ship.Ship | { coordinate: string; hit: boolean }) => {
      if ('origin' in input) {
        return Board.addShip(board, input as Ship.Ship)
      }
      const { coordinate, hit } = input as { coordinate: string; hit: boolean }
      return Board.setStatus(board, coordinate, hit ? Board.CellStatus.HIT : Board.CellStatus.MISS)
    },
  }),
  targetBoard: new ReducedValue(z.custom<Board.Board>().default(Board.init(Board.DEFAULT_BOARD_SIZE, Board.CellStatus.UNKNOWN)), {
    inputSchema: z.object({ coordinate: z.string(), hit: z.boolean() }),
    reducer: (board: Board.Board, { coordinate, hit }: { coordinate: string; hit: boolean }) =>
      Board.setStatus(board, coordinate, hit ? Board.CellStatus.HIT : Board.CellStatus.MISS),
  }),
  unplacedShips: new ReducedValue(
    z.array(z.number()).default([4]),
    // z.array(z.number()).default([4, 3, 3, 2, 2, 2, 1, 1, 1, 1]),
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

    config?.writer && config.writer({ agent: "Ship placed" })
    return { board: ship, unplacedShips: size, history: `size ${size}, ${origin}, ${direction} — ${description}` }
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

  if (Board.canPlace(state.board, ship)) {
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
  return "awaitUserShotNode"
}

const awaitUserShotNode: GraphNode<typeof BattleshipState> = async (state, config) => {
  const { type, payload } = interrupt({ type: InterruptType.READY, payload: null })

  if (type === MessageType.SHOOT) {
    const hit = state.board.cells[payload]?.status === Board.CellStatus.SHIP
    config?.writer && config.writer({ shot: { coordinate: payload, hit } })
    return { board: { coordinate: payload, hit } }
  }


  return {}
}

export const newAgent = () =>
  new StateGraph(BattleshipState)
    .addNode("askForStrategy", askForStrategy)
    .addNode("askToPlace", askToPlace)
    .addNode("toolNode", toolNode)
    .addNode("awaitUserShotNode", awaitUserShotNode)
    .addNode("agentShootNode", agentShootNode)
    .addEdge(START, "askForStrategy")
    .addEdge("askForStrategy", "toolNode")
    .addEdge("awaitUserShotNode", "agentShootNode")
    .addEdge("agentShootNode", "awaitUserShotNode")
    .addConditionalEdges("askToPlace", shouldPlace, ["toolNode", "askToPlace", END])
    .addConditionalEdges("toolNode", routeAfterTool, ["askToPlace", "awaitUserShotNode"])
    .compile({ checkpointer: new MemorySaver() })
