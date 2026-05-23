import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import type { Session } from '@battleship/core/session'
import { SessionActions, deleteSession } from '../actions'
import { addSession, addSessions, removeSession } from '../store/sessions/slice'
import * as api from '../api'

function* fetchSessionsSaga() {
  const sessions: Session[] = yield call(api.fetchSessions)
  yield put(addSessions(sessions))
}

function* createSessionSaga() {
  const session: Session = yield call(api.createSession)
  yield put(addSession(session))
}

function* deleteSessionSaga(action: ReturnType<typeof deleteSession>) {
  yield call(api.deleteSession, action.payload)
  yield put(removeSession(action.payload))
}

export function* sessionsSaga() {
  yield takeLatest(SessionActions.FETCH, fetchSessionsSaga)
  yield takeLatest(SessionActions.CREATE, createSessionSaga)
  yield takeEvery(SessionActions.DELETE, deleteSessionSaga)
}
