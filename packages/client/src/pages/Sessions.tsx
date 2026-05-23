import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { fetchSessions, deleteSession } from '../actions'
import { selectSessions } from '../selectors'
import type { AppDispatch } from '../store'

export const Sessions = () => {
  const dispatch = useDispatch<AppDispatch>()
  const sessions = useSelector(selectSessions)

  useEffect(() => {
    dispatch(fetchSessions())
  }, [])

  const handleDelete = (id: string) => {
    dispatch(deleteSession(id))
  }

  return (
    <Page>
      <Header>
        <h1>Sessions</h1>
        <Link to="/">← Home</Link>
      </Header>

      {sessions.length === 0 ? (
        <Empty>No sessions yet</Empty>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Phase</Th>
              <Th>Created</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id}>
                <Td><Link to={`/session/${s.id}`}>{s.id}</Link></Td>
                <Td>{new Date(s.createdAt).toLocaleString()}</Td>
                <Td><DeleteButton onClick={() => handleDelete(s.id)}>Delete</DeleteButton></Td>
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
