import { put, select, takeLatest } from 'redux-saga/effects'
import { ClientActions, getCurrentSession as getCurrentSessionAction, fetchSession, setError as setErrorAction } from '../actions'
import { setCurrentSession, resetError, setError } from '../store/client/slice'
import { selectSession } from '../selectors'
import type { Session } from '@battleship/core/session'
import type { RootState } from '../store'

function* getCurrentSessionSaga({ payload: id }: ReturnType<typeof getCurrentSessionAction>) {
  const existing: Session | undefined = yield select((state: RootState) => selectSession(id)(state))

  if (!existing) {
    yield put(fetchSession(id))
  }

  yield put(setCurrentSession(id))
}

function* setErrorSaga({ payload }: ReturnType<typeof setErrorAction>) {
  yield put(setError(payload))
}

function* resetErrorSaga() {
  yield put(resetError())
}

export function* clientSaga() {
  yield takeLatest(ClientActions.GET_CURRENT_SESSION, getCurrentSessionSaga)
  yield takeLatest(ClientActions.SET_ERROR, setErrorSaga)
  yield takeLatest(ClientActions.RESET_ERROR, resetErrorSaga)
}
