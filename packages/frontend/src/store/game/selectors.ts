import { MessageType, type MessageValue } from "@battleship/core"
import * as Board from "@battleship/core/board"
import { createSelector } from "reselect"
import type { RootState } from "../index"
import type { ModelData, ModelMessage } from "./slice"

export const selectId = (state: RootState) => state.sessions.id
export const selectData = (state: RootState) => state.sessions.data
export const selectModel = (state: RootState) => state.sessions.model
export const selectStartedAt = (state: RootState) => state.sessions.startedAt

const selectAgentSession = createSelector([selectId, selectModel, selectData], (id, model, data): ModelData => {
  if (!id || !model || !data) return {}
  return data[id]?.agents[model] ?? {}
})

export const selectUserBoard = createSelector([selectId, selectData], (id, data): Board.Board => {
  if (!id || !data[id]) return Board.init()
  return data[id].user.board
})

export const selectUserTargetBoard = createSelector([selectId, selectData], (id, data): Board.Board => {
  if (!id || !data[id]) return Board.init(Board.DEFAULT_BOARD_SIZE, Board.CellStatus.UNKNOWN)
  return data[id].user.targetBoard
})

export const selectAgentBoard = createSelector(
  selectAgentSession,
  (data): MessageValue[MessageType.BOARD] => {
    const boards = data[MessageType.BOARD]
    const last = boards?.[boards.length - 1] as MessageValue[MessageType.BOARD] | undefined
    return last ?? Board.init()
  },
)

export const selectAgentTargetBoard = createSelector(
  selectAgentSession,
  (data): Board.Board => {
    const boards = data[MessageType.TARGET_BOARD]
    const last = boards?.[boards.length - 1] as Board.Board | undefined
    return last ?? Board.init(Board.DEFAULT_BOARD_SIZE, Board.CellStatus.UNKNOWN)
  },
)

export const selectTotalTokens = createSelector(selectAgentSession, (session): number => {
  const tokens = session[MessageType.TOKENS] as MessageValue[MessageType.TOKENS][] | undefined
  return tokens ? tokens.reduce((sum, n) => sum + n, 0) : 0
})

export const selectAgentMessages = createSelector(
  selectAgentSession,
  (session): MessageValue[MessageType.AGENT][] => {
    const messages = session[MessageType.AGENT]
    return messages ? (messages as ModelMessage[] as MessageValue[MessageType.AGENT][]) : []
  },
)

export const selectHistory = createSelector(selectAgentSession, (session): string[] => {
  const history = session[MessageType.HISTORY]
  return history ? (history[history.length - 1] as string[]) : []
})

export const selectLlmCalls = createSelector(selectAgentSession, (session): number => {
  const calls = session[MessageType.LLM_CALLS]
  return calls ? (calls[calls.length - 1] as number) : 0
})

export const selectStrategy = createSelector(selectAgentSession, (session): string => {
  const strategy = session[MessageType.STRATEGY]
  return strategy ? (strategy[strategy.length - 1] as string) : ""
})

export const selectAgentReady = createSelector(selectAgentSession, (session): boolean => {
  return !!session[MessageType.READY]?.length
})
