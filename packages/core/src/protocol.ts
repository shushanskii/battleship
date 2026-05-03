import type { Board } from "./board"

export enum MessageType {
  TOKENS = "tokens",
  QUESTION = "question",
  BOARD = "board",
  AGENT = "agent",
  HISTORY = "history",
  LLM_CALLS = "llmCalls",
  STRATEGY = "strategy",
}

export type MessageValue = {
  [MessageType.TOKENS]: number
  [MessageType.QUESTION]: string
  [MessageType.BOARD]: Board
  [MessageType.AGENT]: { text: string; ts: number }
  [MessageType.HISTORY]: string[]
  [MessageType.LLM_CALLS]: number
  [MessageType.STRATEGY]: string
}

export type WireMessage = {
  [T in MessageType]: { type: T; payload: MessageValue[T] }
}[MessageType]
