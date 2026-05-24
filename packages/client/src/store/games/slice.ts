import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { GameView } from '@battleship/core/game'

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
  },
})

export const { setGame, setGames, removeGame } = gamesSlice.actions
export const gamesReducer = gamesSlice.reducer
