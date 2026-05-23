import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { resetError } from '../actions'
import { selectError } from '../selectors'
import type { AppDispatch } from '../store'

export const ErrorNotification = () => {
  const dispatch = useDispatch<AppDispatch>()
  const error = useSelector(selectError)

  if (!error) {
    return null
  }

  const handleOk = () => {
    dispatch(resetError())
  }

  return (
    <Overlay>
      <Dialog>
        <Message>{error}</Message>
        <OkButton onClick={handleOk}>OK</OkButton>
      </Dialog>
    </Overlay>
  )
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const Dialog = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  min-width: 280px;
  font-family: monospace;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Message = styled.p`
  margin: 0;
  color: #c00;
`

const OkButton = styled.button`
  align-self: flex-end;
  padding: 8px 20px;
  cursor: pointer;
`
