import { all } from 'redux-saga/effects'
import { sessionsSaga } from './sessions'
import { clientSaga } from './client'

export function* rootSaga() {
  yield all([sessionsSaga(), clientSaga()])
}
