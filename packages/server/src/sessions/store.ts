import { v4 as uuidv4 } from 'uuid'
import * as db from '../db/sessions'
import * as players from './players'
import type { Session } from '@battleship/core/session'

export const create = (): Session => {
  const session = db.insert({ id: uuidv4(), createdAt: Date.now() })
  players.initialize(session.id)
  return session
}

export const getAll = (): Session[] =>
  db.getAll()

export const getById = (id: string): Session | undefined =>
  db.getById(id)

export const remove = (id: string): boolean =>
  db.remove(id)
