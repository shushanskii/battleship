import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type WsMessage = { type: string; payload: unknown };

interface GameState {
  sessionId: string | null;
  messages: Record<string, WsMessage>;
}

const initialState: GameState = {
  sessionId: null,
  messages: {},
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startNewGame: () => {},
    sessionCreated: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
      state.messages = {};
    },
    receiveMessage: (state, action: PayloadAction<{ id: string; message: WsMessage }>) => {
      state.messages[action.payload.id] = action.payload.message;
    },
    sendAnswer: (_, _action: PayloadAction<string>) => {},
  },
});

export const { startNewGame, sessionCreated, receiveMessage, sendAnswer } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;
export { nanoid };
