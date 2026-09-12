export const IRELAND = { lat: 53.42, lng: -8.1, zoom: 6.25 };
export const IRELAND_BOUNDS: [[number, number], [number, number]] = [
  [-11.2, 51.2],
  [-5.2, 55.6],
];

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const r = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(a));
}

export function hasCoords<T extends { latitude: number | null; longitude: number | null }>(
  place: T,
): place is T & { latitude: number; longitude: number } {
  const lat = place.latitude;
  const lng = place.longitude;
  if (lat == null || lng == null) return false;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (lat === 0 && lng === 0) return false;
  return lat >= 51.2 && lat <= 55.6 && lng >= -11.2 && lng <= -5.2;
}

export function formatKm(km: number): string {
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
