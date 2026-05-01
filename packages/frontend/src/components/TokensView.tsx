import { useSelector } from "react-redux"
import styled from "styled-components"
import type { RootState } from "../store"

const Container = styled.div`
    font-family: monospace;
    font-size: 13px;
    color: #888;
    padding: 4px 0;
`

export const TokensView = () => {
  const tokens = useSelector((state: RootState) => state.game.tokens)

  if (!tokens) {
    return null
  }

  return <Container>Tokens: {tokens.toLocaleString()}</Container>
}
