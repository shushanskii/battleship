import { createServer } from "./server"
import { setupChannel } from "./channel"

const sessions = new Map<string, any>()

setupChannel(sessions)

const app = createServer(sessions)
app.listen(3001, "0.0.0.0", () => console.log("ready"))
