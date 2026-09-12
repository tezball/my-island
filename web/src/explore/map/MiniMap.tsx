import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLE } from "./mapStyle";

export function MiniMap({ lat, lng }: { lat: number; lng: number }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const map = new maplibregl.Map({
      container: root.current,
      style: MAP_STYLE,
      center: [lng, lat],
      zoom: 12,
      interactive: false,
      attributionControl: { compact: true },
    });
    new maplibregl.Marker({ color: "#215C4E" }).setLngLat([lng, lat]).addTo(map);
    return () => map.remove();
  }, [lat, lng]);

  return <div className="mini-map" ref={root} role="img" aria-label="Map of this place" />;
}
