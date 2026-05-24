import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { fetchGames, createGame, deleteGame } from '../actions'
import { selectGames } from '../selectors'
import type { AppDispatch } from '../store'

export const Home = () => {
  const dispatch = useDispatch<AppDispatch>()
  const games = useSelector(selectGames)

  useEffect(() => {
    dispatch(fetchGames())
  }, [])

  const handleNew = () => {
    dispatch(createGame())
  }

  const handleDelete = (id: string) => () => {
    dispatch(deleteGame(id))
  }

  return (
    <Page>
      <h1>Battleship</h1>
      <NewButton onClick={handleNew}>New Game</NewButton>

      {games.length > 0 && (
        <>
          <h2>Games</h2>
          <List>
            {games.map((g) => (
              <Item key={g.session.id}>
                <Link to={`/game/${g.session.id}`}>{g.session.id}</Link>
                <DeleteButton onClick={handleDelete(g.session.id)}>Delete</DeleteButton>
              </Item>
            ))}
          </List>
          <Link to="/games">View all →</Link>
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

const DeleteButton = styled.button`
  margin-left: auto;
  cursor: pointer;
`
