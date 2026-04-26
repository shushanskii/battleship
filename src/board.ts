import { Ship } from './ship'

const SIZE = 10

export type Cell = {
  index: string
  x: number
  y: number
  status: CellStatus
}

enum CellStatus {
  EMPTY = 'EMPTY',
  SHIP = 'SHIP',
  HIT = 'HIT',
  MISS = 'MISS',
  UNKNOWN = 'UNKNOWN',
}

const CellSymbol: Record<CellStatus, string> = {
  [CellStatus.EMPTY]: ' ',
  [CellStatus.SHIP]: 'S',
  [CellStatus.HIT]: 'X',
  [CellStatus.MISS]: '.',
  [CellStatus.UNKNOWN]: '?',
}

export class Board {
  private byIndex = new Map<string, Cell>()
  private byCoord: Cell[][] = []

  constructor(private size: number = SIZE) {
    for (let x = 0; x < size; x++) {
      this.byCoord[x] = []
      for (let y = 0; y < size; y++) {
        const cell: Cell = { index: `${Board.indexToLabel(x)}${y + 1}`, x, y, status: CellStatus.EMPTY }
        this.byIndex.set(cell.index, cell)
        this.byCoord[x][y] = cell
      }
    }
  }

  // ─── Coordinate helper ────────────────────────────────────────────────────────

  private static indexToLabel(n: number): string {
    if (n < 26) return String.fromCharCode(65 + n)
    return Board.indexToLabel(Math.floor((n - 26) / 26)) + String.fromCharCode(65 + (n - 26) % 26)
  }

  // ─── Getters ──────────────────────────────────────────────────────────────────

  get(index: string): Cell | undefined {
    return this.byIndex.get(index)
  }

  at(x: number, y: number): Cell | undefined {
    return this.byCoord[x]?.[y]
  }

  cells(): IterableIterator<Cell> {
    return this.byIndex.values()
  }

  // ─── Setter ───────────────────────────────────────────────────────────────────

  setStatus(index: string, status: CellStatus): void {
    const cell = this.byIndex.get(index)
    if (cell) cell.status = status
  }

  // ─── Placement ────────────────────────────────────────────────────────────────

  private neighborsOf(cell: Cell): Cell[] {
    const result: Cell[] = []
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++) {
        if (!dx && !dy) continue
        const neighbor = this.at(cell.x + dx, cell.y + dy)
        if (neighbor) result.push(neighbor)
      }
    return result
  }

  canPlace(ship: Ship): boolean {
    const cells = ship.coords().map(index => this.get(index))
    if (cells.some(cell => !cell || cell.status === CellStatus.SHIP)) return false
    const forbidden = cells.flatMap(cell => this.neighborsOf(cell!))
    return forbidden.every(cell => cell.status !== CellStatus.SHIP)
  }

  place(ship: Ship): void {
    if (!this.canPlace(ship)) throw new Error(`Cannot place ship at ${ship.origin}`)
    ship.coords().forEach(index => this.setStatus(index, CellStatus.SHIP))
  }

  clone(): Board {
    const copy = new Board(this.size)
    for (const cell of this.byIndex.values())
      copy.setStatus(cell.index, cell.status)
    return copy
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  print(ships?: Ship[]): string {
    const snapshot = this.clone()
    for (const ship of ships ?? []) {
      ship.coords().forEach((index, deckIndex) => {
        snapshot.setStatus(index, ship.hits.has(deckIndex) ? CellStatus.HIT : CellStatus.SHIP)
      })
    }

    const colLabels = Array.from({ length: this.size }, (_, x) => Board.indexToLabel(x))
    const cellW = Math.max(...colLabels.map(l => l.length))
    const rowNumW = String(this.size).length

    const fmt = (s: string) => s.padStart(cellW)
    const divider = `${'-'.repeat(rowNumW)}-+-${colLabels.map(() => '-'.repeat(cellW)).join('-+-')}-+`
    const header = `${' '.repeat(rowNumW)} | ${colLabels.map(fmt).join(' | ')} |`

    const dataRows = Array.from({ length: this.size }, (_, y) => {
      const num = String(y + 1).padStart(rowNumW)
      const cells = colLabels.map(col => fmt(CellSymbol[snapshot.get(`${col}${y + 1}`)!.status]))
      return `${num} | ${cells.join(' | ')} |`
    })

    return [header, divider, dataRows.join(`\n${divider}\n`), divider].join('\n')
  }
}
