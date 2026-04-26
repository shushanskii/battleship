import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
    StateGraph,
    StateSchema,
    MessagesValue,
    ReducedValue,
    GraphNode,
    ConditionalEdgeRouter,
    START,
    END,
    interrupt,
    MemorySaver,
} from "@langchain/langgraph";
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import * as z from "zod";
import { Ship, ShipDirection } from "./ship";
import { Board } from "./board";

const place = tool(
    ({ origin, direction }) => {
        console.log(`Placing ship at ${origin} facing ${direction}`)
        return { origin, direction }
    },
    {
        name: "place",
        description: "Place the current ship on the battleground",
        schema: z.object({
            origin: z.string().describe("First deck coordinate (leftmost if horizontal, topmost if vertical)"),
            direction: z.enum([ShipDirection.HORIZONTAL, ShipDirection.VERTICAL]).describe("Ship orientation"),
        }),
    }
);

const toolsByName = {
    [place.name]: place,
};
const tools = Object.values(toolsByName);

export const model = new ChatOpenAI({
    configuration: {
       baseURL: "http://192.168.0.36:1234/v1",
    },
    apiKey: 'asdasdas',
    temperature: 0.7,
}).bindTools(tools)


const BattleshipState = new StateSchema({
    board: new ReducedValue(
        z.custom<Board>().default(new Board()),
        { reducer: (_, next) => next }
    ),
    ships: new ReducedValue(
        z.custom<Ship[]>().default([]),
        {
            inputSchema: z.custom<Ship>(),
            reducer: (current: Ship[], placed: Ship) => [...current, placed]
        }
    ),
    unplacedShips: new ReducedValue(
        z.array(z.number()).default([4, 3, 3, 2, 2, 2, 1, 1, 1, 1]),
        { reducer: (current: number[]) => current.slice(1) }
    ),
    messages: MessagesValue,
    llmCalls: new ReducedValue(
        z.number().default(0),
        { reducer: (x, y) => x + y }
    ),
});

const llmCall: GraphNode<typeof BattleshipState> = async (state) => {
    console.log(state.board.print(state.ships))

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
        `
        ),
        new HumanMessage(`
Current battleground:
${state.board.print(state.ships)}

Place a ship of size ${state.unplacedShips[0]}. You MUST call the "place" tool.
        `),
    ]);
    return {
        messages: [response],
        llmCalls: 1,
    };
};

const toolNode: GraphNode<typeof BattleshipState> = async (state) => {
    const lastMessage = state.messages[state.messages.length - 1]

    if (!AIMessage.isInstance(lastMessage)) {
        return { messages: [] }
    }

    const toolCall = lastMessage.tool_calls?.[0]
    if (!toolCall) return { messages: [] }

    const { origin, direction } = toolCall.args as { origin: string; direction: ShipDirection }
    const ship = new Ship(origin, direction, state.unplacedShips[0])

    const board = state.board.clone()
    board.place(ship)

    return {
        board,
        ships: ship,
        unplacedShips: [],
    }
};

const shouldPlace: ConditionalEdgeRouter<typeof BattleshipState, any> = (state) => {
    const lastMessage = state.messages[state.messages.length - 1]
    if (!AIMessage.isInstance(lastMessage)) {
        return END
    }

    const toolCall = lastMessage.tool_calls?.[0]
    if (!toolCall) {
        console.log()
        const approved = interrupt("no toolCall in llm response, call llm");
        return "llmCall"
    }

    const { origin, direction } = toolCall.args as { origin: string; direction: ShipDirection }
    const ship = new Ship(origin, direction, state.unplacedShips[0])

    if (state.board.canPlace(ship)) {
        return "toolNode"
    } else {
        return "llmCall"
    }
}

const shouldCallLLM: ConditionalEdgeRouter<typeof BattleshipState, any> = (state) => {
    if (state.unplacedShips.length > 0) {
        return "llmCall"
    } else {
        console.log(state.board.print(state.ships))
        return END
    }
}

const agent = new StateGraph(BattleshipState)
    .addNode("llmCall", llmCall)
    .addNode("toolNode", toolNode)
    .addEdge(START, "llmCall")
    .addConditionalEdges("llmCall", shouldPlace, ["toolNode", "llmCall", END])
    .addConditionalEdges("toolNode", shouldCallLLM, ["llmCall", END])
    .compile({ checkpointer: new MemorySaver() });


(async () => {
    let thinking = ''
    let totalTokens = 0

    for await (const [mode, chunk] of await agent.withConfig({
        configurable: { thread_id: "123" }
    }).stream(
        {},
        { streamMode: ["messages", "updates", "values", "custom"] },
    )) {
        if (mode === "messages") {
            const [message, metadata] = chunk;

            //@ts-ignore
            if (message.response_metadata.usage.total_tokens) {
                //@ts-ignore
                totalTokens += message.response_metadata.usage.total_tokens
            }

            if (message.additional_kwargs.reasoning_content) {
                thinking += message.additional_kwargs.reasoning_content;
            }
        }

        if (mode === "values") {
            console.log(thinking)
            console.log('totalTokens', totalTokens)
            thinking = ''
        }
    }
})()