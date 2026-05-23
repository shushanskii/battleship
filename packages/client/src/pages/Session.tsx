import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'

export const Session = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <Page>
      <Link to="/">← Home</Link>
      <h1>Game</h1>
      <p>Session: {id}</p>
    </Page>
  )
}

const Page = styled.div`
  max-width: 800px;
  margin: 48px auto;
  padding: 0 16px;
  font-family: monospace;
`
