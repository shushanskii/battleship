import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from '../sagas'
import { gamesReducer } from './games/slice'
import { clientReducer } from './client/slice'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: { games: gamesReducer, client: clientReducer },
  middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
