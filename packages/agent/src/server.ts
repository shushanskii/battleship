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

  app.post("/session", (_req, res) => {
    const id = crypto.randomUUID()
    sessions.set(id, newAgent())
    res.json({ id })
  })

  return app
}
