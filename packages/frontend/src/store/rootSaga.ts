import { all } from "redux-saga/effects"
import { sessionsSaga } from "./game/saga"

export function* rootSaga() {
  yield all([sessionsSaga()])
}
