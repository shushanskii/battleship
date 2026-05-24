import { put, select, takeLatest } from 'redux-saga/effects'
import { ClientActions, getCurrentGame as getCurrentGameAction, fetchGame, setError as setErrorAction } from '../actions'
import { setCurrentGame, resetError, setError } from '../store/client/slice'
import { selectGame } from '../selectors'
import type { GameView } from '@battleship/core/game'
import type { RootState } from '../store'

function* getCurrentGameSaga({ payload: id }: ReturnType<typeof getCurrentGameAction>) {
  const existing: GameView | undefined = yield select((state: RootState) => selectGame(id)(state))

  if (!existing) {
    yield put(fetchGame(id))
  }

  yield put(setCurrentGame(id))
}

function* setErrorSaga({ payload }: ReturnType<typeof setErrorAction>) {
  yield put(setError(payload))
}

function* resetErrorSaga() {
  yield put(resetError())
}

export function* clientSaga() {
  yield takeLatest(ClientActions.GET_CURRENT_GAME, getCurrentGameSaga)
  yield takeLatest(ClientActions.SET_ERROR, setErrorSaga)
  yield takeLatest(ClientActions.RESET_ERROR, resetErrorSaga)
}
