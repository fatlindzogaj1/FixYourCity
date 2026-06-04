import maplibregl, { Marker, Popup } from 'maplibre-gl';
import type { Map, StyleSpecification } from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import type { Report } from '@/types';

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
    reports: Report[];
    className?: string;
};

export default function ReportsMap({ reports, className }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const markersRef = useRef<Marker[]>([]);

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
        mapRef.current = map;

        return () => {
            markersRef.current.forEach((marker) => marker.remove());
            map.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current) {
            return;
        }

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        const bounds = new maplibregl.LngLatBounds();

        reports.forEach((report) => {
            if (report.latitude === undefined || report.longitude === undefined) {
                return;
            }

            const popup = new Popup({ offset: 18 }).setHTML(
                `<div style="color:#0f172a;font-size:13px;line-height:1.4;"><strong>${report.title}</strong><br/>${report.category} - ${report.status}</div>`,
            );

            const marker = new Marker({ color: '#0f172a' })
                .setLngLat([report.longitude, report.latitude])
                .setPopup(popup)
                .addTo(mapRef.current as Map);

            markersRef.current.push(marker);
            bounds.extend([report.longitude, report.latitude]);
        });

        if (reports.length > 0 && !bounds.isEmpty()) {
            mapRef.current.fitBounds(bounds, { padding: 48, maxZoom: 14 });
        }
    }, [reports]);

    return <div ref={containerRef} className={className ?? 'h-[26rem] w-full rounded-md border'} />;
}
