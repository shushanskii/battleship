import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { GameView } from '@battleship/core/game'
import type { Board } from '@battleship/core/board'

type GamesState = Record<string, GameView>

const initialState: GamesState = {}

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setGame: (state, { payload }: PayloadAction<GameView>) => {
      state[payload.session.id] = payload
    },
    setGames: (_state, { payload }: PayloadAction<Record<string, GameView>>) => payload,
    removeGame: (state, { payload }: PayloadAction<string>) => {
      delete state[payload]
    },
    updateBoard: (state, { payload }: PayloadAction<{ sessionId: string; board: Board }>) => {
      if (state[payload.sessionId]) {
        state[payload.sessionId].board = payload.board
      }
    },
  },
})

export const { setGame, setGames, removeGame, updateBoard } = gamesSlice.actions
export const gamesReducer = gamesSlice.reducer
