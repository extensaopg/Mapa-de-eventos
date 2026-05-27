import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MeusEventos() {
    const [eventos, setEventos] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        // 1. Verifica autenticação
        fetch('http://localhost:3000/usuarios/me', { credentials: 'include' })
            .then(res => {
                if (res.status === 401) {
                    navigate('/login') // Expulsa se não estiver logado
                } else {
                    // 2. Busca os eventos (ajustaremos o backend no futuro para buscar só os DO USUÁRIO)
                    return fetch('http://localhost:3000/eventos')
                }
            })
            .then(res => res && res.json())
            .then(data => {
                if (data) {
                    setEventos(data)
                    setLoading(false)
                }
            })
            .catch(err => console.error(err))
    }, [navigate])

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2>Meus Eventos</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => navigate('/')} style={styles.btnSecondary}>Voltar ao Mapa</button>
                    <button onClick={() => navigate('/criar-evento')} style={styles.btnPrimary}>+ Novo Evento</button>
                </div>
            </header>

            {loading ? (
                <p>Carregando eventos...</p>
            ) : (
                <div style={styles.grid}>
                    {eventos.length === 0 ? (
                        <p>Você ainda não possui eventos cadastrados.</p>
                    ) : (
                        eventos.map(evento => (
                            <div key={evento._id} style={styles.card}>
                                <h3>{evento.descricao}</h3>
                                <p>Início: {new Date(evento.data_inicio).toLocaleDateString()}</p>
                                <p>Fim: {new Date(evento.data_fim).toLocaleDateString()}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

const styles = {
    container: { padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    btnPrimary: { background: '#1976d2', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' },
    btnSecondary: { background: '#ccc', color: '#333', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' },
    grid: { display: 'flex', flexDirection: 'column', gap: '15px' },
    card: { border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
}

export default MeusEventos