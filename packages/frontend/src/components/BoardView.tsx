import * as Board from "@battleship/core/board"
import * as Coords from "@battleship/core/coords"
import React from "react"
import { useSelector } from "react-redux"
import styled from "styled-components"
import type { RootState } from "../store"

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

const cellColors: Record<Board.CellStatus, string> = {
  [Board.CellStatus.EMPTY]: "#e8e8e8",
  [Board.CellStatus.SHIP]: "#4a90d9",
  [Board.CellStatus.HIT]: "#e74c3c",
  [Board.CellStatus.MISS]: "#95a5a6",
  [Board.CellStatus.UNKNOWN]: "#f0f0f0",
}

const Cell = styled.div<{ $status: Board.CellStatus }>`
    width: 28px;
    height: 28px;
    background: ${(p) => cellColors[p.$status]};
    border-radius: 3px;
`

export const BoardView = () => {
  const board = useSelector((state: RootState) => state.game.board)
  if (!board) {
    return null
  }

  const { size, cells } = board
  const cols = Array.from({ length: size }, (_, i) => Coords.indexToLabel(i))

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
              <Cell
                key={`${col}${row}`}
                $status={cell?.status ?? Board.CellStatus.UNKNOWN}
              />
            )
          })}
        </React.Fragment>
      ))}
    </Grid>
  )
}
