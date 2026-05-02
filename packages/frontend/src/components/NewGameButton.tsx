import { useDispatch } from "react-redux"
import styled from "styled-components"
import { startNewSession } from "../store/game/slice"

const Button = styled.button`
  padding: 12px 32px;
  font-size: 18px;
  cursor: pointer;
  border: 2px solid #333;
  background: #fff;
  border-radius: 6px;
  &:hover { background: #f0f0f0; }
`

export const NewGameButton = () => {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(startNewSession({ models: ["google/gemma-4-e2b", "qwen/qwen3.5-9b"] }))
  }

  return <Button onClick={handleClick}>New Game</Button>
}
