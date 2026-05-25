import { createSelector } from 'reselect'
import type { GameView } from '@battleship/core/game'
import type { Board } from '@battleship/core/board'
import type { RootState } from '../store'

const selectGamesMap = (state: RootState) => state.games

export const selectGames = createSelector(
  selectGamesMap,
  (games): GameView[] => Object.values(games),
)

export const selectGame = (id: string) =>
  createSelector(selectGamesMap, (games): GameView | undefined => games[id])

export const selectLastGame = createSelector(
  selectGames,
  (games): GameView | undefined => games[games.length - 1],
)

export const selectCurrentGame = createSelector(
  [(state: RootState) => state.client, selectGamesMap],
  (client, games): GameView | undefined =>
    client.currentGame ? games[client.currentGame] : undefined,
)

export const selectCurrentGameBoard = createSelector(
  selectCurrentGame,
  (game): Board | null => game?.board ?? null,
)

export const selectError = (state: RootState) => state.client.error
