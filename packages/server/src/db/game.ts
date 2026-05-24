import type { Session } from '@battleship/core/session'
import * as dbSessions from './sessions'
import * as dbPlayers from './players'
import * as dbShots from './shots'
import type { Player } from './players'
import type { Shot } from './shots'

export type Game = {
  session: Session
  players: Record<string, Player>
  shots: Shot[]
}

export const getById = (id: string): Game | undefined => {
  const session = dbSessions.getById(id)
  if (!session) return undefined

  const players: Record<string, Player> = {}
  for (const player of dbPlayers.getBySession(id)) {
    players[player.userId] = player
  }

  const shots = dbShots.getBySession(id)

  return { session, players, shots }
}

export const getAll = (): Game[] => {
  return dbSessions.getAll().map((session) => {
    const players: Record<string, Player> = {}
    for (const player of dbPlayers.getBySession(session.id)) {
      players[player.userId] = player
    }
    const shots = dbShots.getBySession(session.id)
    return { session, players, shots }
  })
}
