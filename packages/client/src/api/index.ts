import { PLAYER_HUMAN } from '@battleship/core/session'
import type { GameView, Shot } from '@battleship/core/game'

export type { Shot, GameView }

const BASE = 'http://192.168.0.103:3001'

export const fetchGames = async (): Promise<Record<string, GameView>> => {
  try {
    const response = await fetch(`${BASE}/games?userId=${PLAYER_HUMAN}`)
    return response.json()
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error))
  }
}

export const createGame = async (): Promise<GameView> => {
  try {
    const response = await fetch(`${BASE}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: PLAYER_HUMAN }),
    })
    return response.json()
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error))
  }
}

export const fetchGame = async (id: string): Promise<GameView> => {
  try {
    const response = await fetch(`${BASE}/games/${id}?userId=${PLAYER_HUMAN}`)
    const data = await response.json()
    if (data.error) {
      throw new Error(data.error)
    }
    return data as GameView
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error))
  }
}

export const deleteGame = async (id: string): Promise<void> => {
  try {
    await fetch(`${BASE}/games/${id}`, { method: 'DELETE' })
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error))
  }
}
