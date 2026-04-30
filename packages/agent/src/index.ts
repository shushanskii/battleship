import { createServer } from "./server";
import { setupWebSocket } from "./websocket";

const sessions = new Map<string, any>();

setupWebSocket(sessions);

const app = createServer(sessions);
app.listen(3001, "0.0.0.0", () => console.log("ready"));
