import http from 'http'
import express from 'express'
import cors from 'cors'
import gamesRouter from './games/router'
import { setupWebSocket } from './connections'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.use('/games', gamesRouter)

const server = http.createServer(app)
setupWebSocket(server)

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Game server running on port ${PORT}`)
})
