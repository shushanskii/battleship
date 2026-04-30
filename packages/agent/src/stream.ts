import { INTERRUPT } from "@langchain/langgraph";

type SendMessage = (id: string, type: string, message: unknown) => void;

export const runStream = async (
    agent: any,
    id: string,
    input: any = {},
    sendMessage: SendMessage,
) => {
    for await (const [mode, chunk] of await agent
        .withConfig({
            configurable: { thread_id: id },
        })
        .stream(input, {
            streamMode: ["messages", "updates", "values", "custom"],
        })) {
        if (mode === "messages") {
            const [message] = chunk;

            if (message.response_metadata?.usage?.total_tokens) {
                sendMessage(id, "tokens", message.response_metadata.usage.total_tokens);
            }

            // if (message.additional_kwargs?.reasoning_content) {
            //     thinking += message.additional_kwargs.reasoning_content;
            // }
        }

        if (mode === "updates") {
            if (chunk[INTERRUPT]) {
                for (const i of chunk[INTERRUPT]) {
                    if (i.id != null) {
                        sendMessage(id, "question", i.value);
                    }
                }
            }
        }

        if (mode === "values") {
            sendMessage(id, "board", chunk.board);
        }
    }
};
