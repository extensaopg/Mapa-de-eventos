import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

import 'leaflet/dist/leaflet.css'

import { buscarEventos } from '../services/eventosService'
// fix icon
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const eventoIcon = new L.Icon({
    iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

function ChangeView({ center, zoom }) {
    const map = useMap()

    useEffect(() => {
        if (center) {
            map.setView(center, zoom)
        }
    }, [center, zoom])

    return null
}

function MapView() {
    const [position, setPosition] = useState(null)
    const [eventos, setEventos] = useState([])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition([
                    pos.coords.latitude,
                    pos.coords.longitude,
                ])
            },
            (err) => console.error(err)
        )
    }, [])

    useEffect(() => {
        async function load() {
            const data = await buscarEventos()
            setEventos(data)
        }

        load()
    }, [])

    if (!position) return <p>Obtendo localização...</p>

    return (
        <MapContainer
            center={position}
            zoom={13}
            style={{ height: '100vh', width: '100%' }}
        >
            <ChangeView center={position} zoom={13} />

            <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* usuário */}
            <Marker position={position}>
                <Popup>Você está aqui</Popup>
            </Marker>

            {/* eventos */}
            {eventos.map((evento) => (
                <Marker
                    key={evento.id}
                    position={[
                        evento.latitude,
                        evento.longitude,
                    ]}
                    icon={eventoIcon}
                >
                    <Popup>
                        <strong>{evento.descricao}</strong>
                        <br />
                        Início: {new Date(evento.data_inicio).toLocaleDateString('pt-BR')}
                        <br />
                        Fim: {new Date(evento.data_fim).toLocaleDateString('pt-BR')}
                        <br />
                        <br />

                        <button
                            onClick={() => {
                                console.log('Evento selecionado:', evento.id)
                            }}
                            style={{
                                padding: '6px 10px',
                                background: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                            }}
                        >
                            Ver stands desse evento
                        </button>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>

    )
}

export default MapView