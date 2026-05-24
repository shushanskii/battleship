import { v4 as uuidv4 } from 'uuid'
import * as db from '../db/sessions'
import * as dbGame from '../db/game'
import * as players from './players'
import type { Game } from '../db/game'

export const create = (): Game => {
  const session = db.insert({ id: uuidv4(), createdAt: Date.now() })
  players.initialize(session.id)
  return dbGame.getById(session.id)!
}

export const getAll = (): Game[] =>
  dbGame.getAll()

export const getById = (id: string): Game | undefined =>
  dbGame.getById(id)

export const remove = (id: string): boolean =>
  db.remove(id)
