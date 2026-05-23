import { createSelector } from 'reselect'
import type { Session } from '@battleship/core/session'
import type { RootState } from '../store'

const selectSessionsMap = (state: RootState) => state.sessions

export const selectSessions = createSelector(
  selectSessionsMap,
  (sessions): Session[] => Object.values(sessions),
)

export const selectSession = (id: string) =>
  createSelector(selectSessionsMap, (sessions): Session | undefined => sessions[id])

export const selectLastSession = createSelector(
  selectSessions,
  (sessions): Session | undefined => sessions[sessions.length - 1],
)
