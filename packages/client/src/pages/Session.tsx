import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { getCurrentSession } from '../actions'
import { selectCurrentSession } from '../selectors'
import { PlacementView } from '../components/PlacementView'
import { Loading } from '../components/Loading'
import type { AppDispatch } from '../store'
import type { Board } from '@battleship/core/board'

export const Session = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const session = useSelector(selectCurrentSession)

  useEffect(() => {
    if (id) {
      dispatch(getCurrentSession(id))
    }
  }, [id])

  const handleReady = (board: Board) => {
    console.log('Fleet placed', board)
  }

  if (!session) {
    return <Loading />
  }

  return (
    <Page>
      <Link to="/">← Home</Link>
      <h1>Game</h1>
      <p>Session: {session.id} — {session.phase}</p>
      <PlacementView onReady={handleReady} />
    </Page>
  )
}

const Page = styled.div`
  max-width: 800px;
  margin: 48px auto;
  padding: 0 16px;
  font-family: monospace;
`
