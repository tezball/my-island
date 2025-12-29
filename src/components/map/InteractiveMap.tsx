import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Campsite } from '@/types'

// Fix for default marker icons in Leaflet with Vite
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Custom green marker for campsites
const campsiteIcon = L.divIcon({
  className: 'campsite-marker',
  html: `<div style="
    background-color: #00D9A5;
    width: 32px;
    height: 32px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  ">
    <span style="
      transform: rotate(45deg);
      color: white;
      font-size: 14px;
      font-family: 'Material Symbols Outlined';
    ">⛺</span>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

L.Marker.prototype.options.icon = defaultIcon

export interface MapControls {
  zoomIn: () => void
  zoomOut: () => void
  locate: () => void
}

// Child component to capture the map instance
function MapController({ onMapReady }: { onMapReady: (controls: MapControls) => void }) {
  const map = useMap()

  useEffect(() => {
    onMapReady({
      zoomIn: () => map.zoomIn(),
      zoomOut: () => map.zoomOut(),
      locate: () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              map.setView([position.coords.latitude, position.coords.longitude], 12)
            },
            () => {
              // Fallback to Ireland center if geolocation fails
              map.setView([53.5, -8.0], 7)
            }
          )
        }
      },
    })
  }, [map, onMapReady])

  return null
}

interface InteractiveMapProps {
  campsites: Campsite[]
  onCampsiteClick?: (campsite: Campsite) => void
  activeFilter?: string
  onMapReady?: (controls: MapControls) => void
}

export function InteractiveMap({
  campsites,
  onCampsiteClick,
  activeFilter = 'all',
  onMapReady,
}: InteractiveMapProps) {
  // Filter campsites based on active filter
  const filteredCampsites = campsites.filter((campsite) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'rv') return campsite.type === 'rv'
    if (activeFilter === 'wifi') return campsite.facilities.some((f) => f.id === 'wifi')
    if (activeFilter === 'pets') return campsite.facilities.some((f) => f.id === 'pets')
    return true
  })

  // Ireland center coordinates
  const irelandCenter: [number, number] = [53.5, -8.0]

  return (
    <MapContainer
      center={irelandCenter}
      zoom={7}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {onMapReady && <MapController onMapReady={onMapReady} />}
      {filteredCampsites.map((campsite) => (
        <Marker
          key={campsite.id}
          position={[campsite.coordinates.lat, campsite.coordinates.lng]}
          icon={campsiteIcon}
          eventHandlers={{
            click: () => onCampsiteClick?.(campsite),
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <img
                src={campsite.imageUrl}
                alt={campsite.name}
                className="w-full h-24 object-cover rounded-t-lg -mt-3 -mx-3 mb-2"
                style={{ width: 'calc(100% + 24px)' }}
              />
              <h3 className="font-bold text-text-main text-sm">{campsite.name}</h3>
              <p className="text-xs text-text-secondary">{campsite.location}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-amber-500 text-xs">★</span>
                <span className="text-xs font-medium">{campsite.rating}</span>
                <span className="text-xs text-text-secondary">({campsite.reviewCount})</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-primary font-bold">€{campsite.pricePerNight}</span>
                <span className="text-xs text-text-secondary">/ night</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
