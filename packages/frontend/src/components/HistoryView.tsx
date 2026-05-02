import { useSelector } from "react-redux"
import styled from "styled-components"
import { selectHistory } from "../store/game/selectors"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
`

const Title = styled.div`
  font-family: monospace;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
`

const Entry = styled.div`
  font-family: monospace;
  font-size: 11px;
  color: #555;
  padding: 3px 6px;
  background: #f0f0f0;
  border-radius: 4px;
`

export const HistoryView = ({ modelName }: { modelName: string }) => {
  const history = useSelector(selectHistory(modelName))

  return (
    <Container>
      <Title>Placement history</Title>
      {history.map((entry, i) => (
        <Entry key={i}>{entry}</Entry>
      ))}
    </Container>
  )
}
