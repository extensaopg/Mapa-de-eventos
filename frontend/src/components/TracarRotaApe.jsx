import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

export default function TracarRotaApe({ origem, destino }) {
    const map = useMap();
    const routingRef = useRef(null);

    const INTERVALO_ATUALIZACAO = 30000; // 👈 fácil mudar aqui

    useEffect(() => {
        if (!origem || !destino) return;

        if (routingRef.current) {
            map.removeControl(routingRef.current);
        }

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(origem[0], origem[1]),
                L.latLng(destino[0], destino[1])
            ],

            router: L.Routing.osrmv1({
                serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1',
                profile: 'foot'
            }),

            createMarker: () => null,
            lineOptions: { styles: [{ color: '#1976d2', weight: 5, opacity: 0.7 }] },
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false
        });

        routingControl.addTo(map);
        routingRef.current = routingControl;

        return () => {
            if (routingRef.current) {
                map.removeControl(routingRef.current);
                routingRef.current = null;
            }
        };
    }, [origem, destino, map]);

    // 2. atualiza rota sem recriar control
    useEffect(() => {
        if (!routingRef.current || !origem || !destino) return;

        const interval = setInterval(() => {
            routingRef.current.setWaypoints([
                L.latLng(origem[0], origem[1]),
                L.latLng(destino[0], destino[1])
            ]);
        }, INTERVALO_ATUALIZACAO);

        return () => clearInterval(interval);
    }, [origem, destino]);

    return null;
}