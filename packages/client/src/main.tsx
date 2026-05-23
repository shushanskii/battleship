import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { store } from './store'
import { Home } from './pages/Home'
import { Sessions } from './pages/Sessions'
import { Session } from './pages/Session'
import { ErrorNotification } from './components/ErrorNotification'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/session/:id" element={<Session />} />
        </Routes>
      </BrowserRouter>
      <ErrorNotification />
    </Provider>
  </StrictMode>,
)
