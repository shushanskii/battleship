import { useSelector } from "react-redux"
import styled from "styled-components"
import { GameView } from "./components/GameView"
import { NewGameButton } from "./components/NewGameButton"
import { selectId } from "./store/game/selectors"

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

export const App = () => {
  const id = useSelector(selectId)
  return id ? (
    <GameView />
  ) : (
    <Center>
      <NewGameButton />
    </Center>
  )
}
