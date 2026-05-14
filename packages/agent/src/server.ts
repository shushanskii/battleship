import cors from "cors"
import express from "express"
import { newAgent } from "./agent"

export const createServer = (sessions: Map<string, any>) => {
  const app = express()
  app.use(cors())
  app.use(express.json())

  app.get("/", (_req, res) => {
    res.json({ message: "OK" })
  })

  app.post("/session", (req, res) => {
    const { model }: { model: string } = req.body
    const id = crypto.randomUUID()
    const agents: Record<string, any> = {}
    agents[model] = newAgent()
    sessions.set(id, agents)
    res.json({ id, model })
  })

  return app
}
