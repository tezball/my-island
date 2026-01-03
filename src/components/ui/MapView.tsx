import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { SupplierCategory } from '../../data/supplierTypes'
import { supplierCategoryIcons, supplierCategoryColors } from '../../data/supplierTypes'

export type MarkerType = 'campsite' | 'supplier'

export interface MapMarker {
  id: string
  position: [number, number]
  name: string
  type: MarkerType
  // For campsites
  price?: number
  // For suppliers
  category?: SupplierCategory
}

interface MapViewProps {
  center?: [number, number]
  zoom?: number
  markers?: MapMarker[]
  onMarkerClick?: (id: string, type: MarkerType) => void
  className?: string
  height?: string
}

// Create campsite marker (green price pill)
function createCampsiteIcon(marker: MapMarker): L.DivIcon {
  return L.divIcon({
    className: 'custom-marker campsite-marker',
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
}

// Create supplier marker (circular with category icon)
function createSupplierIcon(marker: MapMarker): L.DivIcon {
  const category = marker.category || 'RESTAURANT'
  const iconName = supplierCategoryIcons[category]
  const color = supplierCategoryColors[category]

  return L.divIcon({
    className: 'custom-marker supplier-marker',
    html: `
      <div style="
        position: relative;
        transform: translate(-50%, -100%);
      ">
        <div style="
          background: white;
          border: 3px solid ${color};
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        ">
          <span class="material-symbols-outlined" style="
            font-size: 20px;
            color: ${color};
            font-variation-settings: 'FILL' 1, 'wght' 400;
          ">${iconName}</span>
        </div>
        <div style="
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid ${color};
        "></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

// Create popup content based on marker type
function createPopupContent(marker: MapMarker): string {
  if (marker.type === 'campsite') {
    return `
      <div style="min-width: 150px;">
        <strong>${marker.name}</strong>
        ${marker.price ? `<br/><span style="color: #13ec80; font-weight: 600;">€${marker.price}/night</span>` : ''}
      </div>
    `
  }

  const category = marker.category || 'RESTAURANT'
  const color = supplierCategoryColors[category]

  return `
    <div style="min-width: 150px;">
      <strong>${marker.name}</strong>
      <br/>
      <span style="color: ${color}; font-weight: 500; font-size: 12px; text-transform: capitalize;">
        ${category.toLowerCase().replace('_', ' ')}
      </span>
    </div>
  `
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
      // Create appropriate icon based on marker type
      const icon = marker.type === 'supplier'
        ? createSupplierIcon(marker)
        : createCampsiteIcon(marker)

      const leafletMarker = L.marker(marker.position, { icon })
        .bindPopup(createPopupContent(marker))

      if (onMarkerClick) {
        leafletMarker.on('click', () => {
          onMarkerClick(marker.id, marker.type)
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
