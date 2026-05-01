const ALPHABET_SIZE = 26
const CHAR_CODE_A = 65

export enum ShipDirection {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

export type Ship = {
  origin: string
  direction: ShipDirection
  length: number
  hits: number[]
}

export const indexToLabel = (n: number): string => {
  if (n < ALPHABET_SIZE) {
    return String.fromCharCode(CHAR_CODE_A + n)
  }
  return (
    indexToLabel(Math.floor((n - ALPHABET_SIZE) / ALPHABET_SIZE)) +
    String.fromCharCode(CHAR_CODE_A + ((n - ALPHABET_SIZE) % ALPHABET_SIZE))
  )
}

const labelToIndex = (label: string): number => {
  let result = 0
  for (let i = 0; i < label.length; i++) {
    result = result * ALPHABET_SIZE + (label.charCodeAt(i) - CHAR_CODE_A + 1)
  }
  return result - 1
}

const parseCoord = (coord: string): { col: number; row: number } => {
  const match = coord.match(/^([A-Z]+)(\d+)$/)!
  return { col: labelToIndex(match[1]), row: parseInt(match[2], 10) - 1 }
}

export const initShip = (
  origin: string,
  direction: ShipDirection,
  length: number,
): Ship => ({
  origin,
  direction,
  length,
  hits: [],
})

export const shipCoords = (ship: Ship): string[] => {
  const { col, row } = parseCoord(ship.origin)
  return Array.from({ length: ship.length }, (_, i) =>
    ship.direction === ShipDirection.HORIZONTAL
      ? `${indexToLabel(col + i)}${row + 1}`
      : `${indexToLabel(col)}${row + i + 1}`,
  )
}

export const shipHit = (ship: Ship, deckIndex: number): void => {
  if (!ship.hits.includes(deckIndex)) {
    ship.hits.push(deckIndex)
  }
}

export const shipIsSunk = (ship: Ship): boolean =>
  ship.hits.length >= ship.length
