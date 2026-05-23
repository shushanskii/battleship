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
