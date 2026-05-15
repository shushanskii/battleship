import { all } from "redux-saga/effects"
import { placementSaga } from "./game/placementSaga"
import { sessionsSaga } from "./game/saga"

export function* rootSaga() {
  yield all([sessionsSaga(), placementSaga()])
}
