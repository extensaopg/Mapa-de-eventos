import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MapView from './components/MapView'
import AtivarConta from './pages/AtivarConta'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<MapView />} />

                <Route path="/ativar-conta" element={<AtivarConta />} />

                <Route path="/login" element={<Login />} />

                <Route path="/cadastro" element={<Cadastro />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App