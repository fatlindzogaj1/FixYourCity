import maplibregl from 'maplibre-gl';
import type { Map, Marker, StyleSpecification } from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

const streetStyle: StyleSpecification = {
    version: 8,
    sources: {
        streets: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
        },
    },
    layers: [
        {
            id: 'streets',
            type: 'raster',
            source: 'streets',
        },
    ],
} as const;

type Props = {
    latitude: number | null;
    longitude: number | null;
    onChange: (coords: { latitude: number; longitude: number }) => void;
    className?: string;
};

export default function MapPicker({ latitude, longitude, onChange, className }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const markerRef = useRef<Marker | null>(null);
    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) {
            return;
        }

        const map = new maplibregl.Map({
            container: containerRef.current,
            style: streetStyle,
            center: [21.1655, 42.6629],
            zoom: 8,
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.on('click', (event) => {
            const next = { latitude: event.lngLat.lat, longitude: event.lngLat.lng };
            onChangeRef.current(next);
        });

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || latitude === null || longitude === null) {
            return;
        }

        const position: [number, number] = [longitude, latitude];

        if (!markerRef.current) {
            markerRef.current = new maplibregl.Marker({ color: '#2563eb' }).setLngLat(position).addTo(mapRef.current);
        } else {
            markerRef.current.setLngLat(position);
        }

        mapRef.current.flyTo({ center: position, zoom: 14 });
    }, [latitude, longitude]);

    const setCurrentLocation = () => {
        if (!navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            onChange({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        });
    };

    return (
        <div className="space-y-3">
            <div ref={containerRef} className={className ?? 'h-80 w-full rounded-md border'} />
            <Button type="button" variant="outline" onClick={setCurrentLocation}>
                Use Current Location
            </Button>
        </div>
    );
}
