import type { Session } from '@battleship/core/session'

export type { Session }

const BASE = 'http://192.168.0.103:3001'

export const fetchSessions = async (): Promise<Session[]> => {
  try {
    const response = await fetch(`${BASE}/sessions`)
    return response.json()
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error))
  }
}

export const createSession = async (): Promise<Session> => {
  try {
    const response = await fetch(`${BASE}/sessions`, { method: 'POST' })
    return response.json()
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error))
  }
}

export const fetchSession = async (id: string): Promise<Session> => {
  try {
    const response = await fetch(`${BASE}/sessions/${id}`)
    const data = await response.json()
    if (data.error) {
      throw new Error(data.error)
    }
    return data as Session
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error))
  }
}

export const deleteSession = async (id: string): Promise<void> => {
  try {
    await fetch(`${BASE}/sessions/${id}`, { method: 'DELETE' })
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error))
  }
}
