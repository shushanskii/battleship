import * as Board from "@battleship/core/board"
import * as Coords from "@battleship/core/coords"
import React from "react"
import styled from "styled-components"

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
  [Board.CellStatus.UNKNOWN]: "#f0f0f0",
  [Board.CellStatus.HIT]: "#e74c3c",
  [Board.CellStatus.MISS]: "#95a5a6",
  [Board.CellStatus.EMPTY]: "#e8e8e8",
  [Board.CellStatus.SHIP]: "#4a90d9",
}

const Cell = styled.div<{ $status: Board.CellStatus; $clickable: boolean }>`
  width: 28px;
  height: 28px;
  background: ${(p) => cellColors[p.$status]};
  border-radius: 3px;
  cursor: ${(p) => (p.$clickable ? "crosshair" : "default")};
  &:hover {
    ${(p) => p.$clickable && "filter: brightness(0.85);"}
  }
`

type Props = {
  board: Board.Board
  onShoot?: (coordinate: string) => void
  disabled?: boolean
}

export const TargetView = ({ board, onShoot, disabled = false }: Props) => {
  const { size, cells } = board
  const cols = Array.from({ length: size }, (_, i) => Coords.indexToLabel(i))

  const handleClick = (coordinate: string) => {
    if (!onShoot || disabled) return
    const status = cells[coordinate]?.status ?? Board.CellStatus.UNKNOWN
    if (status !== Board.CellStatus.UNKNOWN) return
    onShoot(coordinate)
  }

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
            const coordinate = `${col}${row}`
            const status = cells[coordinate]?.status ?? Board.CellStatus.UNKNOWN
            const clickable = !!onShoot && !disabled && status === Board.CellStatus.UNKNOWN
            return (
              <Cell
                key={coordinate}
                $status={status}
                $clickable={clickable}
                onClick={() => handleClick(coordinate)}
              />
            )
          })}
        </React.Fragment>
      ))}
    </Grid>
  )
}
