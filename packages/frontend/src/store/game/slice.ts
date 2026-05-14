import { MessageType, type MessageValue } from "@battleship/core"
import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

export type ModelMessage = { [T in MessageType]: MessageValue[T] }[MessageType]

export type ModelData = { [T in MessageType]?: ModelMessage[] }

export type SessionData = Record<string, ModelData>

type SessionsState = {
  id: string | null
  model: string | null
  startedAt: number | null
  data: Record<string, SessionData>
}

const initialState: SessionsState = {
  id: null,
  model: null,
  startedAt: null,
  data: {},
}

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    startNewSession: (state, { payload: { id, model, startedAt } }: PayloadAction<{ id: string; model: string; startedAt: number }>) => {
      state.id = id
      state.model = model
      state.startedAt = startedAt
      state.data[id] = {}
    },
    receiveMessage: (
      state,
      { payload: { model, type, payload } }: PayloadAction<{ model: string; type: MessageType; payload: ModelMessage }>,
    ) => {
      if (!state.id) {
        return
      }

      const data = state.data[state.id]
      if (!data[model]) {
        data[model] = {}
      }
      const modelData = data[model]
      if (!modelData[type]) {
        modelData[type] = [payload] as ModelMessage[]
      } else {
        (modelData[type] as ModelMessage[]).push(payload)
      }
    },
    sendAnswer: (_, _action: PayloadAction<{ model: string; answer: string }>) => { },
  },
})

export const { startNewSession, receiveMessage, sendAnswer } =
  sessionsSlice.actions
export const sessionsReducer = sessionsSlice.reducer
