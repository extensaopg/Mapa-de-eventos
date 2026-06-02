import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/Mapview'
import { usuariosService } from '../services/usuariosService'
import '../styles/home.css'

function Home() {
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    usuariosService
      .me()
      .then(async (res) => {
        if (res.status === 401) { setUser(null); return }
        const data = await res.json()
        setUser(data)
      })
      .catch(() => setUser(null))
  }, [])

  function logout() {
    usuariosService.logout().then(() => {
      setUser(null)
      navigate('/login')
    })
  }

  return (
    <div className="home-wrapper">
      <MapView />

      <div className="home-user-box">
        {user ? (
          <>
            <div className="home-avatar" onClick={() => setOpen(!open)}>
              {user.nome?.charAt(0).toUpperCase()}
            </div>

            {open && (
              <div className="home-menu">
                <button onClick={() => navigate('/meus-eventos')}>Meus eventos</button>
                <button onClick={logout}>Sair</button>
              </div>
            )}
          </>
        ) : (
          <button className="home-btn-login" onClick={() => navigate('/login')}>
            Login
          </button>
        )}
        <button className="home-btn-help" onClick={() => navigate('/faq')} title="Ajuda / Documentação">?</button>
      </div>
    </div>
  )
}

export default Home
