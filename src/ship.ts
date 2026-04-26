export enum ShipDirection {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

const indexToLabel = (n: number): string => {
  if (n < 26) return String.fromCharCode(65 + n)
  return indexToLabel(Math.floor((n - 26) / 26)) + String.fromCharCode(65 + (n - 26) % 26)
}

const labelToIndex = (label: string): number => {
  let result = 0
  for (let i = 0; i < label.length; i++)
    result = result * 26 + (label.charCodeAt(i) - 65 + 1)
  return result - 1
}

const parseCoord = (coord: string): { col: number; row: number } => {
  const match = coord.match(/^([A-Z]+)(\d+)$/)!
  return { col: labelToIndex(match[1]), row: parseInt(match[2]) - 1 }
}

export class Ship {
  readonly hits = new Set<number>()

  constructor(
    readonly origin: string,
    readonly direction: ShipDirection,
    readonly length: number,
  ) {}

  coords(): string[] {
    const { col, row } = parseCoord(this.origin)
    return Array.from({ length: this.length }, (_, i) =>
      this.direction === ShipDirection.HORIZONTAL
        ? `${indexToLabel(col + i)}${row + 1}`
        : `${indexToLabel(col)}${row + i + 1}`
    )
  }

  hit(deckIndex: number): void {
    this.hits.add(deckIndex)
  }

  isSunk(): boolean {
    return this.hits.size >= this.length
  }
}
