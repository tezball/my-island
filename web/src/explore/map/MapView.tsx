import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Place } from "../../api/catalog";
import { hasCoords, IRELAND, IRELAND_BOUNDS } from "../geo";
import { MAP_STYLE } from "./mapStyle";

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
  const mapRef = useRef<maplibregl.Map | null>(null);
  const hereMarker = useRef<maplibregl.Marker | null>(null);
  const placesRef = useRef(places);
  placesRef.current = places;

  useEffect(() => {
    if (!root.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: root.current,
      style: MAP_STYLE,
      center: [IRELAND.lng, IRELAND.lat],
      zoom: IRELAND.zoom,
      maxBounds: IRELAND_BOUNDS,
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    map.on("load", () => {
      map.addSource("places", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 12,
      });
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "places",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#215C4E",
          "circle-radius": ["step", ["get", "point_count"], 16, 8, 20, 25, 26],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#F4F0E6",
        },
      });
      map.addLayer({
        id: "points",
        type: "circle",
        source: "places",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#215C4E",
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#F4F0E6",
        },
      });
      map.on("click", "clusters", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const source = map.getSource("places") as maplibregl.GeoJSONSource;
        const clusterId = feature.properties?.cluster_id as number;
        const geom = feature.geometry;
        if (!geom || geom.type !== "Point") return;
        source.getClusterExpansionZoom(clusterId).then((zoom) => {
          map.easeTo({ center: geom.coordinates as [number, number], zoom });
        });
      });
      map.on("click", "points", (e) => {
        const slug = e.features?.[0]?.properties?.slug as string | undefined;
        const hit = placesRef.current.find((p) => p.slug === slug);
        if (hit) onSelect(hit);
      });
      for (const layer of ["points", "clusters"]) {
        map.on("mouseenter", layer, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layer, () => {
          map.getCanvas().style.cursor = "";
        });
      }
      syncSource(map, placesRef.current);
    });
    map.on("moveend", () => onBoundsCommitNeeded(true));
    return () => {
      hereMarker.current?.remove();
      hereMarker.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [onBoundsCommitNeeded, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getSource("places")) return;
    syncSource(map, places);
  }, [places]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !here) return;
    if (!hereMarker.current) {
      const el = document.createElement("div");
      el.className = "here-dot";
      hereMarker.current = new maplibregl.Marker({ element: el }).setLngLat([here.lng, here.lat]).addTo(map);
    } else {
      hereMarker.current.setLngLat([here.lng, here.lat]);
    }
    map.flyTo({ center: [here.lng, here.lat], zoom: Math.max(map.getZoom(), 10) });
  }, [here]);

  useEffect(() => {
    if (!searchToken || !mapRef.current) return;
    const b = mapRef.current.getBounds();
    onSearchArea({
      west: b.getWest(),
      south: b.getSouth(),
      east: b.getEast(),
      north: b.getNorth(),
    });
  }, [searchToken, onSearchArea]);

  return <div className="map-el" ref={root} role="presentation" />;
}

function syncSource(map: maplibregl.Map, places: Place[]) {
  const source = map.getSource("places") as maplibregl.GeoJSONSource | undefined;
  if (!source) return;
  source.setData({
    type: "FeatureCollection",
    features: places.filter(hasCoords).map((place) => ({
      type: "Feature",
      properties: { slug: place.slug, name: place.name },
      geometry: { type: "Point", coordinates: [place.longitude, place.latitude] },
    })),
  });
}
