import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import type { Session } from '@battleship/core/session'
import { SessionActions, deleteSession, fetchSession, setError } from '../actions'
import { addSession, addSessions, removeSession } from '../store/sessions/slice'
import * as api from '../api'

const toErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : String(error)
}

function* fetchSessionSaga({ payload: id }: ReturnType<typeof fetchSession>) {
  try {
    const session: Session = yield call(api.fetchSession, id)
    console.log('Fetched session', session)
    yield put(addSession(session))
  } catch (error) {
    console.error('Failed to fetch session', error)
    yield put(setError(toErrorMessage(error)))
  }
}

function* fetchSessionsSaga() {
  try {
    const sessions: Session[] = yield call(api.fetchSessions)
    yield put(addSessions(sessions))
  } catch (error) {
    yield put(setError(toErrorMessage(error)))
  }
}

function* createSessionSaga() {
  try {
    const session: Session = yield call(api.createSession)
    yield put(addSession(session))
  } catch (error) {
    yield put(setError(toErrorMessage(error)))
  }
}

function* deleteSessionSaga({ payload: id }: ReturnType<typeof deleteSession>) {
  try {
    yield call(api.deleteSession, id)
    yield put(removeSession(id))
  } catch (error) {
    yield put(setError(toErrorMessage(error)))
  }
}

export function* sessionsSaga() {
  yield takeLatest(SessionActions.FETCH, fetchSessionSaga)
  yield takeLatest(SessionActions.FETCH_ALL, fetchSessionsSaga)
  yield takeLatest(SessionActions.CREATE, createSessionSaga)
  yield takeEvery(SessionActions.DELETE, deleteSessionSaga)
}
