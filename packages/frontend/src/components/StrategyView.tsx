import { useSelector } from "react-redux"
import styled from "styled-components"
import { selectStrategy } from "../store/game/selectors"

const Container = styled.div`
  font-family: monospace;
  font-size: 11px;
  color: #666;
  padding: 6px 8px;
  background: #f8f8f0;
  border-left: 3px solid #ccc;
  border-radius: 0 4px 4px 0;
  white-space: pre-wrap;
  word-break: break-word;
`

const Title = styled.div`
  font-weight: bold;
  color: #444;
  margin-bottom: 4px;
`

export const StrategyView = ({ modelName }: { modelName: string }) => {
  const strategy = useSelector(selectStrategy(modelName))

  return (
    <Container>
      <Title>Strategy</Title>
      {strategy}
    </Container>
  )
}
