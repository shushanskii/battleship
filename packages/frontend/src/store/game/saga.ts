import { type WireMessage } from "@battleship/core"
import { END, eventChannel } from "redux-saga"
import { call, fork, put, take, takeLatest } from "redux-saga/effects"
import { receiveMessage, sendAnswer, startNewSession } from "./slice"
import { SessionCommands } from "../commands/sessions"

function createWsChannel(ws: WebSocket) {
  return eventChannel<WireMessage>((emit) => {
    ws.onmessage = (e) => emit(JSON.parse(e.data))
    ws.onclose = () => emit(END as any)
    return () => ws.close()
  })
}

function* watchIncoming(ws: WebSocket, model: string): Generator {
  const channel: any = yield call(createWsChannel, ws)
  while (true) {
    const { type, payload }: any = yield take(channel)
    yield put(receiveMessage({ model, type, payload }))
  }
}

function* watchOutgoing(ws: WebSocket, model: string): Generator {
  while (true) {
    const action: any = yield take(sendAnswer.type)
    if (action.payload.model === model) {
      ws.send(JSON.stringify({ type: "answer", payload: action.payload.answer }))
    }
  }
}

function* connectModel(id: string, model: string): Generator {
  const ws = new WebSocket(`ws://192.168.0.103:3002?id=${id}&model=${model}`)
  yield call(
    () =>
      new Promise<void>((resolve) =>
        ws.addEventListener("open", () => resolve()),
      ),
  )
  yield fork(watchIncoming, ws, model)
  yield fork(watchOutgoing, ws, model)
}

function* newSessionSaga(): Generator {

  const response: any = yield call(fetch, "http://192.168.0.103:3001/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "google/gemma-4-e2b" }),
  })
  const { id, model }: any = yield call([response, "json"])

  yield put(startNewSession({ id, model, startedAt: Date.now() }))

  yield fork(connectModel, id, model)
}

export function* sessionsSaga() {
  yield takeLatest(SessionCommands.START, newSessionSaga)
}
