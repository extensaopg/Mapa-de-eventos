import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MapView from './components/MapView'
import AtivarConta from './pages/AtivarConta'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import EsqueciSenha from './pages/EsqueciSenha'
import ResetSenha from './pages/ResetSenha'
import Home from './pages/Home.jsx'
import MeusEventos from './pages/MeusEventos'
import CriarEvento from './pages/CriarEvento'
import EditarEvento from './pages/EditarEvento'

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/ativar-conta" element={<AtivarConta />} />

                <Route path="/login" element={<Login />} />

                <Route path="/cadastro" element={<Cadastro />} />

                <Route path="/esqueci-senha" element={<EsqueciSenha />} />

                <Route path="/reset-senha" element={<ResetSenha />} />

                <Route path="/meus-eventos" element={<MeusEventos />} />
                
                <Route path="/criar-evento" element={<CriarEvento />} />

                <Route path="/editar-evento/:id" element={<EditarEvento />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App