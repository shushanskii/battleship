import { useSelector } from "react-redux"
import styled from "styled-components"
import { selectTotalTokens } from "../store/game/selectors"

const Container = styled.div`
    font-family: monospace;
    font-size: 13px;
    color: #888;
    padding: 4px 0;
`

export const TokensView = ({ modelName }: { modelName: string }) => {
  const tokens = useSelector(selectTotalTokens(modelName))

  if (!tokens) {
    return null
  }

  return <Container>Tokens: {tokens.toLocaleString()}</Container>
}
