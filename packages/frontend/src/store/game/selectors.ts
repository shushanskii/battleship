import { MessageType, type MessageValue } from "@battleship/core"
import * as Board from "@battleship/core/board"
import type { RootState } from "../index"

const currentSession = (state: RootState) => {
  const { sessionId, sessions } = state.sessions
  return sessionId ? (sessions[sessionId] ?? {}) : {}
}

export const selectBoard = (state: RootState): MessageValue[MessageType.BOARD] => {
  const boards = currentSession(state)[MessageType.BOARD]
  return boards ? (boards[boards.length - 1] as MessageValue[MessageType.BOARD]) : Board.init()
}

export const selectTotalTokens = (state: RootState): number => {
  const tokens = currentSession(state)[MessageType.TOKENS]
  if (!tokens) {
    return 0
  }
  return (tokens as MessageValue[MessageType.TOKENS][]).reduce((sum, n) => sum + n, 0)
}

export const selectAgentMessages = (state: RootState): MessageValue[MessageType.AGENT][] => {
  const messages = currentSession(state)[MessageType.AGENT]
  return messages ? (messages as MessageValue[MessageType.AGENT][]) : []
}
