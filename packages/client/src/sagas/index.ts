import { all } from 'redux-saga/effects'
import { sessionsSaga } from './sessions'

export function* rootSaga() {
  yield all([sessionsSaga()])
}
