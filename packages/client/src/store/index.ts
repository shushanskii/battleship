import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from '../sagas'
import { sessionsReducer } from './sessions/slice'
import { clientReducer } from './client/slice'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: { sessions: sessionsReducer, client: clientReducer },
  middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
