import { useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface LocateControlProps {
    zoom?: number;
    position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
    offsetTop?: number;
}

const positionStyles: Record<string, React.CSSProperties> = {
    topleft: { top: 10, left: 10 },
    topright: { top: 10, right: 10 },
    bottomleft: { bottom: 10, left: 10 },
    bottomright: { bottom: 10, right: 10 },
};

export const LocateControl: React.FC<LocateControlProps> = ({ zoom = 14, position = 'topright', offsetTop }) => {
    const map = useMap();
    const [locating, setLocating] = useState(false);
    const [marker, setMarker] = useState<L.CircleMarker | null>(null);

    const handleLocate = () => {
        if (!navigator.geolocation) return;
        setLocating(true);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                map.setView([latitude, longitude], zoom);

                // Remove previous marker if any
                if (marker) map.removeLayer(marker);

                const m = L.circleMarker([latitude, longitude], {
                    radius: 8,
                    fillColor: '#3b82f6',
                    fillOpacity: 1,
                    color: '#ffffff',
                    weight: 3,
                }).addTo(map);
                setMarker(m);
                setLocating(false);
            },
            () => {
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return (
        <button
            onClick={handleLocate}
            disabled={locating}
            title="Zoom to your location"
            style={{ ...positionStyles[position], position: 'absolute', zIndex: 1000, ...(offsetTop != null ? { top: offsetTop } : {}) }}
            className="w-9 h-9 bg-white dark:bg-[#1a2632] border border-gray-300 dark:border-gray-600 rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
            <span className={`material-symbols-outlined text-lg ${locating ? 'text-blue-500 animate-pulse' : 'text-gray-600 dark:text-gray-300'}`}>
                my_location
            </span>
        </button>
    );
};
