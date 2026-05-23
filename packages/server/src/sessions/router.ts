import { Router } from 'express'
import * as store from './store'
import * as players from './players'
import { PLAYER_HUMAN, PLAYER_AGENT } from '@battleship/core/session'

const router = Router()

const VALID_USERS = [PLAYER_HUMAN, PLAYER_AGENT]

router.get('/', (_req, res) => {
  res.json(store.getAll())
})

router.post('/', (_req, res) => {
  const session = store.create()
  res.status(201).json(session)
})

router.get('/:id', (req, res) => {
  const session = store.getById(req.params.id)
  if (!session) {
    res.status(404).json({ error: 'Session not found' })
    return
  }
  res.json(session)
})

router.delete('/:id', (req, res) => {
  const deleted = store.remove(req.params.id)
  if (!deleted) {
    res.status(404).json({ error: 'Session not found' })
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

  const session = store.getById(req.params.id)
  if (!session) {
    res.status(404).json({ error: 'Session not found' })
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

  const session = store.getById(req.params.id)
  if (!session) {
    res.status(404).json({ error: 'Session not found' })
    return
  }

  res.status(200).json({ message: 'Shot recorded' })
})

export default router
