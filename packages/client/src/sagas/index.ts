import { all } from 'redux-saga/effects'
import { gamesSaga } from './games'
import { clientSaga } from './client'

export function* rootSaga() {
  yield all([gamesSaga(), clientSaga()])
}
