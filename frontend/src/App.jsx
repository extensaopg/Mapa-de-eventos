import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MapView from './components/MapView'
import AtivarConta from './pages/AtivarConta'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import EsqueciSenha from './pages/EsqueciSenha'

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<MapView />} />

                <Route path="/ativar-conta" element={<AtivarConta />} />

                <Route path="/login" element={<Login />} />

                <Route path="/cadastro" element={<Cadastro />} />

                <Route path="/esqueci-senha" element={<EsqueciSenha />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App