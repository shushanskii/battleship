import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { getCurrentGame } from '../actions'
import { selectCurrentGame } from '../selectors'
import { PlacementView } from '../components/PlacementView'
import { Loading } from '../components/Loading'
import type { AppDispatch } from '../store'

export const Game = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const game = useSelector(selectCurrentGame)

  useEffect(() => {
    if (id) {
      dispatch(getCurrentGame(id))
    }
  }, [id])

  if (!game) {
    return <Loading />
  }

  return (
    <Page>
      <Link to="/">← Home</Link>
      <h1>Game</h1>
      <p>Session: {game.session.id}</p>
      <PlacementView />
    </Page>
  )
}

const Page = styled.div`
  max-width: 800px;
  margin: 48px auto;
  padding: 0 16px;
  font-family: monospace;
`
