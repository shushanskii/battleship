import { all } from "redux-saga/effects";
import { gameSaga } from "./game/saga";

export function* rootSaga() {
    yield all([gameSaga()]);
}
