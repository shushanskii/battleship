import db from './index'
import type { Board } from '@battleship/core/board'

type PlayerRow = {
  session_id: string
  user_id: string
  board: string
  created_at: number
}

export type Player = {
  sessionId: string
  userId: string
  board: Board
  createdAt: number
}

const toPlayer = (row: PlayerRow): Player => ({
  sessionId: row.session_id,
  userId: row.user_id,
  board: JSON.parse(row.board) as Board,
  createdAt: row.created_at,
})

const insertStmt = db.prepare<[string, string, string, number]>(
  'INSERT INTO players (session_id, user_id, board, created_at) VALUES (?, ?, ?, ?)'
)
const updateBoardStmt = db.prepare<[string, string, string]>(
  'UPDATE players SET board = ? WHERE session_id = ? AND user_id = ?'
)
const selectBySessionStmt = db.prepare<[string], PlayerRow>(
  'SELECT * FROM players WHERE session_id = ?'
)
const selectOneStmt = db.prepare<[string, string], PlayerRow>(
  'SELECT * FROM players WHERE session_id = ? AND user_id = ?'
)

export const insert = (sessionId: string, userId: string, board: Board): Player => {
  const createdAt = Date.now()
  insertStmt.run(sessionId, userId, JSON.stringify(board), createdAt)
  return { sessionId, userId, board, createdAt }
}

export const updateBoard = (sessionId: string, userId: string, board: Board): Player | undefined => {
  updateBoardStmt.run(JSON.stringify(board), sessionId, userId)
  return getPlayer(sessionId, userId)
}

export const getBySession = (sessionId: string): Player[] =>
  selectBySessionStmt.all(sessionId).map(toPlayer)

export const getPlayer = (sessionId: string, userId: string): Player | undefined => {
  const row = selectOneStmt.get(sessionId, userId)
  return row ? toPlayer(row) : undefined
}
