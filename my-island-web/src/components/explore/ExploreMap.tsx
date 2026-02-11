import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import type { MapMarker } from '../../types/explore';
import type { VisitStatus } from '../../types/discovery';
import { ExploreMarkerPopup } from './ExploreMarkerPopup';
import { ExploreSupplierPopup } from './ExploreSupplierPopup';
import { ExplorePoiPopup } from './ExplorePoiPopup';

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

const markerStyle = 'display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;border:2px solid white;box-shadow:0 4px 6px rgba(0,0,0,0.3);';

const campsiteIcon = L.divIcon({
    html: `<div style="${markerStyle}background:#10b981;"><span class="material-symbols-outlined" style="font-size:18px;color:white;">camping</span></div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

const supplierIcon = L.divIcon({
    html: `<div style="${markerStyle}background:#a855f7;"><span class="material-symbols-outlined" style="font-size:18px;color:white;">storefront</span></div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

const poiIcon = L.divIcon({
    html: `<div style="${markerStyle}background:#06b6d4;"><span class="material-symbols-outlined" style="font-size:18px;color:white;">explore</span></div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

function getMarkerIcon(marker: MapMarker): L.DivIcon {
    if (marker.type === 'campsite') return campsiteIcon;
    if (marker.type === 'supplier') return supplierIcon;
    return poiIcon;
}

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
    onUpdateVisit?: (poiId: string, status: VisitStatus) => void;
    onRemoveVisit?: (poiId: string) => void;
}

export const ExploreMap: React.FC<ExploreMapProps> = ({ markers, className, onUpdateVisit, onRemoveVisit }) => {
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
                        icon={getMarkerIcon(marker)}
                    >
                        <Popup>
                            {marker.type === 'campsite' ? (
                                <ExploreMarkerPopup marker={marker} />
                            ) : marker.type === 'supplier' ? (
                                <ExploreSupplierPopup marker={marker} />
                            ) : (
                                <ExplorePoiPopup
                                    marker={marker}
                                    onUpdateVisit={onUpdateVisit}
                                    onRemoveVisit={onRemoveVisit}
                                />
                            )}
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );
};
