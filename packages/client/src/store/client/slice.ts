import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type ClientState = {
  currentGame: string | null
  error: string | null
}

const initialState: ClientState = {
  currentGame: null,
  error: null,
}

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setCurrentGame: (state, { payload }: PayloadAction<string | null>) => {
      state.currentGame = payload
    },
    setError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload
    },
    resetError: (state) => {
      state.error = null
    },
  },
})

export const { setCurrentGame, setError, resetError } = clientSlice.actions
export const clientReducer = clientSlice.reducer
