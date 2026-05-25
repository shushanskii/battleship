import type { Ship } from '@battleship/core/ship'

export enum ClientActions {
  GET_CURRENT_GAME = 'CLIENT:GET_CURRENT_GAME',
  SET_ERROR = 'CLIENT:SET_ERROR',
  RESET_ERROR = 'CLIENT:RESET_ERROR',
}

export const getCurrentGame = (id: string) => ({
  type: ClientActions.GET_CURRENT_GAME,
  payload: id,
})

export const setError = (message: string) => ({
  type: ClientActions.SET_ERROR,
  payload: message,
})

export const resetError = () => ({
  type: ClientActions.RESET_ERROR,
})

export enum GameActions {
  FETCH = 'GAMES:FETCH',
  FETCH_ALL = 'GAMES:FETCH_ALL',
  CREATE = 'GAMES:CREATE',
  DELETE = 'GAMES:DELETE',
}

export enum PlacementActions {
  PLACE_SHIP = 'PLACEMENT:PLACE_SHIP',
}

export const fetchGame = (id: string) => ({
  type: GameActions.FETCH,
  payload: id,
})

export const fetchGames = () => ({
  type: GameActions.FETCH_ALL,
})

export const createGame = () => ({
  type: GameActions.CREATE,
})

export const deleteGame = (id: string) => ({
  type: GameActions.DELETE,
  payload: id,
})

export const placeShip = (sessionId: string, ship: Ship) => ({
  type: PlacementActions.PLACE_SHIP,
  payload: { sessionId, ship },
})
