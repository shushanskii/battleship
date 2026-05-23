import { WebSocketServer } from 'ws'
import type { IncomingMessage, Server } from 'http'
import * as sessionStore from '../sessions/store'
import type { Connection, Role } from './types'

const connections = new Map<string, Connection>()

const key = (sessionId: string, role: Role) => `${sessionId}:${role}`

export const get = (sessionId: string, role: Role) =>
  connections.get(key(sessionId, role))

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws, req: IncomingMessage) => {
    const url = new URL(req.url!, 'http://localhost')
    const sessionId = url.searchParams.get('id')
    const role = url.searchParams.get('role') as Role | null

    if (!sessionId || !role || (role !== 'player' && role !== 'agent')) {
      ws.close(1008, 'Missing or invalid id/role')
      return
    }

    const session = sessionStore.getById(sessionId)
    if (!session) {
      ws.close(1008, 'Session not found')
      return
    }

    if (connections.has(key(sessionId, role))) {
      ws.close(1008, 'Role already connected')
      return
    }

    connections.set(key(sessionId, role), { ws, sessionId, role })
    console.log(`[${sessionId}] ${role} connected`)

    ws.on('message', (raw) => {
      console.log(`[${sessionId}:${role}]`, raw.toString())
    })

    ws.on('close', () => {
      connections.delete(key(sessionId, role))
      console.log(`[${sessionId}] ${role} disconnected`)
    })
  })
}
