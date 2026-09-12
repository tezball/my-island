import { haversineKm, hasCoords } from "./geo";
import type { Place } from "../api/catalog";

export type ExploreFilters = {
  q: string;
  county: string[];
};

export function parseCsv(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function applyFilters(
  places: Place[],
  filters: ExploreFilters,
  here: { lat: number; lng: number } | null,
): Place[] {
  const q = filters.q.trim().toLowerCase();
  let rows = places.filter((place) => place.category.id === "poi");
  if (filters.county.length) {
    const set = new Set(filters.county);
    rows = rows.filter((place) => set.has(place.county.id));
  }
  if (q) {
    rows = rows.filter((place) => {
      const blob = `${place.name} ${place.town ?? ""} ${place.county.name}`.toLowerCase();
      return blob.includes(q);
    });
  }
  if (here) {
    return [...rows].sort((a, b) => {
      const da = hasCoords(a) ? haversineKm(here.lat, here.lng, a.latitude, a.longitude) : Infinity;
      const db = hasCoords(b) ? haversineKm(here.lat, here.lng, b.latitude, b.longitude) : Infinity;
      if (da !== db) return da - db;
      return a.name.localeCompare(b.name);
    });
  }
  return [...rows].sort((a, b) => a.name.localeCompare(b.name));
}

export function inBounds(
  place: Place,
  bounds: { west: number; south: number; east: number; north: number },
): boolean {
  if (!hasCoords(place)) return false;
  return (
    place.longitude >= bounds.west &&
    place.longitude <= bounds.east &&
    place.latitude >= bounds.south &&
    place.latitude <= bounds.north
  );
}
