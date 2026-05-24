import db from './index'
import type { Shot } from '@battleship/core/game'

export type { Shot }

type ShotRow = {
  id: number
  session_id: string
  user_id: string
  cell_index: string
  created_at: number
}

const toShot = (row: ShotRow): Shot => ({
  id: row.id,
  sessionId: row.session_id,
  userId: row.user_id,
  cellIndex: row.cell_index,
  createdAt: row.created_at,
})

const insertStmt = db.prepare<[string, string, string, number]>(
  'INSERT INTO shots (session_id, user_id, cell_index, created_at) VALUES (?, ?, ?, ?)'
)
const selectBySessionStmt = db.prepare<[string], ShotRow>(
  'SELECT * FROM shots WHERE session_id = ? ORDER BY id'
)
const selectByPlayerStmt = db.prepare<[string, string], ShotRow>(
  'SELECT * FROM shots WHERE session_id = ? AND user_id = ? ORDER BY id'
)

export const insert = (sessionId: string, userId: string, cellIndex: string): Shot => {
  const createdAt = Date.now()
  const result = insertStmt.run(sessionId, userId, cellIndex, createdAt)
  return { id: Number(result.lastInsertRowid), sessionId, userId, cellIndex, createdAt }
}

export const getBySession = (sessionId: string): Shot[] =>
  selectBySessionStmt.all(sessionId).map(toShot)

export const getByPlayer = (sessionId: string, userId: string): Shot[] =>
  selectByPlayerStmt.all(sessionId, userId).map(toShot)
