import { indexToLabel } from "./coords"
import { coords, type Ship } from "./ship"

export const DEFAULT_BOARD_SIZE = 10

export enum CellStatus {
  EMPTY = "EMPTY",
  SHIP = "SHIP",
  HIT = "HIT",
  MISS = "MISS",
  UNKNOWN = "UNKNOWN",
}

const CellSymbol: Record<CellStatus, string> = {
  [CellStatus.EMPTY]: " ",
  [CellStatus.SHIP]: "S",
  [CellStatus.HIT]: "X",
  [CellStatus.MISS]: ".",
  [CellStatus.UNKNOWN]: "?",
}

export type Cell = {
  index: string
  x: number
  y: number
  status: CellStatus
}

export type Board = {
  size: number
  cells: Record<string, Cell>
}

export const init = (size: number = DEFAULT_BOARD_SIZE, status: CellStatus = CellStatus.EMPTY): Board => {
  const cells: Record<string, Cell> = {}
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const index = `${indexToLabel(x)}${y + 1}`
      cells[index] = { index, x, y, status }
    }
  }
  return { size, cells }
}

export const get = (board: Board, index: string): Cell | undefined =>
  board.cells[index]

export const at = (board: Board, x: number, y: number): Cell | undefined =>
  board.cells[`${indexToLabel(x)}${y + 1}`]

export const setStatus = (
  board: Board,
  index: string,
  status: CellStatus,
): void => {
  if (board.cells[index]) {
    board.cells[index].status = status
  }
}

export const clone = (board: Board): Board => ({
  size: board.size,
  cells: Object.fromEntries(
    Object.entries(board.cells).map(([k, v]) => [k, { ...v }]),
  ),
})

const neighborsOf = (board: Board, cell: Cell): Cell[] => {
  const result: Cell[] = []
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (!dx && !dy) {
        continue
      }
      const neighbor = at(board, cell.x + dx, cell.y + dy)
      if (neighbor) {
        result.push(neighbor)
      }
    }
  }
  return result
}

export const canPlace = (board: Board, ship: Ship): boolean => {
  const cells = coords(ship).map((index) => get(board, index))
  if (cells.some((cell) => !cell || cell.status === CellStatus.SHIP)) {
    return false
  }
  const forbidden = cells.flatMap((cell) => neighborsOf(board, cell!))
  return forbidden.every((cell) => cell.status !== CellStatus.SHIP)
}

export const addShip = (board: Board, ship: Ship): Board => {
  if (!canPlace(board, ship)) {
    throw new Error(`Cannot place ship at ${ship.origin}`)
  }
  const next = clone(board)
  for (const index of coords(ship)) {
    setStatus(next, index, CellStatus.SHIP)
  }
  return next
}

export const print = (board: Board, ships: Ship[] = []): string => {
  const snapshot = clone(board)
  for (const ship of ships) {
    coords(ship).forEach((index, deckIndex) => {
      setStatus(
        snapshot,
        index,
        ship.hits.includes(deckIndex) ? CellStatus.HIT : CellStatus.SHIP,
      )
    })
  }

  const colLabels = Array.from({ length: board.size }, (_, x) =>
    indexToLabel(x),
  )
  const cellW = Math.max(...colLabels.map((l) => l.length))
  const rowNumW = String(board.size).length

  const fmt = (s: string) => s.padStart(cellW)
  const divider = `${"-".repeat(rowNumW)}-+-${colLabels.map(() => "-".repeat(cellW)).join("-+-")}-+`
  const header = `${" ".repeat(rowNumW)} | ${colLabels.map(fmt).join(" | ")} |`

  const dataRows = Array.from({ length: board.size }, (_, y) => {
    const num = String(y + 1).padStart(rowNumW)
    const cells = colLabels.map((col) =>
      fmt(CellSymbol[snapshot.cells[`${col}${y + 1}`]?.status]),
    )
    return `${num} | ${cells.join(" | ")} |`
  })

  return [header, divider, dataRows.join(`\n${divider}\n`), divider].join("\n")
}
