import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

export default function TracarRotaApe({ origem, destino }) {
    const map = useMap();

    useEffect(() => {
        if (!origem || !destino) {
            return;
        }

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(origem[0], origem[1]),
                L.latLng(destino[0], destino[1])
            ],
            
            // CORREÇÃO 1: Usar o servidor público do OSM voltado para pedestres
            router: L.Routing.osrmv1({
                serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1',
                profile: 'foot'
            }),

            // CORREÇÃO 2: Impede a biblioteca de criar marcadores extras (já temos os nossos)
            createMarker: function() { return null; },
            
            lineOptions: { styles: [{ color: '#1976d2', weight: 5, opacity: 0.7 }] },
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false
        }).addTo(map);

        return () => {
            // Garante que a rota seja limpa corretamente ao trocar de destino
            if (map && routingControl) {
                map.removeControl(routingControl);
            }
        };
    }, [origem, destino, map]);

    return null;
}