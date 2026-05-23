import { v4 as uuidv4 } from 'uuid'
import * as db from '../db/sessions'
import type { Session } from '@battleship/core/session'

export const create = (): Session =>
  db.insert({ id: uuidv4(), phase: 'waiting', createdAt: Date.now() })

export const getAll = (): Session[] =>
  db.getAll()

export const getById = (id: string): Session | undefined =>
  db.getById(id)

export const update = (id: string, patch: Partial<Pick<Session, 'phase'>>): Session | undefined =>
  db.update(id, patch)

export const remove = (id: string): boolean =>
  db.remove(id)
