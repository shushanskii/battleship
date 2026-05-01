import * as Board from "@battleship/core/board"
import * as Ship from "@battleship/core/ship"
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages"
import { tool } from "@langchain/core/tools"
import {
  Command,
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
import { ChatOpenAI } from "@langchain/openai"
import * as z from "zod"

const place = tool(({ origin, direction }) => ({ origin, direction }), {
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
  }),
})

const toolsByName = {
  [place.name]: place,
}
const tools = Object.values(toolsByName)

export const model = new ChatOpenAI({
  configuration: {
    baseURL: "http://192.168.0.36:1234/v1",
  },
  apiKey: "asdasdas",
  temperature: 0.7,
}).bindTools(tools)

const BattleshipState = new StateSchema({
  board: new ReducedValue(z.custom<Board.Board>().default(Board.init()), {
    reducer: (_, next) => next,
  }),
  ships: new ReducedValue(z.custom<Ship.Ship[]>().default([]), {
    inputSchema: z.custom<Ship.Ship>(),
    reducer: (current: Ship.Ship[], placed: Ship.Ship) => [...current, placed],
  }),
  unplacedShips: new ReducedValue(
    z.array(z.number()).default([4, 3, 3, 2, 2, 2, 1, 1, 1, 1]),
    { reducer: (current: number[]) => current.slice(1) },
  ),
  messages: MessagesValue,
  llmCalls: new ReducedValue(z.number().default(0), {
    reducer: (x, y) => x + y,
  }),
})

const llmCall: GraphNode<typeof BattleshipState> = async (state, config) => {
  
  config?.writer && config.writer({ agent: "LLM request" });
  
  const board = Board.init()
  for (const ship of state.ships) {
    Board.place(board, ship)
  }

  const response = await model.invoke([
    new SystemMessage(
      `
You are placing ships on a Battleship grid.

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

## Input

You will receive:
- the current state of the battleground
- the size of the ship to place

## Strategy

- Spread ships evenly across the grid.
- Alternate between horizontal and vertical directions.
- Avoid clustering ships in one area — it makes you easier to defeat.
        `,
    ),
    new HumanMessage(`
Current battleground:
${Board.print(board, state.ships)}

Place a ship of size ${state.unplacedShips[0]}. You MUST call the "place" tool.
        `),
  ])
  return {
    messages: [response],
  }
}

const toolNode: GraphNode<typeof BattleshipState> = async (state, config) => {
  const lastMessage = state.messages[state.messages.length - 1]

  if (!AIMessage.isInstance(lastMessage)) {
    return { messages: [] }
  }

  const toolCall = lastMessage.tool_calls?.[0]
  if (!toolCall) {
    return { messages: [] }
  }

  config?.writer && config.writer({ agent: `too call, ${JSON.stringify(toolCall)}` });

  const { origin, direction } = toolCall.args as {
    origin: string
    direction: Ship.ShipDirection
  }
  const ship = Ship.init(origin, direction, state.unplacedShips[0])

  const board = Board.init()
  for (const s of state.ships) {
    Board.place(board, s)
  }
  Board.place(board, ship)

  return {
    board,
    ships: ship,
    unplacedShips: [],
  }
}

const shouldPlace: ConditionalEdgeRouter<typeof BattleshipState, any> = (
  state,
) => {
  const lastMessage = state.messages[state.messages.length - 1]
  if (!AIMessage.isInstance(lastMessage)) {
    return END
  }

  const toolCall = lastMessage.tool_calls?.[0]
  if (!toolCall) {
    return "llmCall"
  }

  const { origin, direction } = toolCall.args as {
    origin: string
    direction: Ship.ShipDirection
  }
  const ship = Ship.init(origin, direction, state.unplacedShips[0])

  const board = Board.init()
  for (const s of state.ships) {
    Board.place(board, s)
  }

  if (Board.canPlace(board, ship)) {
    return "toolNode"
  } else {
    return "llmCall"
  }
}

const shouldCallLLM: ConditionalEdgeRouter<typeof BattleshipState, any> = (
  state,
) => {
  if (state.unplacedShips.length > 0) {
    return "llmCall"
  } else {
    return END
  }
}

const approvalNode = async () => {
  // Pause execution; payload surfaces in result.__interrupt__
  const isApproved = interrupt("Do you want to proceed?")

  // Route based on the response
  if (isApproved) {
    return new Command({ goto: "llmCall" }) // Runs after the resume payload is provided
  } else {
    return new Command({ goto: END })
  }
}

export const newAgent = () =>
  new StateGraph(BattleshipState)
    // .addNode("approvalNode", approvalNode)
    .addNode("llmCall", llmCall)
    .addNode("toolNode", toolNode)
    .addEdge(START, "llmCall")
    // .addEdge("approvalNode", "llmCall")
    .addConditionalEdges("llmCall", shouldPlace, ["toolNode", "llmCall", END])
    .addConditionalEdges("toolNode", shouldCallLLM, ["llmCall", END])
    .compile({ checkpointer: new MemorySaver() })
