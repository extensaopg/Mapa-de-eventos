import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { eventoIcon, standIcon, novoStandIcon } from '../utils/mapIcons'
import StandFormModal from '../components/StandFormModal' 

function MapClickHandler({ setMarcadorTemporario }) {
    useMapEvents({
        click(e) { setMarcadorTemporario(e.latlng) },
    })
    return null
}

export default function GerenciarStands() {
    const url_api = `${import.meta.env.VITE_API_URL}`
    const navigate = useNavigate()
    const { eventoId } = useParams()

    const [evento, setEvento] = useState(null)
    const [stands, setStands] = useState([])
    
    const [marcadorTemporario, setMarcadorTemporario] = useState(null)
    const [modalAberto, setModalAberto] = useState(false)
    const [standEmEdicao, setStandEmEdicao] = useState(null)

    // ESTADOS DO FORMULÁRIO ATUALIZADOS
    const [nome, setNome] = useState('')
    const [descricao, setDescricao] = useState('')
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')

    const markerTempRef = useRef(null)

    useEffect(() => {
        if (marcadorTemporario && markerTempRef.current) {
            setTimeout(() => {
                if (markerTempRef.current) markerTempRef.current.openPopup();
            }, 10);
        }
    }, [marcadorTemporario])

    useEffect(() => {
        const carregarDados = async () => {
                try {
                    const resEvento = await fetch(`${url_api}/eventos/${eventoId}`, { credentials: 'include' })
                    if (resEvento.ok) setEvento(await resEvento.json())
                    const resStands = await fetch(`${url_api}/stands/?eventoId=${eventoId}`, { credentials: 'include' })
                    if (resStands.ok) setStands(await resStands.json())
                } catch (error) {
                    console.error("Erro ao carregar dados da API:", error)
                }
            }
            carregarDados()
        }, [eventoId])

    const iniciarCriacaoStand = () => {
        setStandEmEdicao(null)
        setNome('')
        setDescricao('')
        setDataInicio(evento?.data_inicio ? evento.data_inicio.split('T')[0] : '')
        setDataFim(evento?.data_fim ? evento.data_fim.split('T')[0] : '')
        setModalAberto(true)
    }

    const iniciarEdicaoStand = (stand) => {
        setStandEmEdicao(stand)
        setNome(stand.nome || '') 
        setDescricao(stand.descricao)
        setDataInicio(stand.data_inicio.split('T')[0])
        setDataFim(stand.data_fim.split('T')[0])
        setMarcadorTemporario(null)
        setModalAberto(true)
    }

    const handleSalvarStand = async (e) => {
        e.preventDefault()

        const payload = {
            nome,
            descricao, 
            data_inicio: dataInicio, 
            data_fim: dataFim,
            eventoId: eventoId, 
            cor_icone: 'blue',
            latitude: standEmEdicao ? standEmEdicao.latitude : marcadorTemporario.lat,
            longitude: standEmEdicao ? standEmEdicao.longitude : marcadorTemporario.lng
        }

        try {
            const isEdicao = !!standEmEdicao
            const url = isEdicao ? `${url_api}/stands/${standEmEdicao._id}` : `${url_api}/stands`
            
            const res = await fetch(url, {
                method: isEdicao ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            })

            if (res.ok) {
                const resStand = await res.json()
                
                if (isEdicao) {
                    const standSalvo = await (await fetch(`${url_api}/stands/${standEmEdicao._id}`, { credentials: 'include' })).json()
                    setStands(stands.map(s => s._id === standSalvo._id ? standSalvo : s))
                } else {

                    const standSalvo = await (await fetch(`${url_api}/stands/${resStand.id}`, { credentials: 'include' })).json()
                    setStands([...stands, standSalvo])
                }

                alert(`Stand ${isEdicao ? 'atualizado' : 'criado'} com sucesso!`)
                setModalAberto(false)
                setMarcadorTemporario(null)
            } else {
                alert('Erro ao processar a requisição no backend.')
            }
        } catch (error) {
            console.error('Erro de conexão:', error)
        }
    }

    const handleExcluirStand = async (standId) => {
        if (!window.confirm('Tem certeza que deseja excluir este stand?')) return

        try {
            const res = await fetch(`${url_api}/stands/${standId}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (res.ok) {
                setStands(stands.filter(s => s._id !== standId))
                alert('Stand excluído com sucesso.')
            } else {
                alert('Falha ao excluir o stand no backend.')
            }
        } catch (error) {
            console.error('Erro de conexão:', error)
        }
    }

    if (!evento) return <div style={styles.loading}>Carregando mapa do evento...</div>

    return (
        <div style={styles.page}>
            <div style={styles.containerMap}>
                <header style={styles.headerAbsolute}>
                    <button onClick={() => navigate('/meus-eventos')} style={styles.backBtn}>← Finalizar e Voltar</button>
                    <div>
                        <h2 style={styles.title}>Alocação de Stands</h2>
                        <p style={styles.subtitle}>{evento.descricao}</p>
                    </div>
                </header>

                <MapContainer center={[evento.latitude, evento.longitude]} zoom={17} style={{ height: '100vh', width: '100%', zIndex: 0 }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    <MapClickHandler setMarcadorTemporario={setMarcadorTemporario} />

                    <Marker position={[evento.latitude, evento.longitude]} icon={eventoIcon}>
                        <Popup><strong>📍 Centro do Evento</strong><br/>Clique em áreas vazias para adicionar stands.</Popup>
                    </Marker>

                    {stands.map((stand) => (
                        <Marker key={stand._id} position={[stand.latitude, stand.longitude]} icon={standIcon}>
                            <Popup>
                                <div style={{ textAlign: 'center' }}>
                                    <strong style={{ fontSize: '15px' }}>{stand.nome}</strong>
                                    <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>{stand.descricao}</p>
                                    <div style={styles.btnActionGroup}>
                                        <button onClick={() => iniciarEdicaoStand(stand)} style={styles.editBtn}>Editar</button>
                                        <button onClick={() => handleExcluirStand(stand._id)} style={styles.deleteBtn}>Excluir</button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {marcadorTemporario && (
                        <Marker position={marcadorTemporario} icon={novoStandIcon} ref={markerTempRef}>
                            <Popup autoPan={true}>
                                <div style={{ textAlign: 'center' }}>
                                    <strong>Nova Posição Selecionada</strong><br />
                                    <button onClick={iniciarCriacaoStand} style={styles.createBtn}>➕ Criar stand aqui</button>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>

                <StandFormModal 
                    aberto={modalAberto}
                    fecharModal={() => setModalAberto(false)}
                    salvarStand={handleSalvarStand}
                    standEmEdicao={standEmEdicao}
                    nome={nome} setNome={setNome}                   // PASSANDO O NOVO ESTADO
                    descricao={descricao} setDescricao={setDescricao}
                    dataInicio={dataInicio} setDataInicio={setDataInicio}
                    dataFim={dataFim} setDataFim={setDataFim}
                />
            </div>
        </div>
    )
}

const styles = {
    page: { height: '100vh', width: '100%', backgroundColor: '#F4F6F8', fontFamily: '"Segoe UI", Roboto, Arial, sans-serif', overflow: 'hidden' },
    loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#555' },
    containerMap: { position: 'relative', height: '100%', width: '100%' },
    headerAbsolute: { position: 'absolute', top: '20px', left: '20px', right: '20px', zIndex: 1000, background: 'rgba(255, 255, 255, 0.95)', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', backdropFilter: 'blur(4px)' },
    backBtn: { background: '#F0F7FF', color: '#1976D2', border: '1px solid #1976D2', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginRight: '24px' },
    title: { fontSize: '20px', color: '#1A1A1A', margin: '0 0 4px 0' },
    subtitle: { fontSize: '14px', color: '#666', margin: 0 },
    btnActionGroup: { display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'center' },
    editBtn: { padding: '6px 12px', background: '#F0F7FF', color: '#1976D2', border: '1px solid #1976D2', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    deleteBtn: { padding: '6px 12px', background: '#FFF0F0', color: '#D32F2F', border: '1px solid #D32F2F', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    createBtn: { padding: '8px 16px', background: '#2E7D32', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px', width: '100%' },
}