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
    const { models }: { models: [string, string] } = req.body
    const id = crypto.randomUUID()
    const agents: Record<string, any> = {}
    for (const modelName of models) {
      agents[modelName] = newAgent()
    }
    sessions.set(id, agents)
    res.json({ id, models })
  })

  return app
}
