import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Sub-componente para mover a câmera e colocar o pino
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
    
    // Estados do Mapa e Busca
    const [posicao, setPosicao] = useState(null)
    const [enderecoBusca, setEnderecoBusca] = useState('')
    const [sugestoes, setSugestoes] = useState([])
    const [buscando, setBuscando] = useState(false)

    // Verificação de Login
    useEffect(() => {
        fetch('http://localhost:3000/usuarios/me', { credentials: 'include' })
            .then(res => {
                if (res.status === 401) navigate('/login')
            })
    }, [navigate])

    // Efeito Debounce: Observa o que o usuário digita e busca após ele parar por 800ms
    useEffect(() => {
        // Função declarada internamente para resolver o aviso do ESLint
        const buscarSugestoesNaApi = async (query) => {
            setBuscando(true)
            try {
                // Limitamos a 5 resultados para não poluir a tela
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
                setSugestoes([]) // Limpa a lista se tiver menos de 3 letras
            }
        }, 800)

        return () => clearTimeout(timer) // Cancela o timer se o usuário voltar a digitar
    }, [enderecoBusca])

    const selecionarEndereco = (item) => {
        const lat = parseFloat(item.lat)
        const lng = parseFloat(item.lon)
        
        setPosicao({ lat, lng })
        setEnderecoBusca(item.display_name) // Preenche o input com o nome completo
        setSugestoes([]) // Fecha o dropdown
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

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
                alert('Evento criado com sucesso!')
                navigate('/meus-eventos')
            } else {
                alert('Erro ao criar evento.')
            }
        } catch (error) {
            console.error('Erro:', error)
        }
    }

    return (
        <div style={styles.container}>
            <button onClick={() => navigate('/meus-eventos')} style={styles.backBtn}>← Voltar</button>
            <h2>Criar Novo Evento</h2>
            
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label>Descrição do Evento:</label>
                    <input type="text" required value={descricao} onChange={e => setDescricao(e.target.value)} style={styles.input} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={styles.inputGroup}>
                        <label>Data de Início:</label>
                        <input type="date" required value={dataInicio} onChange={e => setDataInicio(e.target.value)} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Data de Fim:</label>
                        <input type="date" required value={dataFim} onChange={e => setDataFim(e.target.value)} style={styles.input} />
                    </div>
                </div>

                {/* Bloco de Busca com Auto-complete */}
                <div style={styles.inputGroup}>
                    <label>Buscar Endereço:</label>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type="text" 
                            placeholder="Digite o endereço e aguarde..." 
                            value={enderecoBusca} 
                            onChange={e => {
                                setEnderecoBusca(e.target.value)
                                // Se o usuário apagar o texto e for uma nova busca, remove o pino atual
                                if (posicao) setPosicao(null) 
                            }} 
                            style={{ ...styles.input, width: '100%', boxSizing: 'border-box' }} 
                        />
                        
                        {/* Indicador de carregamento */}
                        {buscando && <small style={styles.loadingText}>Buscando...</small>}

                        {/* Dropdown de Resultados */}
                        {sugestoes.length > 0 && (
                            <ul style={styles.dropdown}>
                                {sugestoes.map((item, index) => (
                                    <li 
                                        key={index} 
                                        style={styles.dropdownItem}
                                        onClick={() => selecionarEndereco(item)}
                                    >
                                        {item.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div style={styles.inputGroup}>
                    <label>Localização (Verifique ou ajuste clicando no mapa):</label>
                    <div style={styles.mapWrapper}>
                        <MapContainer center={[-11.663, -38.976]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            <LocationMarker position={posicao} setPosition={setPosicao} />
                        </MapContainer>
                    </div>
                </div>

                <button type="submit" style={styles.submitBtn}>Salvar Evento</button>
            </form>
        </div>
    )
}

const styles = {
    container: { padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' },
    backBtn: { background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', marginBottom: '10px', fontSize: '16px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column', flex: 1 },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' },
    mapWrapper: { height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' },
    submitBtn: { background: '#28a745', color: '#fff', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' },
    
    // Estilos para o Dropdown
    loadingText: { position: 'absolute', right: '10px', top: '12px', color: '#888' },
    dropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderTop: 'none',
        borderRadius: '0 0 8px 8px',
        maxHeight: '200px',
        overflowY: 'auto',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        zIndex: 1000, 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    dropdownItem: {
        padding: '10px',
        borderBottom: '1px solid #eee',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#333'
    }
}

export default CriarEvento