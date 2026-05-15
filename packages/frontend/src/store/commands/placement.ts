import type { Ship } from "@battleship/core/ship"

export enum PlacementCommands {
  PLACE_SHIP = "PLACEMENT:PLACE_SHIP",
}

export const placeShipCommand = (ship: Ship) => ({
  type: PlacementCommands.PLACE_SHIP,
  payload: ship,
})
