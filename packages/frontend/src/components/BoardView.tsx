import React from "react"
import { useSelector } from "react-redux"
import styled from "styled-components"
import type { RootState } from "../store"
import type { CellStatus } from "../store/game/slice"

const Grid = styled.div`
    display: grid;
    gap: 2px;
    font-family: monospace;
    font-size: 12px;
`

const HeaderCell = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #555;
    width: 28px;
    height: 24px;
`

const ALPHABET_SIZE = 26
const CHAR_CODE_A = 65

const cellColors: Record<CellStatus, string> = {
  EMPTY: "#e8e8e8",
  SHIP: "#4a90d9",
  HIT: "#e74c3c",
  MISS: "#95a5a6",
  UNKNOWN: "#f0f0f0",
}

const Cell = styled.div<{ $status: CellStatus }>`
    width: 28px;
    height: 28px;
    background: ${(p) => cellColors[p.$status]};
    border-radius: 3px;
`

const indexToLabel = (n: number): string => {
  if (n < ALPHABET_SIZE) {
    return String.fromCharCode(CHAR_CODE_A + n)
  }
  return (
    indexToLabel(Math.floor((n - ALPHABET_SIZE) / ALPHABET_SIZE)) +
    String.fromCharCode(CHAR_CODE_A + ((n - ALPHABET_SIZE) % ALPHABET_SIZE))
  )
}

export const BoardView = () => {
  const board = useSelector((state: RootState) => state.game.board)
  if (!board) {
    return null
  }

  const { size, cells } = board
  const cols = Array.from({ length: size }, (_, i) => indexToLabel(i))

  return (
    <Grid
      style={{
        gridTemplateColumns: `28px repeat(${size}, 28px)`,
        gridTemplateRows: `24px repeat(${size}, 28px)`,
      }}
    >
      <HeaderCell />
      {cols.map((col) => (
        <HeaderCell key={col}>{col}</HeaderCell>
      ))}
      {Array.from({ length: size }, (_, i) => i + 1).map((row) => (
        <React.Fragment key={row}>
          <HeaderCell>{row}</HeaderCell>
          {cols.map((col) => {
            const cell = cells[`${col}${row}`]
            return (
              <Cell key={`${col}${row}`} $status={cell?.status ?? "UNKNOWN"} />
            )
          })}
        </React.Fragment>
      ))}
    </Grid>
  )
}
