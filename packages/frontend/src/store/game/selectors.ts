import { MessageType, type MessageValue } from "@battleship/core"
import * as Board from "@battleship/core/board"
import { createSelector } from "reselect"
import type { RootState } from "../index"
import type { ModelMessage, ModelData } from "./slice"


export const selectId = (state: RootState) => state.sessions.id
export const selectData = (state: RootState) => state.sessions.data
export const selectModel = (state: RootState) => state.sessions.model
export const selectStartedAt = (state: RootState) => state.sessions.startedAt

const selectCurrentSession = createSelector([selectId, selectModel, selectData,], (id, model, data): ModelData => {
  if (!id || !model || !data) {
    return {}
  }

  return data[id][model] ?? {}
})


export const selectBoard = () => createSelector(
  selectCurrentSession,
  (data): MessageValue[MessageType.BOARD] => {
    const boards = data[MessageType.BOARD]
    const last = boards?.[boards.length - 1] as MessageValue[MessageType.BOARD] | undefined
    return last ?? Board.init()
  }
)

export const selectTotalTokens = () =>
  createSelector(selectCurrentSession, (session): number => {
    const tokens = session[MessageType.TOKENS] as
      | MessageValue[MessageType.TOKENS][]
      | undefined
    return tokens ? tokens.reduce((sum, n) => sum + n, 0) : 0
  })

export const selectAgentMessages = () =>
  createSelector(selectCurrentSession, (session): MessageValue[MessageType.AGENT][] => {
    const messages = session[MessageType.AGENT]
    return messages ? (messages as ModelMessage[] as MessageValue[MessageType.AGENT][]) : []
  })

export const selectHistory = () =>
  createSelector(selectCurrentSession, (session): string[] => {
    const history = session[MessageType.HISTORY]
    return history ? (history[history.length - 1] as string[]) : []
  })

export const selectLlmCalls = () =>
  createSelector(selectCurrentSession, (session): number => {
    const calls = session[MessageType.LLM_CALLS]
    return calls ? (calls[calls.length - 1] as number) : 0
  })

export const selectStrategy = () =>
  createSelector(selectCurrentSession, (session): string => {
    const strategy = session[MessageType.STRATEGY]
    return strategy ? (strategy[strategy.length - 1] as string) : ""
  })

