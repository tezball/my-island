import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Marker {
  id: string
  position: [number, number]
  price?: number
  name: string
}

interface MapViewProps {
  center?: [number, number]
  zoom?: number
  markers?: Marker[]
  onMarkerClick?: (id: string) => void
  className?: string
  height?: string
}

export default function MapView({
  center = [53.5, -8],
  zoom = 7,
  markers = [],
  onMarkerClick,
  className = '',
  height = '100%',
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
      attributionControl: false,
    })

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map)

    // Create markers layer
    markersLayerRef.current = L.layerGroup().addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update markers when they change
  useEffect(() => {
    if (!markersLayerRef.current) return

    // Clear existing markers
    markersLayerRef.current.clearLayers()

    // Add new markers
    markers.forEach(marker => {
      // Create custom icon with price
      const priceIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background: #13ec80;
            color: white;
            padding: 4px 8px;
            border-radius: 16px;
            font-weight: 600;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            white-space: nowrap;
            transform: translate(-50%, -100%);
          ">
            ${marker.price ? `€${marker.price}` : marker.name}
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      })

      const leafletMarker = L.marker(marker.position, { icon: priceIcon })
        .bindPopup(`
          <div style="min-width: 150px;">
            <strong>${marker.name}</strong>
            ${marker.price ? `<br/><span style="color: #13ec80; font-weight: 600;">€${marker.price}/night</span>` : ''}
          </div>
        `)

      if (onMarkerClick) {
        leafletMarker.on('click', () => {
          onMarkerClick(marker.id)
        })
      }

      markersLayerRef.current?.addLayer(leafletMarker)
    })
  }, [markers, onMarkerClick])

  // Update center when it changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom)
    }
  }, [center, zoom])

  return (
    <div
      ref={mapRef}
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ height, minHeight: '200px' }}
    />
  )
}
