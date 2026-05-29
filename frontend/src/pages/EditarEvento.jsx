import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

function EditarEvento() {
    const { id } = useParams()
    const navigate = useNavigate()
    
    const [descricao, setDescricao] = useState('')
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')
    const [posicao, setPosicao] = useState(null)
    const [loading, setLoading] = useState(true)
    
    const [emailInput, setEmailInput] = useState('')
    const [colaboradores, setColaboradores] = useState([])
    const [meuEmail, setMeuEmail] = useState('')

    const [enderecoBusca, setEnderecoBusca] = useState('')
    const [sugestoes, setSugestoes] = useState([])
    const [buscando, setBuscando] = useState(false)

    useEffect(() => {
        fetch('http://localhost:3000/usuarios/me', { credentials: 'include' })
            .then(res => {
                if (res.status === 401) navigate('/login')
                return res.json()
            })
            .then(data => { if(data) setMeuEmail(data.email) })
    }, [navigate])

    useEffect(() => {
        const fetchEvento = async () => {
            try {
                const res = await fetch(`http://localhost:3000/eventos/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    setDescricao(data.descricao)
                    setDataInicio(data.data_inicio.split('T')[0])
                    setDataFim(data.data_fim.split('T')[0])
                    setPosicao({ lat: data.latitude, lng: data.longitude })
                    
                    if (data.administradores && meuEmail) {
                        const listaEmails = data.administradores
                            .filter(admin => admin.email !== meuEmail)
                            .map(admin => admin.email)
                        setColaboradores(listaEmails)
                    }

                    setLoading(false)
                } else {
                    alert('Evento não encontrado.')
                    navigate('/meus-eventos')
                }
            } catch (error) {
                console.error('Erro ao buscar evento:', error)
                alert('Erro de conexão.')
                navigate('/meus-eventos')
            }
        }
        if (meuEmail) fetchEvento()
    }, [id, navigate, meuEmail])

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

    const adicionarColaborador = (e) => {
        e.preventDefault()
        if (!emailInput) return
        if (emailInput === meuEmail) return alert('Você já é administrador deste evento.')
        if (colaboradores.includes(emailInput)) return alert('Este e-mail já está na lista.')
        
        setColaboradores([...colaboradores, emailInput])
        setEmailInput('')
    }

    const removerColaborador = (emailParaRemover) => {
        setColaboradores(colaboradores.filter(email => email !== emailParaRemover))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!posicao) {
            alert('Por favor, selecione a localização no mapa ou na lista.')
            return
        }

        const eventoAtualizado = {
            descricao,
            data_inicio: dataInicio,
            data_fim: dataFim,
            latitude: posicao.lat,
            longitude: posicao.lng,
            colaboradores
        }

        try {
            const res = await fetch(`http://localhost:3000/eventos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventoAtualizado),
                credentials: 'include'
            })

            if (res.ok) {
                const data = await res.json()
                let mensagemFinal = data.message || 'Evento atualizado com sucesso!'
                
                if (data.emailsNaoEncontrados && data.emailsNaoEncontrados.length > 0) {
                    mensagemFinal += `\n\n⚠️ AVISO: Os seguintes e-mails não possuem conta cadastrada e não foram adicionados:\n- ${data.emailsNaoEncontrados.join('\n- ')}`
                }
                
                alert(mensagemFinal)
                navigate('/meus-eventos')
            } else {
                alert('Erro ao atualizar evento.')
            }
        } catch (error) {
            console.error('Erro:', error)
        }
    }

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F6F8' }}>Carregando dados do evento...</div>
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <header style={styles.header}>
                    <button onClick={() => navigate('/meus-eventos')} style={styles.backBtn}>← Voltar</button>
                    <h2 style={styles.title}>Editar Evento</h2>
                </header>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Descrição do Evento</label>
                        <input type="text" required value={descricao} onChange={e => setDescricao(e.target.value)} style={styles.input} />
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
                        <label style={styles.label}>Gerenciar Colaboradores</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                type="email" 
                                placeholder="E-mail do usuário cadastrado" 
                                value={emailInput} 
                                onChange={e => setEmailInput(e.target.value)} 
                                style={styles.input} 
                            />
                            <button onClick={adicionarColaborador} style={styles.addBtn}>Adicionar</button>
                        </div>
                        
                        {colaboradores.length > 0 && (
                            <div style={styles.pillContainer}>
                                {colaboradores.map((email, index) => (
                                    <div key={index} style={styles.pill}>
                                        {email}
                                        <button type="button" onClick={() => removerColaborador(email)} style={styles.pillRemove}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Buscar Novo Endereço (Opcional)</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type="text" 
                                placeholder="Digite para alterar o endereço atual..." 
                                value={enderecoBusca} 
                                onChange={e => setEnderecoBusca(e.target.value)} 
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
                            <MapContainer center={[posicao.lat, posicao.lng]} zoom={15} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                                <LocationMarker position={posicao} setPosition={setPosicao} />
                            </MapContainer>
                        </div>
                    </div>

                    <button type="submit" style={styles.submitBtn}>Salvar Alterações</button>
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
    submitBtn: { background: '#F59E0B', color: '#FFF', border: 'none', padding: '14px', borderRadius: '50px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)' },
    loadingText: { position: 'absolute', right: '12px', top: '14px', color: '#888', fontSize: '13px' },
    dropdown: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #EAEAEA', borderTop: 'none', borderRadius: '0 0 12px 12px', maxHeight: '200px', overflowY: 'auto', listStyle: 'none', padding: 0, margin: 0, zIndex: 1000, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' },
    dropdownItem: { padding: '12px 16px', borderBottom: '1px solid #F4F6F8', cursor: 'pointer', fontSize: '14px', color: '#333' },
    
    // Estilos do Colaborador
    addBtn: { background: '#EAEAEA', color: '#333', border: 'none', padding: '0 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    pillContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' },
    pill: { background: '#E3F2FD', color: '#1976D2', padding: '6px 12px', borderRadius: '50px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' },
    pillRemove: { background: 'none', border: 'none', color: '#1976D2', cursor: 'pointer', fontSize: '16px', padding: 0, lineHeight: 1 }
}

export default EditarEvento