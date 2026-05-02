import { MessageType, type MessageValue } from "@battleship/core"
import * as Board from "@battleship/core/board"
import { createSelector } from "reselect"
import type { RootState } from "../index"
import type { ModelMessage } from "./slice"

const selectCurrentSession = (state: RootState) => {
  const { sessionId, sessions } = state.sessions
  return sessionId ? (sessions[sessionId] ?? {}) : {}
}

export const selectModels = (state: RootState) => state.sessions.models
export const selectStartedAt = (state: RootState) => state.sessions.startedAt

const makeSelectorCache = <T>(
  factory: (modelName: string) => (state: RootState) => T,
): ((modelName: string) => (state: RootState) => T) => {
  const cache = new Map<string, (state: RootState) => T>()
  return (modelName) => {
    if (!cache.has(modelName)) {
      cache.set(modelName, factory(modelName))
    }
    return cache.get(modelName)!
  }
}

export const selectBoard = makeSelectorCache((modelName) =>
  createSelector(
    selectCurrentSession,
    (session): MessageValue[MessageType.BOARD] => {
      const boards = (session[modelName] ?? {})[MessageType.BOARD]
      return boards
        ? (boards[boards.length - 1] as MessageValue[MessageType.BOARD])
        : Board.init()
    },
  ),
)

export const selectTotalTokens = makeSelectorCache((modelName) =>
  createSelector(selectCurrentSession, (session): number => {
    const tokens = (session[modelName] ?? {})[MessageType.TOKENS] as
      | MessageValue[MessageType.TOKENS][]
      | undefined
    return tokens ? tokens.reduce((sum, n) => sum + n, 0) : 0
  }),
)

export const selectAgentMessages = makeSelectorCache((modelName) =>
  createSelector(selectCurrentSession, (session): MessageValue[MessageType.AGENT][] => {
    const messages = (session[modelName] ?? {})[MessageType.AGENT]
    return messages ? (messages as ModelMessage[] as MessageValue[MessageType.AGENT][]) : []
  }),
)

export const selectHistory = makeSelectorCache((modelName) =>
  createSelector(selectCurrentSession, (session): string[] => {
    const history = (session[modelName] ?? {})[MessageType.HISTORY]
    return history ? (history[history.length - 1] as string[]) : []
  }),
)

export const selectLlmCalls = makeSelectorCache((modelName) =>
  createSelector(selectCurrentSession, (session): number => {
    const calls = (session[modelName] ?? {})[MessageType.LLM_CALLS]
    return calls ? (calls[calls.length - 1] as number) : 0
  }),
)

export const selectStrategy = makeSelectorCache((modelName) =>
  createSelector(selectCurrentSession, (session): string => {
    const strategy = (session[modelName] ?? {})[MessageType.STRATEGY]
    return strategy ? (strategy[strategy.length - 1] as string) : ""
  }),
)
