import { MessageType, type MessageValue } from "@battleship/core"
import * as Board from "@battleship/core/board"
import * as Ship from "@battleship/core/ship"
import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

export type ModelMessage = { [T in MessageType]: MessageValue[T] }[MessageType]

export type ModelData = { [T in MessageType]?: ModelMessage[] }

export type UserData = {
  board: Board.Board
  targetBoard: Board.Board
}

export type SessionData = {
  agents: Record<string, ModelData>
  user: UserData
}

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
      state.data[id] = { agents: {}, user: { board: Board.init(), targetBoard: Board.init(Board.DEFAULT_BOARD_SIZE, Board.CellStatus.UNKNOWN) } }
    },
    receiveMessage: (
      state,
      { payload: { model, type, payload } }: PayloadAction<{ model: string; type: MessageType; payload: ModelMessage }>,
    ) => {
      if (!state.id) return
      const { agents } = state.data[state.id]
      if (!agents[model]) {
        agents[model] = {}
      }
      const modelData = agents[model]
      if (!modelData[type]) {
        modelData[type] = [payload] as ModelMessage[]
      } else {
        (modelData[type] as ModelMessage[]).push(payload)
      }
    },
    placeShip: (state, { payload }: PayloadAction<Ship.Ship>) => {
      if (!state.id) return
      const user = state.data[state.id].user
      user.board = Board.addShip(user.board, payload)
    },
    sendAnswer: (_, _action: PayloadAction<{ model: string; answer: string }>) => { },
  },
})

export const { startNewSession, receiveMessage, placeShip, sendAnswer } =
  sessionsSlice.actions
export const sessionsReducer = sessionsSlice.reducer
