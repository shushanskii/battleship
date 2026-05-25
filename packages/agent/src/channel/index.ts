import { INTERRUPT, Command } from "@langchain/langgraph"
import { InterruptType, MessageType, type Interrupt, type MessageValue } from "@battleship/core"

export type Send = <T extends MessageType>(type: T, payload: MessageValue[T]) => void

export const runStream = async (
  agent: any,
  id: string,
  modelName: string,
  send: Send,
  resume?: unknown,
) => {
  const input = resume !== undefined ? new Command({ resume }) : {}

  for await (const [mode, chunk] of await agent
    .withConfig({
      configurable: { thread_id: id, modelName },
      recursionLimit: 100,
    })
    .stream(input, {
      streamMode: ["messages", "updates", "values", "custom"],
    })) {
    if (mode === "messages") {
      const [message] = chunk
      if (message.response_metadata?.usage?.total_tokens) {
        send(MessageType.TOKENS, message.response_metadata.usage.total_tokens)
      }
    }

    if (mode === "updates") {
      if (chunk[INTERRUPT]) {
        for (const interrupt of chunk[INTERRUPT]) {
          if (interrupt.id == null) { continue }
          const value = interrupt.value as Interrupt
          if (value.type === InterruptType.READY) {
            send(MessageType.READY, null)
          } else if (value.type === InterruptType.SHOT) {
            send(MessageType.SHOOT, { coordinate: value.payload.coordinate })
          } else {
            send(MessageType.QUESTION, interrupt.value)
          }
        }
      }
    }

    if (mode === "values") {
      if (chunk.board != null) {
        send(MessageType.BOARD, chunk.board)
      }
      if (chunk.history?.length > 0) {
        send(MessageType.HISTORY, chunk.history)
      }
      if (chunk.llmCalls != null) {
        send(MessageType.LLM_CALLS, chunk.llmCalls)
      }
      if (chunk.strategy) {
        send(MessageType.STRATEGY, chunk.strategy)
      }
    }

    if (mode === "custom") {
      if (chunk.agent) {
        send(MessageType.AGENT, { text: chunk.agent, ts: Date.now() })
      }
      if (chunk.shot) {
        send(MessageType.SHOOT, chunk.shot)
      }
    }
  }
}
