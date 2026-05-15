import type { Ship } from "@battleship/core/ship"
import { put, takeEvery } from "redux-saga/effects"
import { PlacementCommands } from "../commands/placement"
import { placeShip } from "./slice"

function* handlePlaceShip(action: { type: string; payload: Ship }): Generator {
  yield put(placeShip(action.payload))
}

export function* placementSaga() {
  yield takeEvery(PlacementCommands.PLACE_SHIP, handlePlaceShip)
}
