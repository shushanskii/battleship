import express from 'express';
import { WebSocketServer, WebSocket } from "ws";
import { newAgent, runStream } from './agent';


const app = express();
const PORT = 3001;
const HOST = '0.0.0.0';

const wss = new WebSocketServer({ host: '0.0.0.0', port: 3002 });

const connections = new Map<string, any>();

const sessions = new Map<string, any>();

export const sendMessage = (id: string, type: string, message: unknown) => {
  const ws = connections.get(id);
  if (!ws || ws.readyState !== 1) {
    return;
  }

  ws.send(
    JSON.stringify({
      type,
      payload: message,
    })
  );
};

export const setupWebSocket = () => {
  wss.on("connection", (ws, req) => {
    const url = new URL(req.url!, "http://localhost");
    const id = url.searchParams.get("id");

    if (!id) {
      ws.close();
      return;
    }

    connections.set(id, ws)

    const agent = sessions.get(id)

    if (!agent) {
      ws.close();
      return;
    }

    runStream(agent, id)

    ws.on('message', (raw: Buffer) => {
      try {
        const { type, payload } = JSON.parse(raw.toString());
        console.log(`[${id}] type=${type}`, payload);
      } catch (e) {
        console.error(`[${id}] invalid message:`, raw.toString());
      }
    });

    ws.on("close", () => {
      connections.delete(id);
    });
  });
};


setupWebSocket()

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'OK' });
});

app.post("/session", (req, res) => {
  const id = crypto.randomUUID();

  sessions.set(id, newAgent())

  res.json({ id });
});

app.listen(PORT, HOST, () => {
  console.log('ready');
});
