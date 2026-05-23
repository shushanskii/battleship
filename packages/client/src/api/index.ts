import type { Session } from '@battleship/core/session'

export type { Session }

const BASE = 'http://192.168.0.103:3001'

export const fetchSessions = async (): Promise<Session[]> => {
  const response = await fetch(`${BASE}/sessions`)
  return response.json()
}

export const createSession = async (): Promise<Session> => {
  const response = await fetch(`${BASE}/sessions`, { method: 'POST' })
  return response.json()
}

export const deleteSession = async (id: string): Promise<void> => {
  await fetch(`${BASE}/sessions/${id}`, { method: 'DELETE' })
}
