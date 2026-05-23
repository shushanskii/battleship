import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Session } from '@battleship/core/session'

type SessionsState = Record<string, Session>

const initialState: SessionsState = {}

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    addSession: (state, action: PayloadAction<Session>) => {
      state[action.payload.id] = action.payload
    },
    removeSession: (state, action: PayloadAction<string>) => {
      delete state[action.payload]
    },
    addSessions: (state, action: PayloadAction<Session[]>) => {
      action.payload.forEach(session => {
        state[session.id] = session
      })
    }
  },
})

export const { addSession, removeSession, addSessions } = sessionsSlice.actions
export const sessionsReducer = sessionsSlice.reducer
