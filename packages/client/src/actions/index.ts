export enum ClientActions {
  GET_CURRENT_SESSION = "CLIENT:GET_CURRENT_SESSION",
  SET_ERROR = "CLIENT:SET_ERROR",
  RESET_ERROR = "CLIENT:RESET_ERROR",
}

export const getCurrentSession = (id: string) => ({
  type: ClientActions.GET_CURRENT_SESSION,
  payload: id,
})

export const setError = (message: string) => ({
  type: ClientActions.SET_ERROR,
  payload: message,
})

export const resetError = () => ({
  type: ClientActions.RESET_ERROR,
})

export enum SessionActions {
  FETCH = "SESSIONS:FETCH",
  FETCH_ALL = "SESSIONS:FETCH_ALL",
  CREATE = "SESSIONS:CREATE",
  DELETE = "SESSIONS:DELETE",
}

export const fetchSession = (id: string) => ({
  type: SessionActions.FETCH,
  payload: id,
})

export const fetchSessions = () => ({
  type: SessionActions.FETCH_ALL,
})

export const createSession = () => ({
  type: SessionActions.CREATE,
})

export const deleteSession = (id: string) => ({
  type: SessionActions.DELETE,
  payload: id,
})
