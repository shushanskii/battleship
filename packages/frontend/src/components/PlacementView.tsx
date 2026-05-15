import * as Board from "@battleship/core/board"
import * as Coords from "@battleship/core/coords"
import * as Ship from "@battleship/core/ship"
import { ShipDirection } from "@battleship/core/ship"
import React, { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { placeShipCommand } from "../store/commands/placement"
import { selectUserBoard } from "../store/game/selectors"

const FLEET = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]

const Wrapper = styled.div`
  display: flex;
  gap: 16px;
`

const FleetPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 28px;
`

const RotateButton = styled.button`
  font-family: monospace;
  font-size: 11px;
  padding: 4px 8px;
  cursor: pointer;
  border: 1px solid #999;
  background: #fff;
  border-radius: 3px;
  &:hover { background: #f0f0f0; }
`

const ShipBlock = styled.div<{ $length: number; $direction: ShipDirection }>`
  display: grid;
  grid-template-columns: ${(p) =>
    p.$direction === ShipDirection.HORIZONTAL ? `repeat(${p.$length}, 20px)` : "20px"};
  grid-template-rows: ${(p) =>
    p.$direction === ShipDirection.VERTICAL ? `repeat(${p.$length}, 20px)` : "20px"};
  gap: 1px;
  cursor: grab;
  &:active { cursor: grabbing; }
`

const ShipCell = styled.div`
  width: 20px;
  height: 20px;
  background: #4a90d9;
  border-radius: 2px;
`

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

type CellVariant = "empty" | "ship" | "preview-valid" | "preview-invalid"

const cellBg: Record<CellVariant, string> = {
  empty: "#e8e8e8",
  ship: "#4a90d9",
  "preview-valid": "#2ecc71",
  "preview-invalid": "#e74c3c",
}

const GridCell = styled.div<{ $variant: CellVariant }>`
  width: 28px;
  height: 28px;
  background: ${(p) => cellBg[p.$variant]};
  border-radius: 3px;
`

const ReadyLabel = styled.div`
  font-family: monospace;
  font-size: 11px;
  color: #2a9d2a;
  margin-top: 4px;
`

export const PlacementView = () => {
  const dispatch = useDispatch()
  const board = useSelector(selectUserBoard)
  const [pending, setPending] = useState<number[]>(FLEET)
  const [dragging, setDragging] = useState<{ length: number; direction: ShipDirection } | null>(null)
  const [hoverCell, setHoverCell] = useState<string | null>(null)
  const [direction, setDirection] = useState<ShipDirection>(ShipDirection.HORIZONTAL)

  const previewShip = useMemo(() => {
    if (!dragging || !hoverCell) return null
    return Ship.init(hoverCell, dragging.direction, dragging.length)
  }, [dragging, hoverCell])

  const previewCells = useMemo(
    () => (previewShip ? new Set(Ship.coords(previewShip)) : new Set<string>()),
    [previewShip],
  )

  const canPlacePreview = useMemo(
    () => (previewShip ? Board.canPlace(board, previewShip) : false),
    [board, previewShip],
  )

  const getCellVariant = (index: string): CellVariant => {
    if (previewCells.has(index)) return canPlacePreview ? "preview-valid" : "preview-invalid"
    return board.cells[index]?.status === Board.CellStatus.SHIP ? "ship" : "empty"
  }

  const handleDragStart = (length: number) => {
    setDragging({ length, direction })
  }

  const handleDragOver = (e: React.DragEvent, index: string) => {
    e.preventDefault()
    setHoverCell(index)
  }

  const handleDrop = (e: React.DragEvent, index: string) => {
    e.preventDefault()
    if (!dragging) return
    const ship = Ship.init(index, dragging.direction, dragging.length)
    if (!Board.canPlace(board, ship)) return
    dispatch(placeShipCommand(ship))
    setPending((prev) => {
      const i = prev.indexOf(dragging.length)
      return [...prev.slice(0, i), ...prev.slice(i + 1)]
    })
    setDragging(null)
    setHoverCell(null)
  }

  const handleDragEnd = () => {
    setDragging(null)
    setHoverCell(null)
  }

  const { size } = board
  const cols = Array.from({ length: size }, (_, i) => Coords.indexToLabel(i))

  return (
    <Wrapper>
      <FleetPanel>
        <RotateButton
          onClick={() =>
            setDirection((d) =>
              d === ShipDirection.HORIZONTAL ? ShipDirection.VERTICAL : ShipDirection.HORIZONTAL,
            )
          }
        >
          {direction === ShipDirection.HORIZONTAL ? "→ H" : "↓ V"}
        </RotateButton>
        {pending.map((length, i) => (
          <ShipBlock
            key={i}
            draggable
            onDragStart={() => handleDragStart(length)}
            onDragEnd={handleDragEnd}
            $length={length}
            $direction={direction}
          >
            {Array.from({ length }).map((_, j) => (
              <ShipCell key={j} />
            ))}
          </ShipBlock>
        ))}
        {pending.length === 0 && <ReadyLabel>fleet ready</ReadyLabel>}
      </FleetPanel>
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
              const index = `${col}${row}`
              return (
                <GridCell
                  key={index}
                  $variant={getCellVariant(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                />
              )
            })}
          </React.Fragment>
        ))}
      </Grid>
    </Wrapper>
  )
}
