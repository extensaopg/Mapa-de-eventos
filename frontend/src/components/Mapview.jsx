import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

import 'leaflet/dist/leaflet.css'

import { buscarEventos } from '../services/eventosService'
import { buscarStands } from '../services/standsService' 

import { eventoIcon, standIcon } from '../utils/mapIcons';
import TracarRotaApe from './TracarRotaApe';
import StandModal from './StandModal';
import SearchEventMap from './SearchEventMap';


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

function ChangeView({ center, zoom }) {
    const map = useMap()

    useEffect(() => {
        if (center) {
            map.setView(center, zoom)
        }
    }, [center, zoom, map])

    return null
}

function AjusteDeCameraStands({ standsVisiveis }) {
    const map = useMap()

    useEffect(() => {
        if (standsVisiveis.length > 0) {
            const bounds = L.latLngBounds([])
            standsVisiveis.forEach((stand) => {
                bounds.extend([stand.latitude, stand.longitude])
            })
            map.fitBounds(bounds, { padding: [50, 50] })
        }
    }, [standsVisiveis, map])

    return null
}

function MapView() {
    const [position, setPosition] = useState(null)
    const [eventos, setEventos] = useState([])
    const [stands, setStands] = useState([])
    const [eventoAtivoId, setEventoAtivoId] = useState(null)

    const [destinoRota, setDestinoRota] = useState(null);
    const [standSelecionado, setStandSelecionado] = useState(null);

    const [buscaAberta, setBuscaAberta] = useState(false);
    const [termoBusca, setTermoBusca] = useState('');

    useEffect(() => {
        async function load() {
            try {
                setEventos(await buscarEventos());
                setStands(await buscarStands());
            } catch (error) {
                console.error("Erro ao buscar dados da API:", error);
            }
        }
        
        load();
    }, []);

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setPosition([
                    pos.coords.latitude,
                    pos.coords.longitude,
                ]);
            },
            (err) => console.error("Erro de GPS:", err),
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);


    const standsVisiveis = stands.filter((stand) => stand.eventoId === eventoAtivoId)
    const eventosFiltrados = eventos.filter(evento => 
        evento.descricao?.toLowerCase().includes(termoBusca.toLowerCase())
    );

    if (!position) return <p>Obtendo localização...</p>
    const estiloBotaoPrincipal = {
    padding: '6px 10px',
    background: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%', // Ajuda a alinhar botões em popups
    marginTop: '5px'
    };

    const estiloBotaoSecundario = {
        padding: '6px 10px',
        background: '#ffffff',
        color: '#1976d2',
        border: '1px solid #1976d2',
        borderRadius: '6px',
        cursor: 'pointer',
        width: '100%',
        marginTop: '5px'
    };

    const handleTraçarRotaApe = (stand) => {
        if (!position) {
            alert("Aguarde, ainda estamos buscando sua localização exata.");
            return;
        }
        const userLatLng = L.latLng(position[0], position[1]);
        const standLatLng = L.latLng(stand.latitude, stand.longitude);

        const distanciaEmMetros = userLatLng.distanceTo(standLatLng);


        if (distanciaEmMetros > 1000) {
            const distanciaEmKm = (distanciaEmMetros / 1000).toFixed(1);
            
            alert(`📍 Stand muito distante!\n\nEste stand está a aproximadamente ${distanciaEmKm} km de você.`);

            return; 
        }
        
        setDestinoRota([stand.latitude, stand.longitude]);
    }

    return (
        <div style={{ position: 'relative', height: '100vh', width: '100%' }}>

        <SearchEventMap 
            eventos={eventos} 
            onSelectEvento={(evento) => {

                setPosition([evento.latitude, evento.longitude]);
                setEventoAtivoId(evento.id || evento._id);
                setDestinoRota(null);
            }}
        />

        <StandModal 
            stand={standSelecionado} 
            onClose={() => setStandSelecionado(null)} 
            onTracarRota={(coordenadas) => {
                setDestinoRota(coordenadas);
                setStandSelecionado(null);
            }} 
        />
        <MapContainer
            center={position}
            zoom={13}
            style={{ height: '100vh', width: '100%' }}
        >
            <ChangeView center={position} zoom={13} />
            
            <AjusteDeCameraStands standsVisiveis={standsVisiveis} />
            
            <TracarRotaApe origem={position} destino={destinoRota}/>
            <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* usuário */}
            <Marker position={position}>
                <Popup>Você está aqui</Popup>
            </Marker>

            {/* eventos */}
            {eventos.map((evento) => 
            (
                
                <Marker
                    key={evento.id || evento._id}
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
                                const idDoEvento = evento.id || evento._id;
                                console.log("Teste de clique")
                                setEventoAtivoId(idDoEvento);
                                setDestinoRota(null);
                            }}
                            style= {estiloBotaoPrincipal}
                        >
                            Ver stands desse evento
                        </button>
                    </Popup>
                </Marker>
            ))}

            {standsVisiveis.map((stand) => (
                <Marker
                    key={stand.id || stand._id}
                    position={[
                        stand.latitude,
                        stand.longitude,
                    ]}
                    icon={standIcon}
                >
                    <Popup>
                            <div style={{ textAlign: 'center' }}>
                                <p><strong>{stand.descricao}</strong></p>
                                <button onClick={(e) => { e.stopPropagation(); setStandSelecionado(stand); }} style={estiloBotaoPrincipal}>
                                    Ver mais detalhes
                                </button>
                                <button onClick={() => handleTraçarRotaApe(stand)} style={estiloBotaoSecundario}>
                                    Ir até o stand
                                </button>
                            </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
        </div>
    )
}

export default MapView