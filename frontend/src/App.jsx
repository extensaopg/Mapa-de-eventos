import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MapView from './components/MapView'
import AtivarConta from './pages/AtivarConta'

function App() {
  return (
      <BrowserRouter>
        <Routes>

          {/* mapa principal */}
          <Route path="/" element={<MapView />} />

          {/* ativação de conta */}
          <Route path="/ativar-conta" element={<AtivarConta />} />

        </Routes>
      </BrowserRouter>
  )
}

export default App