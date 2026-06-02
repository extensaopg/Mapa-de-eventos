import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { usuariosService } from '../services/usuariosService'
import { eventosService } from '../services/eventosService'
import '../styles/eventoForm.css'

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) { setPosition(e.latlng) },
  })

  useEffect(() => {
    if (position) map.flyTo(position, 15)
  }, [position, map])

  return position === null ? null : <Marker position={position} />
}

function CriarEvento() {
  const navigate = useNavigate()
  const [descricao, setDescricao] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [colaboradores, setColaboradores] = useState([])
  const [posicao, setPosicao] = useState(null)
  const [enderecoBusca, setEnderecoBusca] = useState('')
  const [sugestoes, setSugestoes] = useState([])
  const [buscando, setBuscando] = useState(false)

  useEffect(() => {
    usuariosService.me().then((res) => { if (res.status === 401) navigate('/login') })
  }, [navigate])

  useEffect(() => {
    const buscar = async (query) => {
      setBuscando(true)
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
        setSugestoes(await res.json())
      } catch { /* ignora */ }
      finally { setBuscando(false) }
    }

    const timer = setTimeout(() => {
      if (enderecoBusca.length > 3) buscar(enderecoBusca)
      else setSugestoes([])
    }, 800)

    return () => clearTimeout(timer)
  }, [enderecoBusca])

  const selecionarEndereco = (item) => {
    setPosicao({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) })
    setEnderecoBusca(item.display_name)
    setSugestoes([])
  }

  const adicionarColaborador = (e) => {
    e.preventDefault()
    if (!emailInput) return
    if (colaboradores.includes(emailInput)) { alert('Este e-mail já está na lista.'); return }
    setColaboradores([...colaboradores, emailInput])
    setEmailInput('')
  }

  const removerColaborador = (email) => setColaboradores(colaboradores.filter((c) => c !== email))

  const handleSalvar = async (irParaStands) => {
    if (!posicao) { alert('Por favor, selecione a localização no mapa.'); return }

    try {
      const res = await eventosService.criar({
        descricao,
        data_inicio: dataInicio,
        data_fim: dataFim,
        latitude: posicao.lat,
        longitude: posicao.lng,
        colaboradores,
      })

      if (res.ok) {
        const criado = await res.json()
        let msg = criado.message || 'Evento criado com sucesso!'
        if (criado.emailsNaoEncontrados?.length > 0) {
          msg += `\n\n⚠️ E-mails não encontrados:\n- ${criado.emailsNaoEncontrados.join('\n- ')}`
        }
        alert(msg)
        irParaStands ? navigate(`/eventos/${criado._id || criado.id}/stands`) : navigate('/meus-eventos')
      } else {
        alert('Erro ao criar evento.')
      }
    } catch (err) {
      console.error('Erro:', err)
    }
  }

  return (
    <div className="evento-form-page">
      <div className="evento-form-container">
        <header className="evento-form-header">
          <button onClick={() => navigate('/meus-eventos')} className="btn-back">← Voltar</button>
          <h2 className="evento-form-header__title">Criar Novo Evento</h2>
        </header>

        <form className="evento-form">
          <div className="form-group">
            <label className="form-label">Descrição do Evento</label>
            <input type="text" placeholder="Ex: Feira de Ciências" required value={descricao} onChange={(e) => setDescricao(e.target.value)} className="form-input" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Data de Início</label>
              <input type="date" required value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Data de Fim</label>
              <input type="date" required value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Adicionar Colaboradores (Opcional)</label>
            <div className="form-collab-row">
              <input type="email" placeholder="E-mail do usuário cadastrado" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="form-input" />
              <button onClick={adicionarColaborador} className="form-add-btn">Adicionar</button>
            </div>
            {colaboradores.length > 0 && (
              <div className="form-pill-list">
                {colaboradores.map((email, i) => (
                  <div key={i} className="form-pill">
                    {email}
                    <button type="button" onClick={() => removerColaborador(email)} className="form-pill__remove">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Buscar Endereço</label>
            <div className="form-search-wrapper">
              <input type="text" placeholder="Digite a rua, cidade ou local e aguarde..." value={enderecoBusca} onChange={(e) => { setEnderecoBusca(e.target.value); if (posicao) setPosicao(null) }} className="form-input" />
              {buscando && <small className="form-search-loading">Buscando...</small>}
              {sugestoes.length > 0 && (
                <ul className="form-dropdown">
                  {sugestoes.map((item, i) => (
                    <li key={i} className="form-dropdown__item" onClick={() => selecionarEndereco(item)}>{item.display_name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Localização Exata no Mapa</label>
            <div className="form-map-wrapper">
              <MapContainer center={[-11.663, -38.976]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                <LocationMarker position={posicao} setPosition={setPosicao} />
              </MapContainer>
            </div>
          </div>

          <div className="form-btn-container">
            <button type="button" onClick={() => handleSalvar(false)} className="form-submit-secondary">Salvar evento</button>
            <button type="button" onClick={() => handleSalvar(true)} className="form-submit-primary">Salvar evento & criar stands</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CriarEvento
