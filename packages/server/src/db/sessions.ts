import db from './index'
import type { Session } from '@battleship/core/session'

type SessionRow = {
  id: string
  created_at: number
}

const toSession = (row: SessionRow): Session => ({
  id: row.id,
  createdAt: row.created_at,
})

const insertStmt = db.prepare<[string, number]>(
  'INSERT INTO sessions (id, created_at) VALUES (?, ?)'
)
const selectAllStmt = db.prepare<[], SessionRow>('SELECT * FROM sessions')
const selectOneStmt = db.prepare<[string], SessionRow>('SELECT * FROM sessions WHERE id = ?')
const deleteStmt = db.prepare<[string]>('DELETE FROM sessions WHERE id = ?')

export const insert = (session: Session): Session => {
  insertStmt.run(session.id, session.createdAt)
  return session
}

export const getAll = (): Session[] =>
  selectAllStmt.all().map(toSession)

export const getById = (id: string): Session | undefined => {
  const row = selectOneStmt.get(id)
  return row ? toSession(row) : undefined
}

export const remove = (id: string): boolean =>
  deleteStmt.run(id).changes > 0
