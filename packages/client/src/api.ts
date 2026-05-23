const BASE = 'http://192.168.0.103:3001'

export type Session = {
  id: string
  phase: 'waiting' | 'placement' | 'playing' | 'finished'
  createdAt: number
}

export const fetchSessions = (): Promise<Session[]> =>
  fetch(`${BASE}/sessions`).then((r) => r.json())

export const createSession = (): Promise<Session> =>
  fetch(`${BASE}/sessions`, { method: 'POST' }).then((r) => r.json())

export const deleteSession = (id: string): Promise<void> =>
  fetch(`${BASE}/sessions/${id}`, { method: 'DELETE' }).then(() => undefined)
