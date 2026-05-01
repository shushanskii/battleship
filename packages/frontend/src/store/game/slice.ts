import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice, nanoid } from "@reduxjs/toolkit"

export type CellStatus = "EMPTY" | "SHIP" | "HIT" | "MISS" | "UNKNOWN"

export type Cell = {
  index: string
  x: number
  y: number
  status: CellStatus
}

export type Board = {
  size: number
  cells: Record<string, Cell>
}

export type WsMessage = { type: string; payload: unknown }

interface GameState {
  sessionId: string | null
  messages: Record<string, WsMessage>
  board: Board | null
  tokens: number
}

const initialState: GameState = {
  sessionId: null,
  messages: {},
  board: null,
  tokens: 0,
}

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startNewGame: () => {},
    sessionCreated: (
      _state,
      { payload: sessionId }: PayloadAction<string>,
    ) => ({
      ...initialState,
      sessionId,
    }),
    receiveMessage: (
      state,
      action: PayloadAction<{ id: string; message: WsMessage }>,
    ) => {
      const { message } = action.payload
      state.messages[action.payload.id] = message
      if (message.type === "board") {
        state.board = message.payload as Board
      } else if (message.type === "tokens") {
        state.tokens += message.payload as number
      }
    },
    sendAnswer: (_, _action: PayloadAction<string>) => {},
  },
})

export const { startNewGame, sessionCreated, receiveMessage, sendAnswer } =
  gameSlice.actions
export const gameReducer = gameSlice.reducer
export { nanoid }
