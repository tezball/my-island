import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default marker icon paths for Vite bundler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface CampsiteMapProps {
    latitude: number;
    longitude: number;
    name: string;
    className?: string;
}

export const CampsiteMap: React.FC<CampsiteMapProps> = ({ latitude, longitude, name, className }) => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    return (
        <div className={className}>
            <MapContainer
                center={[latitude, longitude]}
                zoom={13}
                scrollWheelZoom={false}
                className="h-64 md:h-80 w-full rounded-xl z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]}>
                    <Popup>
                        <strong>{name}</strong>
                        <br />
                        <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline"
                        >
                            Get Directions
                        </a>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};
