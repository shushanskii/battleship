import type { Board } from "./board"

export enum MessageType {
  TOKENS = "tokens",
  QUESTION = "question",
  BOARD = "board",
  AGENT = "agent",
}

export type MessageValue = {
  [MessageType.TOKENS]: number
  [MessageType.QUESTION]: string
  [MessageType.BOARD]: Board
  [MessageType.AGENT]: string
}

export type WireMessage = {
  [T in MessageType]: { model: string; type: T; payload: MessageValue[T] }
}[MessageType]
