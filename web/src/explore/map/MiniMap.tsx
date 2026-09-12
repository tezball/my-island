import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export function MiniMap({ lat, lng }: { lat: number; lng: number }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const map = L.map(root.current, {
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      attributionControl: true,
    }).setView([lat, lng], 12);
    L.tileLayer(TILES, {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);
    L.circleMarker([lat, lng], {
      radius: 8,
      color: "#F4F0E6",
      weight: 2,
      fillColor: "#215C4E",
      fillOpacity: 1,
    }).addTo(map);
    requestAnimationFrame(() => map.invalidateSize());
    return () => {
      map.remove();
    };
  }, [lat, lng]);

  return <div className="mini-map" ref={root} role="img" aria-label="Map of this place" />;
}
