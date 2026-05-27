import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MeusEventos() {
    const [eventos, setEventos] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetch('http://localhost:3000/usuarios/me', { credentials: 'include' })
            .then(res => {
                if (res.status === 401) {
                    navigate('/login')
                } else {
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

    const handleDelete = async (id) => {
        const confirmar = window.confirm("Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.")
        
        if (!confirmar) return;

        try {
            const res = await fetch(`http://localhost:3000/eventos/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (res.ok) {
                setEventos(eventos.filter(evento => evento._id !== id))
            } else {
                alert('Erro ao excluir o evento.')
            }
        } catch (error) {
            console.error('Erro ao deletar:', error)
            alert('Erro de conexão com o servidor.')
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <header style={styles.header}>
                    <div>
                        <h2 style={styles.title}>Meus Eventos</h2>
                        <p style={styles.subtitle}>Gerencie suas localizações e eventos cadastrados.</p>
                    </div>
                    <div style={styles.buttonContainer}>
                        <button onClick={() => navigate('/')} style={styles.btnSecondary}>← Voltar ao Mapa</button>
                        <button onClick={() => navigate('/criar-evento')} style={styles.btnPrimary}>+ Novo Evento</button>
                    </div>
                </header>

                {loading ? (
                    <div style={styles.loadingState}>Carregando seus eventos...</div>
                ) : (
                    <>
                        {eventos.length === 0 ? (
                            <div style={styles.emptyState}>
                                <h3 style={{ margin: '0 0 10px 0', color: '#555' }}>Nenhum evento por aqui</h3>
                                <p style={{ margin: '0 0 20px 0', color: '#888' }}>Você ainda não cadastrou nenhum evento no mapa.</p>
                                <button onClick={() => navigate('/criar-evento')} style={styles.btnPrimary}>Criar meu primeiro evento</button>
                            </div>
                        ) : (
                            <div style={styles.grid}>
                                {eventos.map(evento => (
                                    <div key={evento._id} style={styles.card}>
                                        <div>
                                            <h3 style={styles.cardTitle}>{evento.descricao}</h3>
                                            <p style={styles.cardDate}>
                                                <span style={styles.icon}>📅</span> 
                                                <strong>Início:</strong> {new Date(evento.data_inicio).toLocaleDateString()}
                                            </p>
                                            <p style={styles.cardDate}>
                                                <span style={styles.icon}>🏁</span> 
                                                <strong>Fim:</strong> {new Date(evento.data_fim).toLocaleDateString()}
                                            </p>
                                        </div>
                                        
                                        <div style={styles.cardActions}>
                                            <button 
                                                onClick={() => navigate(`/editar-evento/${evento._id}`)} 
                                                style={styles.btnEdit}
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(evento._id)} 
                                                style={styles.btnDelete}
                                            >
                                                🗑️ Excluir
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

const styles = {
    // Fundo da tela levemente acinzentado para destacar os cards brancos
    page: { 
        minHeight: '100vh', 
        backgroundColor: '#F4F6F8', 
        padding: '40px 20px', 
        fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' 
    },
    container: { 
        maxWidth: '1000px', 
        margin: '0 auto' 
    },
    header: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        borderBottom: '1px solid #EAEAEA',
        paddingBottom: '20px',
        flexWrap: 'wrap',
        gap: '20px'
    },
    title: { 
        fontSize: '28px', 
        color: '#1A1A1A', 
        margin: '0 0 5px 0' 
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
        margin: 0
    },
    buttonContainer: { 
        display: 'flex', 
        gap: '12px' 
    },
    // Botões arredondados (pílula)
    btnPrimary: { 
        background: '#1976D2', 
        color: '#fff', 
        border: 'none', 
        padding: '10px 24px', 
        borderRadius: '50px', 
        cursor: 'pointer', 
        fontWeight: '600', 
        fontSize: '14px',
        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
    },
    btnSecondary: { 
        background: '#FFFFFF', 
        color: '#333', 
        border: '1px solid #CCC', 
        padding: '10px 24px', 
        borderRadius: '50px', 
        cursor: 'pointer', 
        fontWeight: '600', 
        fontSize: '14px' 
    },
    // Grid para alinhar os cards lado a lado
    grid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '24px' 
    },
    // Visual do Card Clean
    card: { 
        background: '#FFFFFF', 
        borderRadius: '16px', 
        padding: '24px', 
        border: '1px solid #EAEAEA', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    cardTitle: { 
        fontSize: '20px', 
        color: '#222', 
        margin: '0 0 16px 0',
        lineHeight: '1.3'
    },
    cardDate: { 
        fontSize: '14px', 
        color: '#555', 
        margin: '0 0 10px 0',
        display: 'flex',
        alignItems: 'center'
    },
    icon: {
        marginRight: '8px',
        fontSize: '16px'
    },
    cardActions: { 
        display: 'flex', 
        gap: '12px', 
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid #F0F0F0'
    },
    // Botões de ação mais discretos e arredondados
    btnEdit: { 
        flex: 1, 
        background: '#F0F7FF', 
        color: '#1976D2', 
        border: 'none', 
        padding: '10px', 
        borderRadius: '50px', 
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px'
    },
    btnDelete: { 
        flex: 1, 
        background: '#FFF0F0', 
        color: '#DC3545', 
        border: 'none', 
        padding: '10px', 
        borderRadius: '50px', 
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px'
    },
    // Visual para quando não há dados
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '2px dashed #E0E0E0'
    },
    loadingState: {
        textAlign: 'center',
        padding: '40px',
        color: '#666',
        fontSize: '16px'
    }
}

export default MeusEventos