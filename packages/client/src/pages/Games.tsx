import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { fetchGames, deleteGame } from '../actions'
import { selectGames } from '../selectors'
import type { AppDispatch } from '../store'

export const Games = () => {
  const dispatch = useDispatch<AppDispatch>()
  const games = useSelector(selectGames)

  useEffect(() => {
    dispatch(fetchGames())
  }, [])

  const handleDelete = (id: string) => {
    dispatch(deleteGame(id))
  }

  return (
    <Page>
      <Header>
        <h1>Games</h1>
        <Link to="/">← Home</Link>
      </Header>

      {games.length === 0 ? (
        <Empty>No games yet</Empty>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Created</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {games.map((g) => (
              <tr key={g.session.id}>
                <Td><Link to={`/game/${g.session.id}`}>{g.session.id}</Link></Td>
                <Td>{new Date(g.session.createdAt).toLocaleString()}</Td>
                <Td><DeleteButton onClick={() => handleDelete(g.session.id)}>Delete</DeleteButton></Td>
              </tr>
            ))}
          </tbody>
        </Table>
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

const Header = styled.div`
  display: flex;
  align-items: baseline;
  gap: 16px;
`

const Empty = styled.p`
  color: #888;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  text-align: left;
  padding: 8px;
  border-bottom: 2px solid #ddd;
`

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid #eee;
`

const DeleteButton = styled.button`
  cursor: pointer;
`
