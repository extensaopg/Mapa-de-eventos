import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

import 'leaflet/dist/leaflet.css'

// Corrige ícone do marcador no Vite
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function MapView() {
    const [position, setPosition] = useState(null)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude
                const lng = pos.coords.longitude

                setPosition([lat, lng])
            },
            (err) => {
                console.error('Erro ao obter localização:', err)
            }
        )
    }, [])

    // Enquanto não pega localização
    if (!position) {
        return <p>Obtendo localização...</p>
    }

    return (
        <MapContainer
            center={position}
            zoom={15}
            style={{ height: '100vh', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />

            <Marker position={position}>
                <Popup>Você está aqui</Popup>
            </Marker>
        </MapContainer>
    )
}

export default MapView