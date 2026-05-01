import { indexToLabel, labelToIndex } from "./coords"

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

const parseCoord = (coord: string): { col: number; row: number } => {
  const match = coord.match(/^([A-Z]+)(\d+)$/)!
  return { col: labelToIndex(match[1]), row: parseInt(match[2], 10) - 1 }
}

export const init = (
  origin: string,
  direction: ShipDirection,
  length: number,
): Ship => ({
  origin,
  direction,
  length,
  hits: [],
})

export const coords = (ship: Ship): string[] => {
  const { col, row } = parseCoord(ship.origin)
  return Array.from({ length: ship.length }, (_, i) =>
    ship.direction === ShipDirection.HORIZONTAL
      ? `${indexToLabel(col + i)}${row + 1}`
      : `${indexToLabel(col)}${row + i + 1}`,
  )
}

export const hit = (ship: Ship, deckIndex: number): void => {
  if (!ship.hits.includes(deckIndex)) {
    ship.hits.push(deckIndex)
  }
}

export const isSunk = (ship: Ship): boolean => ship.hits.length >= ship.length
