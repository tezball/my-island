export type CategoryRef = { id: string; label: string };
export type CountyRef = { id: string; name: string };

export type Place = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: CategoryRef;
  county: CountyRef;
  town: string | null;
  latitude: number | null;
  longitude: number | null;
  published: boolean;
  priceBand: string | null;
  website: string | null;
  phone: string | null;
  facilities: string[];
  imageUrl: string | null;
  imageCredit: string | null;
  imageLicence: string | null;
};

export type County = { id: string; name: string; ni?: boolean };

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`${path} ${res.status}`);
  }
  return (await res.json()) as T;
}

export function listPublishedPlaces(): Promise<Place[]> {
  return getJson("/api/v1/places?published=true");
}

export function getPlace(idOrSlug: string): Promise<Place> {
  return getJson(`/api/v1/places/${encodeURIComponent(idOrSlug)}`);
}

export function listCounties(): Promise<County[]> {
  return getJson("/api/v1/counties");
}
