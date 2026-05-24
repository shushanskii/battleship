import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { store } from './store'
import { Home } from './pages/Home'
import { Games } from './pages/Games'
import { Game } from './pages/Game'
import { ErrorNotification } from './components/ErrorNotification'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/game/:id" element={<Game />} />
        </Routes>
      </BrowserRouter>
      <ErrorNotification />
    </Provider>
  </StrictMode>,
)
