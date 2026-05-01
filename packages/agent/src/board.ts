import { type Ship, shipCoords } from "./ship"

const SIZE = 10

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

const indexToLabel = (n: number): string => {
  if (n < 26) {
    return String.fromCharCode(65 + n)
  }
  return (
    indexToLabel(Math.floor((n - 26) / 26)) +
    String.fromCharCode(65 + ((n - 26) % 26))
  )
}

export const initBoard = (size: number = SIZE): Board => {
  const cells: Record<string, Cell> = {}
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const index = `${indexToLabel(x)}${y + 1}`
      cells[index] = { index, x, y, status: CellStatus.EMPTY }
    }
  }
  return { size, cells }
}

export const boardGet = (board: Board, index: string): Cell | undefined =>
  board.cells[index]

export const boardAt = (board: Board, x: number, y: number): Cell | undefined =>
  board.cells[`${indexToLabel(x)}${y + 1}`]

export const boardSetStatus = (
  board: Board,
  index: string,
  status: CellStatus,
): void => {
  if (board.cells[index]) {
    board.cells[index].status = status
  }
}

export const boardClone = (board: Board): Board => ({
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
      const neighbor = boardAt(board, cell.x + dx, cell.y + dy)
      if (neighbor) {
        result.push(neighbor)
      }
    }
  }
  return result
}

export const boardCanPlace = (board: Board, ship: Ship): boolean => {
  const cells = shipCoords(ship).map((index) => boardGet(board, index))
  if (cells.some((cell) => !cell || cell.status === CellStatus.SHIP)) {
    return false
  }
  const forbidden = cells.flatMap((cell) => neighborsOf(board, cell!))
  return forbidden.every((cell) => cell.status !== CellStatus.SHIP)
}

export const boardPlace = (board: Board, ship: Ship): void => {
  if (!boardCanPlace(board, ship)) {
    throw new Error(`Cannot place ship at ${ship.origin}`)
  }
  for (const index of shipCoords(ship)) {
    boardSetStatus(board, index, CellStatus.SHIP)
  }
}

export const boardPrint = (board: Board, ships: Ship[] = []): string => {
  const snapshot = boardClone(board)
  for (const ship of ships) {
    shipCoords(ship).forEach((index, deckIndex) => {
      boardSetStatus(
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
