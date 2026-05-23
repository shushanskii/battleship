import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { fetchSessions, deleteSession, type Session } from '../api'

export const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([])

  const load = () => fetchSessions().then(setSessions)

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    await deleteSession(id)
    load()
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
                <Td>{s.phase}</Td>
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
