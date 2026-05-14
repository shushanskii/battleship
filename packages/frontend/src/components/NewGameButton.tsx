import { useDispatch } from "react-redux"
import styled from "styled-components"
import { startSession } from "../store/commands/sessions"

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
    dispatch(startSession())
  }

  return <Button onClick={handleClick}>New Game</Button>
}
