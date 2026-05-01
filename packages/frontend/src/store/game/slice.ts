import { MessageType, type MessageValue } from "@battleship/core"
import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

export type AnyMessage = { [T in MessageType]: MessageValue[T] }[MessageType]

type SessionData = { [T in MessageType]?: AnyMessage[] }

type SessionsState = {
  sessionId: string | null
  sessions: Record<string, SessionData>
}

const initialState: SessionsState = {
  sessionId: null,
  sessions: {},
}

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    startNewSession: () => {},
    sessionCreated: (state, { payload: sessionId }: PayloadAction<string>) => {
      state.sessionId = sessionId
      state.sessions[sessionId] = {}
    },
    receiveMessage: (
      state,
      action: PayloadAction<{ type: MessageType; payload: AnyMessage }>,
    ) => {
      const { type, payload } = action.payload
      if (!state.sessionId) {
        return
      }
      const session = state.sessions[state.sessionId]
      if (!session[type]) {
        session[type] = [payload] as AnyMessage[]
      } else {
        (session[type] as AnyMessage[]).push(payload)
      }
    },
    sendAnswer: (_, _action: PayloadAction<string>) => {},
  },
})

export const { startNewSession, sessionCreated, receiveMessage, sendAnswer } =
  sessionsSlice.actions
export const sessionsReducer = sessionsSlice.reducer
