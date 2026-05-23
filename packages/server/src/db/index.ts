import Database from 'better-sqlite3'
import path from 'path'

const db = new Database(path.join(__dirname, '../../game.db'))

db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id         TEXT    PRIMARY KEY,
    created_at INTEGER NOT NULL
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    session_id TEXT    NOT NULL,
    user_id    TEXT    NOT NULL,
    board      TEXT    NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (session_id, user_id)
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS shots (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT    NOT NULL,
    user_id    TEXT    NOT NULL,
    cell_index TEXT    NOT NULL,
    created_at INTEGER NOT NULL
  )
`)

export default db
