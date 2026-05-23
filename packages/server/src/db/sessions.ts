import db from './index'
import type { Session } from '@battleship/core/session'

type SessionRow = {
  id: string
  phase: string
  created_at: number
}

const toSession = (row: SessionRow): Session => ({
  id: row.id,
  phase: row.phase as Session['phase'],
  createdAt: row.created_at,
})

const insertStmt = db.prepare<[string, string, number]>(
  'INSERT INTO sessions (id, phase, created_at) VALUES (?, ?, ?)'
)
const selectAllStmt = db.prepare<[], SessionRow>('SELECT * FROM sessions')
const selectOneStmt = db.prepare<[string], SessionRow>('SELECT * FROM sessions WHERE id = ?')
const updatePhaseStmt = db.prepare<[string, string]>('UPDATE sessions SET phase = ? WHERE id = ?')
const deleteStmt = db.prepare<[string]>('DELETE FROM sessions WHERE id = ?')

export const insert = (session: Session): Session => {
  insertStmt.run(session.id, session.phase, session.createdAt)
  return session
}

export const getAll = (): Session[] =>
  selectAllStmt.all().map(toSession)

export const getById = (id: string): Session | undefined => {
  const row = selectOneStmt.get(id)
  return row ? toSession(row) : undefined
}

export const update = (id: string, patch: Partial<Pick<Session, 'phase'>>): Session | undefined => {
  if (patch.phase) {
    updatePhaseStmt.run(patch.phase, id)
  }
  return getById(id)
}

export const remove = (id: string): boolean =>
  deleteStmt.run(id).changes > 0
