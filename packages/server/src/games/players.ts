import { PLAYER_HUMAN, PLAYER_AGENT } from '@battleship/core/session'
import { init as initBoard, addShip } from '@battleship/core/board'
import type { Ship } from '@battleship/core/ship'
import * as db from '../db/players'
import type { Player } from '../db/players'

export const initialize = (sessionId: string): void => {
  const emptyBoard = initBoard()
  db.insert(sessionId, PLAYER_HUMAN, emptyBoard)
  db.insert(sessionId, PLAYER_AGENT, emptyBoard)
}

export const placeShip = (sessionId: string, userId: string, ship: Ship): Player => {
  const player = db.getPlayer(sessionId, userId)
  if (!player) {
    throw new Error('Player not found')
  }
  const updatedBoard = addShip(player.board, ship)
  const result = db.updateBoard(sessionId, userId, updatedBoard)
  if (!result) {
    throw new Error('Failed to update board')
  }
  return result
}

export const getPlayer = (sessionId: string, userId: string): Player | undefined =>
  db.getPlayer(sessionId, userId)

export const getBySession = (sessionId: string): Player[] =>
  db.getBySession(sessionId)
