import { useSelector } from "react-redux"
import styled from "styled-components"
import { selectLlmCalls, selectTotalTokens } from "../store/game/selectors"

const Container = styled.div`
    font-family: monospace;
    font-size: 13px;
    color: #888;
    padding: 4px 0;
    display: flex;
    gap: 16px;
`

export const TokensView = () => {
  const tokens = useSelector(selectTotalTokens())
  const llmCalls = useSelector(selectLlmCalls())

  return (
    <Container>
      <span>Tokens: {tokens.toLocaleString()}</span>
      <span>LLM calls: {llmCalls}</span>
    </Container>
  )
}
