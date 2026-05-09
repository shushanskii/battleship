import { INTERRUPT, Command } from "@langchain/langgraph"
import { InterruptType, MessageType, type Interrupt, type MessageValue } from "@battleship/core"
import { type WebSocket, WebSocketServer } from "ws"

const wss = new WebSocketServer({ host: "0.0.0.0", port: 3002 })
const connections = new Map<string, WebSocket>()

const sendMessage = <T extends MessageType>(
  id: string,
  modelName: string,
  type: T,
  payload: MessageValue[T],
) => {
  const ws = connections.get(`${id}:${modelName}`)
  if (!ws || ws.readyState !== 1) return
  ws.send(JSON.stringify({ type, payload }))
}

const runStream = async (agent: any, id: string, modelName: string, input: any = {}) => {
  const send = <T extends MessageType>(type: T, payload: MessageValue[T]) =>
    sendMessage(id, modelName, type, payload)

  for await (const [mode, chunk] of await agent
    .withConfig({
      configurable: { thread_id: id, modelName },
      recursionLimit: 100,
    })
    .stream(input, {
      streamMode: ["messages", "updates", "values", "custom"],
    })) {
    if (mode === "messages") {
      const [message] = chunk
      if (message.response_metadata?.usage?.total_tokens) {
        send(MessageType.TOKENS, message.response_metadata.usage.total_tokens)
      }
    }

    if (mode === "updates") {
      if (chunk[INTERRUPT]) {
        for (const i of chunk[INTERRUPT]) {
          if (i.id == null) continue
          const value = i.value as Interrupt
          if (value.type === InterruptType.READY) {
            send(MessageType.READY, null)
          } else {
            send(MessageType.QUESTION, i.value)
          }
        }
      }
    }

    if (mode === "values") {
      if (chunk.board != null) {
        send(MessageType.BOARD, chunk.board)
      }
      if (chunk.history?.length > 0) {
        send(MessageType.HISTORY, chunk.history)
      }
      if (chunk.llmCalls != null) {
        send(MessageType.LLM_CALLS, chunk.llmCalls)
      }
      if (chunk.strategy) {
        send(MessageType.STRATEGY, chunk.strategy)
      }
    }

    if (mode === "custom") {
      send(MessageType.AGENT, { text: chunk.agent, ts: Date.now() })
    }
  }
}

export const setupChannel = (sessions: Map<string, any>) => {
  wss.on("connection", (ws, req) => {
    const url = new URL(req.url!, "http://localhost")
    const id = url.searchParams.get("id")
    const modelName = url.searchParams.get("model")

    if (!id || !modelName) {
      ws.close()
      return
    }

    const agents: Record<string, any> = sessions.get(id)
    if (!agents || !agents[modelName]) {
      ws.close()
      return
    }

    connections.set(`${id}:${modelName}`, ws)

    runStream(agents[modelName], id, modelName)

    ws.on("message", (raw: Buffer) => {
      try {
        const { type, payload } = JSON.parse(raw.toString())
        if (type === "answer") {
          runStream(agents[modelName], id, modelName, new Command({ resume: payload }))
        }
      } catch (_e) {
        console.error(`[${id}:${modelName}] invalid message:`, raw.toString())
      }
    })

    ws.on("close", () => {
      connections.delete(`${id}:${modelName}`)
    })
  })
}
