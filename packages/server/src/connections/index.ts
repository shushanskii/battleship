import { WebSocketServer } from 'ws'
import type { IncomingMessage, Server } from 'http'
import * as sessionStore from '../sessions/store'
import { PLAYER_HUMAN, PLAYER_AGENT } from '@battleship/core/session'
import type { Connection } from './types'

const VALID_USER_IDS = [PLAYER_HUMAN, PLAYER_AGENT]
const connections = new Map<string, Connection>()

const key = (sessionId: string, userId: string) => `${sessionId}:${userId}`

export const get = (sessionId: string, userId: string): Connection | undefined =>
  connections.get(key(sessionId, userId))

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws, req: IncomingMessage) => {
    const url = new URL(req.url!, 'http://localhost')
    const sessionId = url.searchParams.get('id')
    const userId = url.searchParams.get('userId')

    if (!sessionId || !userId || !VALID_USER_IDS.includes(userId)) {
      ws.close(1008, 'Missing or invalid id/userId')
      return
    }

    const session = sessionStore.getById(sessionId)
    if (!session) {
      ws.close(1008, 'Session not found')
      return
    }

    if (connections.has(key(sessionId, userId))) {
      ws.close(1008, 'User already connected')
      return
    }

    connections.set(key(sessionId, userId), { ws, sessionId, userId })
    console.log(`[${sessionId}] ${userId} connected`)

    ws.on('message', (raw) => {
      console.log(`[${sessionId}:${userId}]`, raw.toString())
    })

    ws.on('close', () => {
      connections.delete(key(sessionId, userId))
      console.log(`[${sessionId}] ${userId} disconnected`)
    })
  })
}
