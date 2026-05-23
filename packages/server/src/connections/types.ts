import type { WebSocket } from 'ws'

export type Connection = {
  ws: WebSocket
  sessionId: string
  userId: string
}
