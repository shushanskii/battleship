import { type MessageValue, MessageType } from "@battleship/core"
import { useSelector } from "react-redux"
import styled from "styled-components"
import { selectAgentMessages, selectStartedAt } from "../store/game/selectors"

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
`

const Item = styled.div`
  font-family: monospace;
  font-size: 11px;
  color: #555;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
`

const Timestamp = styled.span`
  color: #aaa;
  margin-right: 6px;
`

const formatElapsed = (ts: number, startedAt: number): string => {
  const totalSeconds = Math.floor((ts - startedAt) / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `+${minutes}:${seconds.toString().padStart(2, "0")}`
}

export const AgentMessages = ({ modelName }: { modelName: string }) => {
  const messages = useSelector(selectAgentMessages(modelName)) as MessageValue[MessageType.AGENT][]
  const startedAt = useSelector(selectStartedAt)

  return (
    <List>
      {messages.map((msg, i) => (
        <Item key={i}>
          {startedAt && <Timestamp>{formatElapsed(msg.ts, startedAt)}</Timestamp>}
          {msg.text}
        </Item>
      ))}
    </List>
  )
}
