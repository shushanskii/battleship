import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { fetchSessions } from '../actions'
import { selectSession } from '../selectors'
import type { AppDispatch, RootState } from '../store'

export const Session = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const session = useSelector((state: RootState) => selectSession(id!)(state))

  useEffect(() => {
    if (!session) {
      dispatch(fetchSessions())
    }
  }, [dispatch, session])

  return (
    <Page>
      <Link to="/">← Home</Link>
      <h1>Game</h1>
      {session ? (
        <p>Session: {session.id} — {session.phase}</p>
      ) : (
        <p>Loading...</p>
      )}
    </Page>
  )
}

const Page = styled.div`
  max-width: 800px;
  margin: 48px auto;
  padding: 0 16px;
  font-family: monospace;
`
