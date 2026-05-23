import { useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { fetchSessions, createSession, deleteSession } from '../actions'
import { selectSessions, selectLastSession } from '../selectors'
import type { AppDispatch } from '../store'

export const Home = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const sessions = useSelector(selectSessions)
  const lastSession = useSelector(selectLastSession)
  const prevLengthRef = useRef(sessions.length)

  useEffect(() => {
    dispatch(fetchSessions())
  }, [dispatch])

  useEffect(() => {
    if (sessions.length > prevLengthRef.current && lastSession) {
      navigate(`/session/${lastSession.id}`)
    }
    prevLengthRef.current = sessions.length
  }, [sessions, lastSession, navigate])

  const handleNew = () => {
    prevLengthRef.current = sessions.length
    dispatch(createSession())
  }

  const handleDelete = (id: string) => () => {
    dispatch(deleteSession(id))
  }

  return (
    <Page>
      <h1>Battleship</h1>
      <NewButton onClick={handleNew}>New Game</NewButton>

      {sessions.length  && (
        <>
          <h2>Sessions</h2>
          <List>
            {sessions.map((s) => (
              <Item key={s.id}>
                <Link to={`/session/${s.id}`}>{s.id}</Link>
                <Phase>{s.phase}</Phase>
                <DeleteButton onClick={handleDelete(s.id)}>Delete</DeleteButton>
              </Item>
            ))}
          </List>
          <Link to="/sessions">View all →</Link>
        </>
      )}
    </Page>
  )
}

const Page = styled.div`
  max-width: 640px;
  margin: 48px auto;
  padding: 0 16px;
  font-family: monospace;
`

const NewButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
`

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0;
`

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
`

const Phase = styled.span`
  color: #888;
  font-size: 12px;
`

const DeleteButton = styled.button`
  margin-left: auto;
  cursor: pointer;
`
