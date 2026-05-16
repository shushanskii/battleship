import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { shootCommand } from "../store/commands/shooting"
import { selectAgentReady, selectAgentTargetBoard, selectModel, selectUserTargetBoard } from "../store/game/selectors"
import { AgentMessages } from "./AgentMessages"
import { BoardView } from "./BoardView"
import { HistoryView } from "./HistoryView"
import { PlacementView } from "./PlacementView"
import { StrategyView } from "./StrategyView"
import { TargetView } from "./TargetView"
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

const ModelHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

const BoardRow = styled.div`
  display: flex;
  gap: 24px;
`

const BoardSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const SectionLabel = styled.div`
  font-family: monospace;
  font-size: 11px;
  color: #888;
`

export const GameView = () => {
  const dispatch = useDispatch()
  const model = useSelector(selectModel)
  const userTargetBoard = useSelector(selectUserTargetBoard)
  const agentTargetBoard = useSelector(selectAgentTargetBoard)
  const agentReady = useSelector(selectAgentReady)

  if (!model) {
    return null
  }

  return (
    <Container>
      <PlayerColumn>
        <ModelHeader>
          <ModelLabel>You</ModelLabel>
        </ModelHeader>
        <BoardRow>
          <BoardSection>
            <SectionLabel>fleet</SectionLabel>
            <PlacementView />
          </BoardSection>
          <BoardSection>
            <SectionLabel>target</SectionLabel>
            <TargetView board={userTargetBoard} onShoot={(coord) => dispatch(shootCommand(coord))} disabled={!agentReady} />
          </BoardSection>
        </BoardRow>
      </PlayerColumn>
      <PlayerColumn>
        <ModelHeader>
          <ModelLabel>{model}</ModelLabel>
        </ModelHeader>
        <BoardRow>
          <BoardSection>
            <SectionLabel>fleet</SectionLabel>
            <BoardView />
          </BoardSection>
          <BoardSection>
            <SectionLabel>target</SectionLabel>
            <TargetView board={agentTargetBoard} />
          </BoardSection>
        </BoardRow>
        <TokensView />
        <StrategyView />
        <HistoryView />
        <AgentMessages />
      </PlayerColumn>
    </Container>
  )
}
