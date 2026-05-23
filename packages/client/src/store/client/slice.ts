import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type ClientState = {
  currentSession: string | null
  error: string | null
}

const initialState: ClientState = {
  currentSession: null,
  error: null,
}

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setCurrentSession: (state, { payload }: PayloadAction<string | null>) => {
      state.currentSession = payload
    },
    setError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload
    },
    resetError: (state) => {
      state.error = null
    },
  },
})

export const { setCurrentSession, setError, resetError } = clientSlice.actions
export const clientReducer = clientSlice.reducer
