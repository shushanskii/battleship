import Database from 'better-sqlite3'
import path from 'path'

const db = new Database(path.join(__dirname, '../../game.db'))

db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id         TEXT    PRIMARY KEY,
    phase      TEXT    NOT NULL DEFAULT 'waiting',
    created_at INTEGER NOT NULL
  )
`)

export default db
