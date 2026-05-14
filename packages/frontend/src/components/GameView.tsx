import { useSelector } from "react-redux"
import styled from "styled-components"
import { selectModel } from "../store/game/selectors"
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

export const GameView = () => {
  const model = useSelector(selectModel)

  if (!model) {
    return null
  }

  return (
    <Container>
      <PlayerColumn>
        <ModelHeader>
          <ModelLabel>{model}</ModelLabel>
        </ModelHeader>
        <BoardView />
        <TokensView />
        <StrategyView />
        <HistoryView />
        <AgentMessages />
      </PlayerColumn>
    </Container>
  )
}
