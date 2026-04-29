import { WebSocketServer, WebSocket } from "ws";
import { Command } from "@langchain/langgraph";
import { runStream } from "./stream";

const wss = new WebSocketServer({ host: '0.0.0.0', port: 3002 });

const connections = new Map<string, WebSocket>();

export const sendMessage = (id: string, type: string, message: unknown) => {
    const ws = connections.get(id);
    if (!ws || ws.readyState !== 1) return;

    ws.send(JSON.stringify({ type, payload: message }));
};

export const setupWebSocket = (sessions: Map<string, any>) => {
    wss.on("connection", (ws, req) => {
        const url = new URL(req.url!, "http://localhost");
        const id = url.searchParams.get("id");

        if (!id) {
            ws.close();
            return;
        }

        const agent = sessions.get(id);
        if (!agent) {
            ws.close();
            return;
        }

        connections.set(id, ws);

        runStream(agent, id, {}, sendMessage);

        ws.on('message', (raw: Buffer) => {
            try {
                const { type, payload } = JSON.parse(raw.toString());
                if (type === 'answer') {
                    runStream(agent, id, new Command({ resume: payload }), sendMessage);
                }
            } catch (e) {
                console.error(`[${id}] invalid message:`, raw.toString());
            }
        });

        ws.on("close", () => {
            connections.delete(id);
        });
    });
};
