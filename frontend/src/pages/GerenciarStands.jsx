import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { eventoIcon, standIcon, novoStandIcon } from '../utils/mapIcons'
import StandFormModal from '../components/StandFormModal' // Ajuste o caminho conforme sua pasta

function MapClickHandler({ setMarcadorTemporario }) {
    useMapEvents({
        click(e) { setMarcadorTemporario(e.latlng) },
    })
    return null
}

export default function GerenciarStands() {
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

    // --- MOCK DO CARREGAMENTO INICIAL ---
    useEffect(() => {
        // Simulando um delay de rede de 500ms
        setTimeout(() => {
            // Fake Evento
            setEvento({
                _id: eventoId || '123',
                descricao: 'Feira de Ciências e Tecnologia (Modo Teste)',
                latitude: -11.663, 
                longitude: -38.976,
                data_inicio: '2026-10-10T00:00:00Z',
                data_fim: '2026-10-12T00:00:00Z'
            });

            // Fake Stands já existentes
            setStands([
                {
                    _id: 'stand-fake-1',
                    nome: 'Robótica Aplicada',
                    descricao: 'Apresentação de braços robóticos construídos pelos alunos.',
                    data_inicio: '2026-10-10T00:00:00Z',
                    data_fim: '2026-10-12T00:00:00Z',
                    latitude: -11.6635,
                    longitude: -38.9765
                }
            ]);
        }, 500);
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
        setNome(stand.nome || '') // Carrega o nome
        setDescricao(stand.descricao)
        setDataInicio(stand.data_inicio.split('T')[0])
        setDataFim(stand.data_fim.split('T')[0])
        setMarcadorTemporario(null)
        setModalAberto(true)
    }

    // --- MOCK DO SALVAMENTO (CREATE / UPDATE) ---
    const handleSalvarStand = (e) => {
        e.preventDefault()

        const payloadQueIriaProBackend = {
            nome,
            descricao, 
            data_inicio: dataInicio, 
            data_fim: dataFim,
            eventoId: eventoId || '123', 
            cor_icone: 'blue',
            latitude: standEmEdicao ? standEmEdicao.latitude : marcadorTemporario.lat,
            longitude: standEmEdicao ? standEmEdicao.longitude : marcadorTemporario.lng
        }

        // LOG PARA VOCÊ INSPECIONAR: Isso é o que a sua API vai receber!
        console.log("🚀 Payload pronto para ser enviado:", payloadQueIriaProBackend);

        const isEdicao = !!standEmEdicao

        // Simula o objeto que a API devolveria (adicionando um _id falso)
        const standSalvo = {
            ...payloadQueIriaProBackend,
            _id: isEdicao ? standEmEdicao._id : `novo-stand-${Date.now()}`
        }

        if (isEdicao) {
            setStands(stands.map(s => s._id === standSalvo._id ? standSalvo : s))
        } else {
            setStands([...stands, standSalvo])
        }

        alert(`[TESTE] Stand ${isEdicao ? 'atualizado' : 'criado'} com sucesso no modo local!`)
        setModalAberto(false)
        setMarcadorTemporario(null)
    }

    // --- MOCK DA EXCLUSÃO ---
    const handleExcluirStand = (standId) => {
        if (!window.confirm('Tem certeza que deseja excluir este stand?')) return
        
        console.log(`🗑️ Requisição DELETE seria enviada para /stands/${standId}`);
        
        // Remove visualmente
        setStands(stands.filter(s => s._id !== standId))
        alert('[TESTE] Stand excluído localmente.')
    }

    if (!evento) return <div style={styles.loading}>Carregando mapa do evento...</div>

    return (
        <div style={styles.page}>
            <div style={styles.containerMap}>
                <header style={styles.headerAbsolute}>
                    <button onClick={() => navigate('/meus-eventos')} style={styles.backBtn}>← Finalizar e Voltar</button>
                    <div>
                        <h2 style={styles.title}>Alocação de Stands (Modo de Teste)</h2>
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