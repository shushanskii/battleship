import type { WebSocket } from 'ws'

export type Role = 'player' | 'agent'

export type Connection = {
  ws: WebSocket
  sessionId: string
  role: Role
}
