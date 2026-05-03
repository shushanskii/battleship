import { type WireMessage } from "@battleship/core"
import { END, eventChannel } from "redux-saga"
import { call, fork, put, take, takeLatest } from "redux-saga/effects"
import { receiveMessage, sendAnswer, sessionCreated, startNewSession } from "./slice"

function createWsChannel(ws: WebSocket) {
  return eventChannel<WireMessage>((emit) => {
    ws.onmessage = (e) => emit(JSON.parse(e.data))
    ws.onclose = () => emit(END as any)
    return () => ws.close()
  })
}

function* watchIncoming(ws: WebSocket, modelName: string): Generator {
  const channel: any = yield call(createWsChannel, ws)
  while (true) {
    const { type, payload }: any = yield take(channel)
    yield put(receiveMessage({ model: modelName, type, payload }))
  }
}

function* watchOutgoing(ws: WebSocket, modelName: string): Generator {
  while (true) {
    const action: any = yield take(sendAnswer.type)
    if (action.payload.model === modelName) {
      ws.send(JSON.stringify({ type: "answer", payload: action.payload.answer }))
    }
  }
}

function* connectModel(id: string, modelName: string): Generator {
  const ws = new WebSocket(`ws://192.168.0.103:3002?id=${id}&model=${modelName}`)
  yield call(
    () =>
      new Promise<void>((resolve) =>
        ws.addEventListener("open", () => resolve()),
      ),
  )
  yield fork(watchIncoming, ws, modelName)
  yield fork(watchOutgoing, ws, modelName)
}

function* newSessionSaga(action: any): Generator {
  const { models } = action.payload as { models: [string, string] }

  const response: any = yield call(fetch, "http://192.168.0.103:3001/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ models }),
  })
  const { id }: any = yield call([response, "json"])

  yield put(sessionCreated({ id, models, startedAt: Date.now() }))

  for (const modelName of models) {
    yield fork(connectModel, id, modelName)
  }
}

export function* sessionsSaga() {
  yield takeLatest(startNewSession.type, newSessionSaga)
}
