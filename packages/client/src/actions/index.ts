export enum ClientActions {
  SET_CURRENT_SESSION = "CLIENT:SET_CURRENT_SESSION",
  SET_ERROR = "CLIENT:SET_ERROR",
  RESET_ERROR = "CLIENT:RESET_ERROR",
}

export const setCurrentSession = (id: string | null) => ({
  type: ClientActions.SET_CURRENT_SESSION,
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
  CREATE = "SESSIONS:CREATE",
  DELETE = "SESSIONS:DELETE",
}

export const fetchSessions = () => ({
  type: SessionActions.FETCH,
})

export const createSession = () => ({
  type: SessionActions.CREATE,
})

export const deleteSession = (id: string) => ({
  type: SessionActions.DELETE,
  payload: id,
})
