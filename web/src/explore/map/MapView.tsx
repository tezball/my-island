import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Place } from "../../api/catalog";
import { hasCoords, IRELAND, IRELAND_BOUNDS } from "../geo";

const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export function MapView({
  places,
  here,
  onSelect,
  onBoundsCommitNeeded,
  searchToken,
  onSearchArea,
}: {
  places: Place[];
  here: { lat: number; lng: number } | null;
  onSelect: (place: Place) => void;
  onBoundsCommitNeeded: (needed: boolean) => void;
  searchToken: number;
  onSearchArea: (bounds: { west: number; south: number; east: number; north: number }) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const hereRef = useRef<L.CircleMarker | null>(null);
  const placesRef = useRef(places);
  const skipMove = useRef(true);
  placesRef.current = places;

  useEffect(() => {
    if (!root.current || mapRef.current) return;
    const map = L.map(root.current, {
      zoomControl: false,
      attributionControl: true,
      maxBounds: L.latLngBounds(
        [IRELAND_BOUNDS[0][1], IRELAND_BOUNDS[0][0]],
        [IRELAND_BOUNDS[1][1], IRELAND_BOUNDS[1][0]],
      ),
      minZoom: 6,
    }).setView([IRELAND.lat, IRELAND.lng], 6);
    L.tileLayer(TILES, {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: "topright" }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    skipMove.current = true;
    map.on("moveend", () => {
      if (skipMove.current) {
        skipMove.current = false;
        return;
      }
      onBoundsCommitNeeded(true);
    });
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(root.current);
    requestAnimationFrame(() => map.invalidateSize());
    syncPins(layerRef.current, placesRef.current, onSelect);
    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      hereRef.current = null;
    };
  }, [onBoundsCommitNeeded, onSelect]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    syncPins(layer, places, onSelect);
  }, [places, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !here) return;
    if (!hereRef.current) {
      hereRef.current = L.circleMarker([here.lat, here.lng], {
        radius: 7,
        color: "#fff",
        weight: 2,
        fillColor: "#1c7ae0",
        fillOpacity: 1,
      }).addTo(map);
    } else {
      hereRef.current.setLatLng([here.lat, here.lng]);
    }
    map.setView([here.lat, here.lng], Math.max(map.getZoom(), 10));
  }, [here]);

  useEffect(() => {
    const map = mapRef.current;
    if (!searchToken || !map) return;
    const b = map.getBounds();
    onSearchArea({
      west: b.getWest(),
      south: b.getSouth(),
      east: b.getEast(),
      north: b.getNorth(),
    });
  }, [searchToken, onSearchArea]);

  return <div className="map-el" ref={root} role="presentation" />;
}

function syncPins(layer: L.LayerGroup, places: Place[], onSelect: (place: Place) => void) {
  layer.clearLayers();
  for (const place of places) {
    if (!hasCoords(place)) continue;
    const marker = L.circleMarker([place.latitude, place.longitude], {
      radius: 8,
      color: "#F4F0E6",
      weight: 2,
      fillColor: "#215C4E",
      fillOpacity: 1,
    });
    marker.on("click", () => onSelect(place));
    marker.bindTooltip(place.name, { direction: "top", opacity: 0.9 });
    layer.addLayer(marker);
  }
}
