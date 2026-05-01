import { nanoid } from "@reduxjs/toolkit"
import { END, eventChannel } from "redux-saga"
import { call, fork, put, take, takeLatest } from "redux-saga/effects"
import type { WsMessage } from "./slice"
import {
  receiveMessage,
  sendAnswer,
  sessionCreated,
  startNewGame,
} from "./slice"

function createWsChannel(ws: WebSocket) {
  return eventChannel<WsMessage>((emit) => {
    ws.onmessage = (e) => emit(JSON.parse(e.data))
    ws.onclose = () => emit(END as any)
    return () => ws.close()
  })
}

function* watchIncoming(ws: WebSocket): Generator {
  const channel: any = yield call(createWsChannel, ws)
  while (true) {
    const message: any = yield take(channel)
    yield put(receiveMessage({ id: nanoid(), message }))
  }
}

function* watchOutgoing(ws: WebSocket): Generator {
  while (true) {
    const action: any = yield take(sendAnswer.type)
    ws.send(JSON.stringify({ type: "answer", payload: action.payload }))
  }
}

function* newGameSaga(): Generator {
  const response: any = yield call(fetch, "http://192.168.0.103:3001/session", {
    method: "POST",
  })
  const { id }: any = yield call([response, "json"])

  yield put(sessionCreated(id))

  const ws = new WebSocket(`ws://192.168.0.103:3002?id=${id}`)
  yield call(
    () =>
      new Promise<void>((resolve) =>
        ws.addEventListener("open", () => resolve()),
      ),
  )

  yield fork(watchIncoming, ws)
  yield fork(watchOutgoing, ws)
}

export function* gameSaga() {
  yield takeLatest(startNewGame.type, newGameSaga)
}
