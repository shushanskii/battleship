import { INTERRUPT } from "@langchain/langgraph"
import { MessageType, type MessageValue } from "@battleship/core"
import { sendMessage } from "./websocket"

type BoundSendMessage = <T extends MessageType>(
  id: string,
  type: T,
  payload: MessageValue[T],
) => void

const runStream = async (
  agent: any,
  id: string,
  modelName: string,
  input: any,
  boundSendMessage: BoundSendMessage,
) => {
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
        boundSendMessage(id, MessageType.TOKENS, message.response_metadata.usage.total_tokens)
      }
    }

    if (mode === "updates") {
      if (chunk[INTERRUPT]) {
        for (const i of chunk[INTERRUPT]) {
          if (i.id != null) {
            boundSendMessage(id, MessageType.QUESTION, i.value)
          }
        }
      }
    }

    if (mode === "values") {
      boundSendMessage(id, MessageType.BOARD, chunk.board)
      if (chunk.history?.length > 0) {
        boundSendMessage(id, MessageType.HISTORY, chunk.history)
      }
      if (chunk.llmCalls != null) {
        boundSendMessage(id, MessageType.LLM_CALLS, chunk.llmCalls)
      }
      if (chunk.strategy) {
        boundSendMessage(id, MessageType.STRATEGY, chunk.strategy)
      }
    }

    if (mode === "custom") {
      boundSendMessage(id, MessageType.AGENT, chunk.agent)
    }
  }
}

export const createStream = (modelName: string) => {
  const boundSendMessage: BoundSendMessage = (id, type, payload) =>
    sendMessage(id, modelName, type, payload)

  return {
    stream: (agent: any, id: string, input: any = {}) =>
      runStream(agent, id, modelName, input, boundSendMessage),
    sendMessage: boundSendMessage,
  }
}
