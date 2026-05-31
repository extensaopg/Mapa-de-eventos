import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/Mapview'

const API_URL = `${import.meta.env.VITE_API_URL}`

function Home() {
    const [user, setUser] = useState(null)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${API_URL}/usuarios/me`, {
            credentials: 'include'
        })
            .then(async (res) => {
                if (res.status === 401) {
                    setUser(null)
                    return
                }

                const data = await res.json()
                setUser(data)
            })
            .catch(() => setUser(null))
    }, [])

    function logout() {
        fetch(`${API_URL}/usuarios/logout`, {
            method: 'POST',
            credentials: 'include'
        }).then(() => {
            setUser(null)
            navigate('/login')
        })
    }

    return (
        <div style={{ height: '100vh', width: '100%', position: 'relative' }}>

            {/* MAPA */}
            <MapView />

            {/* BOTÃO USUÁRIO */}
            <div style={styles.box}>
                {user ? (
                    <>
                        <div
                            style={styles.avatar}
                            onClick={() => setOpen(!open)}
                        >
                            {user.nome?.charAt(0).toUpperCase()}
                        </div>

                        {open && (
                            <div style={styles.menu}>
                                <button onClick={() => navigate('/meus-eventos')}>
                                    Meus eventos
                                </button>
                                <button onClick={logout}>
                                    Sair
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <button
                        style={styles.login}
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    )
}

const styles = {
    box: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: '#333',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    menu: {
        background: '#fff',
        padding: 10,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    },
    login: {
        padding: '6px 12px',
        borderRadius: 6,
        border: 'none',
        background: '#1976d2',
        color: '#fff',
        cursor: 'pointer'
    }
}

export default Home