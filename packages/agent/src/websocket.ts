import { Command } from "@langchain/langgraph"
import { type WebSocket, WebSocketServer } from "ws"
import { createStream } from "./stream"
import { type MessageType, type MessageValue } from "@battleship/core"

const wss = new WebSocketServer({ host: "0.0.0.0", port: 3002 })

const connections = new Map<string, WebSocket>()

export const sendMessage = <T extends MessageType>(
  id: string,
  model: string,
  type: T,
  payload: MessageValue[T],
) => {
  const ws = connections.get(id)
  if (!ws || ws.readyState !== 1) {
    return
  }
  ws.send(JSON.stringify({ model, type, payload }))
}

export const setupWebSocket = (sessions: Map<string, any>) => {
  wss.on("connection", (ws, req) => {
    const url = new URL(req.url!, "http://localhost")
    const id = url.searchParams.get("id")

    if (!id) {
      ws.close()
      return
    }

    const agents: Record<string, any> = sessions.get(id)
    if (!agents) {
      ws.close()
      return
    }

    connections.set(id, ws)

    for (const [modelName, agent] of Object.entries(agents)) {
      const { stream } = createStream(modelName)
      stream(agent, id)
    }

    ws.on("message", (raw: Buffer) => {
      try {
        const { type, model: modelName, payload } = JSON.parse(raw.toString())
        if (type === "answer") {
          const { stream } = createStream(modelName)
          stream(sessions.get(id)[modelName], id, new Command({ resume: payload }))
        }
      } catch (_e) {
        console.error(`[${id}] invalid message:`, raw.toString())
      }
    })

    ws.on("close", () => {
      connections.delete(id)
    })
  })
}
