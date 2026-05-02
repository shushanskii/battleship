import { useSelector } from "react-redux"
import styled from "styled-components"
import { selectAgentMessages, selectModels } from "../store/game/selectors"
import { BoardView } from "./BoardView"
import { HistoryView } from "./HistoryView"
import { StrategyView } from "./StrategyView"
import { TokensView } from "./TokensView"

const Container = styled.div`
  display: flex;
  gap: 24px;
  padding: 16px;
  height: 100vh;
  box-sizing: border-box;
`

const PlayerColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`

const ModelLabel = styled.div`
  font-family: monospace;
  font-size: 12px;
  color: #555;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 0;
`

const Message = styled.div`
  padding: 6px 10px;
  background: #f5f5f5;
  border-radius: 6px;
  font-family: monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-word;
`

const PlayerView = ({ modelName }: { modelName: string }) => {
  const messages = useSelector(selectAgentMessages(modelName))

  return (
    <PlayerColumn>
      <ModelLabel>{modelName}</ModelLabel>
      <BoardView modelName={modelName} />
      <TokensView modelName={modelName} />
      <StrategyView modelName={modelName} />
      <HistoryView modelName={modelName} />
      <MessageList>
        {messages.map((msg, index) => (
          <Message key={`${index}-message`}>{msg}</Message>
        ))}
      </MessageList>
    </PlayerColumn>
  )
}

export const GameView = () => {
  const models = useSelector(selectModels)

  return (
    <Container>
      {models.map((modelName) => (
        <PlayerView key={modelName} modelName={modelName} />
      ))}
    </Container>
  )
}
