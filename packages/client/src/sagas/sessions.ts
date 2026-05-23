import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import type { Session } from '@battleship/core/session'
import { SessionActions, deleteSession, setError } from '../actions'
import { addSession, addSessions, removeSession } from '../store/sessions/slice'
import * as api from '../api'

function* fetchSessionsSaga() {
  try {
    const sessions: Session[] = yield call(api.fetchSessions)
    yield put(addSessions(sessions))
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : String(error)))
  }
}

function* createSessionSaga() {
  try {
    const session: Session = yield call(api.createSession)
    yield put(addSession(session))
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : String(error)))
  }
}

function* deleteSessionSaga(action: ReturnType<typeof deleteSession>) {
  try {
    yield call(api.deleteSession, action.payload)
    yield put(removeSession(action.payload))
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : String(error)))
  }
}

export function* sessionsSaga() {
  yield takeLatest(SessionActions.FETCH, fetchSessionsSaga)
  yield takeLatest(SessionActions.CREATE, createSessionSaga)
  yield takeEvery(SessionActions.DELETE, deleteSessionSaga)
}
