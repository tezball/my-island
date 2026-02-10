import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import type { MapMarker } from '../../types/explore';
import { ExploreMarkerPopup } from './ExploreMarkerPopup';
import { ExploreSupplierPopup } from './ExploreSupplierPopup';

// Fix Leaflet default marker icon paths for Vite bundler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const IRELAND_CENTER: L.LatLngExpression = [53.5, -8.0];
const IRELAND_ZOOM = 7.5;

// Bounding box around Ireland — prevents panning away
const IRELAND_BOUNDS: L.LatLngBoundsExpression = [
    [51.0, -11.5], // Southwest
    [55.8, -4.5],  // Northeast
];

const campsiteIcon = L.divIcon({
    html: '<span class="material-symbols-outlined" style="font-size:20px;color:white;">camping</span>',
    className: 'flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-lg',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

const supplierIcon = L.divIcon({
    html: '<span class="material-symbols-outlined" style="font-size:20px;color:white;">storefront</span>',
    className: 'flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 border-2 border-white shadow-lg',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

// Component to fit map bounds when filters change (not on initial load)
function FitBounds({ markers }: { markers: MapMarker[] }) {
    const map = useMap();
    const prevCount = useRef(markers.length);
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        // Skip the first render — show Ireland-centered default view
        if (!hasInitialized) {
            setHasInitialized(true);
            prevCount.current = markers.length;
            return;
        }

        if (markers.length === 0) {
            map.setView(IRELAND_CENTER, IRELAND_ZOOM);
            prevCount.current = 0;
            return;
        }

        // Only re-fit when marker count changes (filter was applied)
        if (markers.length !== prevCount.current) {
            const bounds = L.latLngBounds(markers.map(m => [m.latitude, m.longitude]));
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
            prevCount.current = markers.length;
        }
    }, [markers, map, hasInitialized]);

    return null;
}

interface ExploreMapProps {
    markers: MapMarker[];
    className?: string;
}

export const ExploreMap: React.FC<ExploreMapProps> = ({ markers, className }) => {
    return (
        <MapContainer
            center={IRELAND_CENTER}
            zoom={IRELAND_ZOOM}
            scrollWheelZoom={true}
            className={className || 'w-full h-full'}
            zoomControl={false}
            maxBounds={IRELAND_BOUNDS}
            maxBoundsViscosity={1.0}
            minZoom={6.5}
            zoomSnap={0.25}
            zoomDelta={0.5}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds markers={markers} />
            <MarkerClusterGroup chunkedLoading>
                {markers.map(marker => (
                    <Marker
                        key={`${marker.type}-${marker.id}`}
                        position={[marker.latitude, marker.longitude]}
                        icon={marker.type === 'campsite' ? campsiteIcon : supplierIcon}
                    >
                        <Popup>
                            {marker.type === 'campsite' ? (
                                <ExploreMarkerPopup marker={marker} />
                            ) : (
                                <ExploreSupplierPopup marker={marker} />
                            )}
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
};
