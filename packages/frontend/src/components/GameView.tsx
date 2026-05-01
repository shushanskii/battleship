import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { selectAgentMessages } from "../store/game/selectors"
import { sendAnswer } from "../store/game/slice"
import { BoardView } from "./BoardView"
import { TokensView } from "./TokensView"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 720px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
`

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
`

const Message = styled.div`
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 6px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-word;
`

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #ddd;
`

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
`

const SendButton = styled.button`
  padding: 8px 20px;
  cursor: pointer;
  border: 1px solid #333;
  border-radius: 6px;
  background: #333;
  color: #fff;
  &:hover { background: #555; }
`

export const GameView = () => {
  const [text, setText] = useState("")
  const dispatch = useDispatch()
  const messages = useSelector(selectAgentMessages)

  const handleSend = () => {
    if (!text.trim()) {
      return
    }
    dispatch(sendAnswer(text.trim()))
    setText("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <Container>
      <BoardView />
      <TokensView />
      <MessageList>
        {messages.map((msg, index) => (
          <Message key={`${index}-message`}>{msg}</Message>
        ))}
      </MessageList>
      <InputRow>
        <Input
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer..."
        />
        <SendButton onClick={handleSend}>Send</SendButton>
      </InputRow>
    </Container>
  )
}
