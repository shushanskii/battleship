import { useSelector } from "react-redux"
import styled from "styled-components"
import { GameView } from "./components/GameView"
import { NewGameButton } from "./components/NewGameButton"
import type { RootState } from "./store"

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

export const App = () => {
  const sessionId = useSelector((state: RootState) => state.sessions.sessionId)
  return sessionId ? (
    <GameView />
  ) : (
    <Center>
      <NewGameButton />
    </Center>
  )
}
