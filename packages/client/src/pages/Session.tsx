import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { setCurrentSession } from '../actions'
import { selectCurrentSession } from '../selectors'
import type { AppDispatch } from '../store'

export const Session = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const session = useSelector(selectCurrentSession)

  useEffect(() => {
    if (id) {
      dispatch(setCurrentSession(id))
    }
  }, [id])

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
