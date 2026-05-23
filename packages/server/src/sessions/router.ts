import { Router } from 'express'
import * as store from './store'

const router = Router()

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

router.patch('/:id', (req, res) => {
  const session = store.update(req.params.id, req.body)
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

export default router
