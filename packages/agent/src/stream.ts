import { INTERRUPT } from "@langchain/langgraph"
import { MessageType } from "@battleship/core"
import { type SendMessage } from "./websocket"

export const runStream = async (
  agent: any,
  id: string,
  input: any = {},
  sendMessage: SendMessage,
) => {
  for await (const [mode, chunk] of await agent
    .withConfig({
      configurable: { thread_id: id },
      recursionLimit: 100,
    })
    .stream(input, {
      streamMode: ["messages", "updates", "values", "custom"],
    })) {
    if (mode === "messages") {
      const [message] = chunk

      if (message.response_metadata?.usage?.total_tokens) {
        sendMessage(id, MessageType.TOKENS, message.response_metadata.usage.total_tokens)
      }

      // if (message.additional_kwargs?.reasoning_content) {
      //   thinking += message.additional_kwargs.reasoning_content;
      // }
    }

    if (mode === "updates") {
      if (chunk[INTERRUPT]) {
        for (const i of chunk[INTERRUPT]) {
          if (i.id != null) {
            sendMessage(id, MessageType.QUESTION, i.value)
          }
        }
      }
    }

    if (mode === "values") {
      sendMessage(id, MessageType.BOARD, chunk.board)
    }

    if (mode === "custom") {
      sendMessage(id, MessageType.AGENT, chunk.agent)
    }
  }
}
