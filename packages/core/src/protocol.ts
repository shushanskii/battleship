import type { Board } from "./board"

export enum MessageType {
  TOKENS = "tokens",
  QUESTION = "question",
  BOARD = "board",
  AGENT = "agent",
  HISTORY = "history",
  LLM_CALLS = "llmCalls",
  STRATEGY = "strategy",
  READY = "ready",
  TARGET_BOARD = "targetBoard",
  SHOOT = "shoot",
}

export type MessageValue = {
  [MessageType.TOKENS]: number
  [MessageType.QUESTION]: string
  [MessageType.BOARD]: Board
  [MessageType.AGENT]: { text: string; ts: number }
  [MessageType.HISTORY]: string[]
  [MessageType.LLM_CALLS]: number
  [MessageType.STRATEGY]: string
  [MessageType.READY]: null
  [MessageType.TARGET_BOARD]: Board
  [MessageType.SHOOT]: { coordinate: string; hit?: boolean }
}

export type WireMessage = {
  [T in MessageType]: { type: T; payload: MessageValue[T] }
}[MessageType]

// ── Graph → channel.ts (via interrupt()) ────────────────────────────────────

export enum InterruptType {
  READY = "ready",     // placement done OR turn cycle complete
  SHOT = "shot",       // LLM chose a coordinate to fire at
  WAITING = "waiting", // defender parked until opponent's shot is resolved
}

export type InterruptPayload = {
  [InterruptType.READY]: null
  [InterruptType.SHOT]: { coordinate: string }
  [InterruptType.WAITING]: null
}

export type Interrupt = {
  [T in InterruptType]: { type: T; payload: InterruptPayload[T] }
}[InterruptType]

// ── channel.ts → graph (via Command({ resume: value })) ─────────────────────

export enum TurnRole {
  MINE = "mine",
  THEIRS = "theirs",
}

export enum ResumeType {
  TURN = "turn",              // assigns turn role after "ready"
  SHOT_RESULT = "shotResult", // shot result after "shot"
  ATTACKED = "attacked",      // incoming attack after "waiting"
}

export type ResumePayload = {
  [ResumeType.TURN]: { turn: TurnRole }
  [ResumeType.SHOT_RESULT]: { hit: boolean; sunk: boolean }
  [ResumeType.ATTACKED]: { coordinate: string; hit: boolean }
}

export type Resume = {
  [T in ResumeType]: { type: T; payload: ResumePayload[T] }
}[ResumeType]
