import { Command } from "@langchain/langgraph"
import { type WebSocket, WebSocketServer } from "ws"
import { runStream } from "./stream"
import { MessageType, MessageValue } from "@battleship/core"

const wss = new WebSocketServer({ host: "0.0.0.0", port: 3002 })

const connections = new Map<string, WebSocket>()

export type SendMessage = <T extends MessageType>(
  id: string,
  type: T,
  payload: MessageValue[T],
) => void

export const sendMessage: SendMessage = <T extends MessageType>(
  id: string,
  type: T,
  payload: MessageValue[T],
) => {
  const ws = connections.get(id)
  if (!ws || ws.readyState !== 1) {
    return
  }

  ws.send(JSON.stringify({ type, payload }))
}

export const setupWebSocket = (sessions: Map<string, any>) => {
  wss.on("connection", (ws, req) => {
    const url = new URL(req.url!, "http://localhost")
    const id = url.searchParams.get("id")

    if (!id) {
      ws.close()
      return
    }

    const agent = sessions.get(id)
    if (!agent) {
      ws.close()
      return
    }

    connections.set(id, ws)

    runStream(agent, id, {}, sendMessage)

    ws.on("message", (raw: Buffer) => {
      try {
        const { type, payload } = JSON.parse(raw.toString())
        if (type === "answer") {
          runStream(agent, id, new Command({ resume: payload }), sendMessage)
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
