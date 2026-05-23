import { put, takeLatest } from 'redux-saga/effects'
import { ClientActions, setCurrentSession as setCurrentSessionAction, setError as setErrorAction } from '../actions'
import { setCurrentSession, resetError, setError } from '../store/client/slice'

function* setCurrentSessionSaga(action: ReturnType<typeof setCurrentSessionAction>) {
  yield put(setCurrentSession(action.payload))
}

function* setErrorSaga(action: ReturnType<typeof setErrorAction>) {
  yield put(setError(action.payload))
}

function* resetErrorSaga() {
  yield put(resetError())
}

export function* clientSaga() {
  yield takeLatest(ClientActions.SET_CURRENT_SESSION, setCurrentSessionSaga)
  yield takeLatest(ClientActions.SET_ERROR, setErrorSaga)
  yield takeLatest(ClientActions.RESET_ERROR, resetErrorSaga)
}
