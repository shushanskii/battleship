import { Router } from 'express'
import { PLAYER_HUMAN, PLAYER_AGENT } from '@battleship/core/session'
import type { GameView } from '@battleship/core/game'
import type { Game } from '../db/game'
import * as store from './store'
import * as players from './players'

const router = Router()

const VALID_USERS = [PLAYER_HUMAN, PLAYER_AGENT]

const toGameView = (game: Game, userId: string): GameView => ({
  session: game.session,
  board: game.players[userId]?.board ?? null,
  shots: game.shots,
})

router.get('/', (req, res) => {
  const { userId } = req.query

  if (!userId || !VALID_USERS.includes(userId as string)) {
    res.status(400).json({ error: 'Missing or invalid userId' })
    return
  }

  const games = store.getAll()
  const result: Record<string, GameView> = {}
  for (const game of games) {
    result[game.session.id] = toGameView(game, userId as string)
  }

  res.json(result)
})

router.post('/', (req, res) => {
  const { userId } = req.body

  if (!userId || !VALID_USERS.includes(userId)) {
    res.status(400).json({ error: 'Missing or invalid userId' })
    return
  }

  const game = store.create()
  res.status(201).json(toGameView(game, userId))
})

router.get('/:id', (req, res) => {
  const { userId } = req.query

  if (!userId || !VALID_USERS.includes(userId as string)) {
    res.status(400).json({ error: 'Missing or invalid userId' })
    return
  }

  const game = store.getById(req.params.id)
  if (!game) {
    res.status(404).json({ error: 'Game not found' })
    return
  }

  res.json(toGameView(game, userId as string))
})

router.delete('/:id', (req, res) => {
  const deleted = store.remove(req.params.id)
  if (!deleted) {
    res.status(404).json({ error: 'Game not found' })
    return
  }
  res.status(204).send()
})

router.post('/:id/placement', (req, res) => {
  const { userId, ship } = req.body

  if (!userId || !VALID_USERS.includes(userId) || !ship) {
    res.status(400).json({ error: 'Missing or invalid userId or ship' })
    return
  }

  const game = store.getById(req.params.id)
  if (!game) {
    res.status(404).json({ error: 'Game not found' })
    return
  }

  try {
    const player = players.placeShip(req.params.id, userId, ship)
    res.json(player.board)
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) })
  }
})

router.post('/:id/shot', (req, res) => {
  const { userId, index } = req.body

  if (!userId || !VALID_USERS.includes(userId) || !index) {
    res.status(400).json({ error: 'Missing or invalid userId or index' })
    return
  }

  const game = store.getById(req.params.id)
  if (!game) {
    res.status(404).json({ error: 'Game not found' })
    return
  }

  res.status(200).json({ message: 'Shot recorded' })
})

export default router
