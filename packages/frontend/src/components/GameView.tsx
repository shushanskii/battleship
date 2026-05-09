import { useSelector } from "react-redux"
import styled from "styled-components"
import { selectModels, selectReadyModels } from "../store/game/selectors"
import { AgentMessages } from "./AgentMessages"
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ReadyBadge = styled.span`
  font-family: monospace;
  font-size: 11px;
  color: #2a9d2a;
  margin-left: 8px;
`

const ModelHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

const PlayerView = ({ modelName }: { modelName: string }) => {
  const readyModels = useSelector(selectReadyModels)
  const isReady = readyModels.includes(modelName)

  return (
    <PlayerColumn>
      <ModelHeader>
        <ModelLabel>{modelName}</ModelLabel>
        {isReady && <ReadyBadge>fleet ready</ReadyBadge>}
      </ModelHeader>
      <BoardView modelName={modelName} />
      <TokensView modelName={modelName} />
      <StrategyView modelName={modelName} />
      <HistoryView modelName={modelName} />
      <AgentMessages modelName={modelName} />
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
