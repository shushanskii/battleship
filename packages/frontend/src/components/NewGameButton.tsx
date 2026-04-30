import { useDispatch } from "react-redux";
import styled from "styled-components";
import { startNewGame } from "../store/game/slice";

const Button = styled.button`
  padding: 12px 32px;
  font-size: 18px;
  cursor: pointer;
  border: 2px solid #333;
  background: #fff;
  border-radius: 6px;
  &:hover { background: #f0f0f0; }
`;

export const NewGameButton = () => {
    const dispatch = useDispatch();
    return <Button onClick={() => dispatch(startNewGame())}>New Game</Button>;
};
