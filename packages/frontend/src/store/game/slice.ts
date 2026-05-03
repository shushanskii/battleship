import { MessageType, type MessageValue } from "@battleship/core"
import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

export type ModelMessage = { [T in MessageType]: MessageValue[T] }[MessageType]

type ModelData = { [T in MessageType]?: ModelMessage[] }

type SessionData = Record<string, ModelData>

type SessionsState = {
  sessionId: string | null
  models: string[]
  startedAt: number | null
  sessions: Record<string, SessionData>
}

const initialState: SessionsState = {
  sessionId: null,
  models: [],
  startedAt: null,
  sessions: {},
}

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    startNewSession: (_state, _action: PayloadAction<{ models: [string, string] }>) => {},
    sessionCreated: (
      state,
      { payload }: PayloadAction<{ id: string; models: string[]; startedAt: number }>,
    ) => {
      state.sessionId = payload.id
      state.models = payload.models
      state.startedAt = payload.startedAt
      state.sessions[payload.id] = {}
    },
    receiveMessage: (
      state,
      action: PayloadAction<{ model: string; type: MessageType; payload: ModelMessage }>,
    ) => {
      const { model, type, payload } = action.payload
      if (!state.sessionId) {
        return
      }
      const session = state.sessions[state.sessionId]
      if (!session[model]) {
        session[model] = {}
      }
      const modelData = session[model]
      if (!modelData[type]) {
        modelData[type] = [payload] as ModelMessage[]
      } else {
        (modelData[type] as ModelMessage[]).push(payload)
      }
    },
    sendAnswer: (_, _action: PayloadAction<{ model: string; answer: string }>) => {},
  },
})

export const { startNewSession, sessionCreated, receiveMessage, sendAnswer } =
  sessionsSlice.actions
export const sessionsReducer = sessionsSlice.reducer
