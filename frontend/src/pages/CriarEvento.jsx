import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function LocationMarker({ position, setPosition }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng)
        },
    })

    useEffect(() => {
        if (position) {
            map.flyTo(position, 15)
        }
    }, [position, map])

    return position === null ? null : <Marker position={position}></Marker>
}

function CriarEvento() {
    const navigate = useNavigate()
    const [descricao, setDescricao] = useState('')
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')
    
    const [posicao, setPosicao] = useState(null)
    const [enderecoBusca, setEnderecoBusca] = useState('')
    const [sugestoes, setSugestoes] = useState([])
    const [buscando, setBuscando] = useState(false)

    useEffect(() => {
        fetch('http://localhost:3000/usuarios/me', { credentials: 'include' })
            .then(res => {
                if (res.status === 401) navigate('/login')
            })
    }, [navigate])

    useEffect(() => {
        const buscarSugestoesNaApi = async (query) => {
            setBuscando(true)
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
                const data = await response.json()
                setSugestoes(data)
            } catch (error) {
                console.error('Erro na busca:', error)
            } finally {
                setBuscando(false)
            }
        }

        const timer = setTimeout(() => {
            if (enderecoBusca.length > 3) {
                buscarSugestoesNaApi(enderecoBusca)
            } else {
                setSugestoes([])
            }
        }, 800)

        return () => clearTimeout(timer)
    }, [enderecoBusca])

    const selecionarEndereco = (item) => {
        const lat = parseFloat(item.lat)
        const lng = parseFloat(item.lon)
        
        setPosicao({ lat, lng })
        setEnderecoBusca(item.display_name)
        setSugestoes([])
    }

    // ALTERAÇÃO 1: A função de submit agora recebe a decisão de qual botão foi clicado
    const handleSalvarEvento = async (irParaStands) => {
        if (!posicao) {
            alert('Por favor, selecione a localização no mapa ou na lista.')
            return
        }

        const novoEvento = {
            descricao,
            data_inicio: dataInicio,
            data_fim: dataFim,
            latitude: posicao.lat,
            longitude: posicao.lng
        }

        try {
            const res = await fetch('http://localhost:3000/eventos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoEvento),
                credentials: 'include'
            })

            if (res.ok) {
                // Como precisamos do ID para redirecionar para a criação de stands, 
                // assumimos que o backend retorna o objeto recém-criado em JSON.
                const eventoCriado = await res.json()
                
                alert('Evento criado com sucesso!')
                
                // ALTERAÇÃO 2: Lógica de redirecionamento duplo
                if (irParaStands) {
                    // Ajuste a rota abaixo para o caminho real da sua tela de criar stands
                    navigate(`/eventos/${eventoCriado._id || eventoCriado.id}/stands/novo`) 
                } else {
                    navigate('/meus-eventos')
                }
                
            } else {
                alert('Erro ao criar evento.')
            }
        } catch (error) {
            console.error('Erro:', error)
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <header style={styles.header}>
                    <button onClick={() => navigate('/meus-eventos')} style={styles.backBtn}>← Voltar</button>
                    <h2 style={styles.title}>Criar Novo Evento</h2>
                </header>
                
                {/* O onSumbit nativo foi removido e trocado por event handlers nos botões para evitar recarregamento não planejado */}
                <form style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Descrição do Evento</label>
                        <input type="text" placeholder="Ex: Feira de Ciências" required value={descricao} onChange={e => setDescricao(e.target.value)} style={styles.input} />
                    </div>

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Data de Início</label>
                            <input type="date" required value={dataInicio} onChange={e => setDataInicio(e.target.value)} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Data de Fim</label>
                            <input type="date" required value={dataFim} onChange={e => setDataFim(e.target.value)} style={styles.input} />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Buscar Endereço</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type="text" 
                                placeholder="Digite a rua, cidade ou local e aguarde..." 
                                value={enderecoBusca} 
                                onChange={e => {
                                    setEnderecoBusca(e.target.value)
                                    if (posicao) setPosicao(null) 
                                }} 
                                style={styles.input} 
                            />
                            {buscando && <small style={styles.loadingText}>Buscando...</small>}
                            {sugestoes.length > 0 && (
                                <ul style={styles.dropdown}>
                                    {sugestoes.map((item, index) => (
                                        <li key={index} style={styles.dropdownItem} onClick={() => selecionarEndereco(item)}>
                                            {item.display_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Localização Exata no Mapa</label>
                        <div style={styles.mapWrapper}>
                            <MapContainer center={[-11.663, -38.976]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                                <LocationMarker position={posicao} setPosition={setPosicao} />
                            </MapContainer>
                        </div>
                    </div>

                    {/* ALTERAÇÃO 3: Os botões de submissão dispostos lado a lado */}
                    <div style={styles.btnContainer}>
                        <button 
                            type="button" 
                            onClick={() => handleSalvarEvento(false)} 
                            style={styles.submitBtnSecondary}
                        >
                            Salvar evento
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => handleSalvarEvento(true)} 
                            style={styles.submitBtnPrimary}
                        >
                            Salvar evento & criar stands
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const styles = {
    page: { minHeight: '100vh', backgroundColor: '#F4F6F8', padding: '40px 20px', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
    container: { maxWidth: '700px', margin: '0 auto', background: '#FFFFFF', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
    header: { display: 'flex', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #EAEAEA' },
    backBtn: { background: '#F0F7FF', color: '#1976D2', border: 'none', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginRight: '16px' },
    title: { fontSize: '24px', color: '#1A1A1A', margin: 0 },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' },
    row: { display: 'flex', gap: '16px' },
    label: { fontSize: '14px', fontWeight: '600', color: '#444' },
    input: { padding: '12px 16px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '15px', outline: 'none', width: '100%', boxSizing: 'border-box', backgroundColor: '#FAFAFA' },
    mapWrapper: { height: '350px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #EAEAEA', zIndex: 0 },
    loadingText: { position: 'absolute', right: '12px', top: '14px', color: '#888', fontSize: '13px' },
    dropdown: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #EAEAEA', borderTop: 'none', borderRadius: '0 0 12px 12px', maxHeight: '200px', overflowY: 'auto', listStyle: 'none', padding: 0, margin: 0, zIndex: 1000, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' },
    dropdownItem: { padding: '12px 16px', borderBottom: '1px solid #F4F6F8', cursor: 'pointer', fontSize: '14px', color: '#333' },
    
    // NOVOS ESTILOS PARA OS BOTÕES
    btnContainer: { display: 'flex', gap: '16px', marginTop: '10px' },
    submitBtnPrimary: { flex: 1, background: '#1976D2', color: '#fff', border: 'none', padding: '14px', borderRadius: '50px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)' },
    submitBtnSecondary: { flex: 1, background: '#F0F7FF', color: '#1976D2', border: '1px solid #1976D2', padding: '14px', borderRadius: '50px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
}

export default CriarEvento