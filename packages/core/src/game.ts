import type { Session } from './session'
import type { Board } from './board'

export type Shot = {
  id: number
  sessionId: string
  userId: string
  cellIndex: string
  createdAt: number
}

export type GameView = {
  session: Session
  board: Board | null
  shots: Shot[]
}
