export type GamePhase = 'waiting' | 'placement' | 'playing' | 'finished'

export type Session = {
  id: string
  phase: GamePhase
  createdAt: number
}
