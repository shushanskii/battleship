import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import type { GameView } from '@battleship/core/game'
import { GameActions, deleteGame, fetchGame, setError } from '../actions'
import { setGame, setGames, removeGame } from '../store/games/slice'
import * as api from '../api'

const toErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : String(error)
}

function* fetchGameSaga({ payload: id }: ReturnType<typeof fetchGame>) {
  try {
    const game: GameView = yield call(api.fetchGame, id)
    yield put(setGame(game))
  } catch (error) {
    yield put(setError(toErrorMessage(error)))
  }
}

function* fetchGamesSaga() {
  try {
    const games: Record<string, GameView> = yield call(api.fetchGames)
    yield put(setGames(games))
  } catch (error) {
    yield put(setError(toErrorMessage(error)))
  }
}

function* createGameSaga() {
  try {
    const game: GameView = yield call(api.createGame)
    yield put(setGame(game))
  } catch (error) {
    yield put(setError(toErrorMessage(error)))
  }
}

function* deleteGameSaga({ payload: id }: ReturnType<typeof deleteGame>) {
  try {
    yield call(api.deleteGame, id)
    yield put(removeGame(id))
  } catch (error) {
    yield put(setError(toErrorMessage(error)))
  }
}

export function* gamesSaga() {
  yield takeLatest(GameActions.FETCH, fetchGameSaga)
  yield takeLatest(GameActions.FETCH_ALL, fetchGamesSaga)
  yield takeLatest(GameActions.CREATE, createGameSaga)
  yield takeEvery(GameActions.DELETE, deleteGameSaga)
}
