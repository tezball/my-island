import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export function PinMap({
  latitude,
  longitude,
  onPick,
}: {
  latitude: number | null;
  longitude: number | null;
  onPick: (latitude: number, longitude: number) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  useEffect(() => {
    if (!root.current) return;
    const map = L.map(root.current, { attributionControl: true }).setView([53.4, -8], 6);
    L.tileLayer(TILES, { attribution: "© OpenStreetMap", maxZoom: 19 }).addTo(map);
    const marker = L.circleMarker([53.4, -8], {
      radius: 8,
      color: "#ffffff",
      weight: 2,
      fillColor: "#002217",
      fillOpacity: 1,
    });
    if (latitude != null && longitude != null) {
      marker.setLatLng([latitude, longitude]).addTo(map);
    }
    map.on("click", (event) => {
      marker.setLatLng(event.latlng).addTo(map);
      onPickRef.current(event.latlng.lat, event.latlng.lng);
    });
    requestAnimationFrame(() => map.invalidateSize());
    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  return <div className="pin-map" ref={root} />;
}
