export type VisitMark = "been" | "want" | "never";

export type VisitIntent = {
  placeId: string;
  mark: VisitMark;
  updatedAt: string;
};

export function isVisitMark(value: string): value is VisitMark {
  return value === "been" || value === "want" || value === "never";
}

export async function listMyVisitIntents(mark?: VisitMark): Promise<VisitIntent[]> {
  const path = mark ? `/api/v1/me/visit-intents?mark=${mark}` : "/api/v1/me/visit-intents";
  const res = await fetch(path, { credentials: "include" });
  if (res.status === 401 || res.status === 403) return [];
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return (await res.json()) as VisitIntent[];
}

export async function putVisitIntent(placeId: string, mark: VisitMark): Promise<VisitIntent> {
  const res = await fetch(`/api/v1/me/places/${encodeURIComponent(placeId)}/visit-intent`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mark }),
  });
  if (!res.ok) throw new Error(`visit-intent ${res.status}`);
  return (await res.json()) as VisitIntent;
}

export async function deleteVisitIntent(placeId: string): Promise<void> {
  const res = await fetch(`/api/v1/me/places/${encodeURIComponent(placeId)}/visit-intent`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok && res.status !== 204) throw new Error(`visit-intent delete ${res.status}`);
}

export function marksByPlace(rows: VisitIntent[]): Record<string, VisitMark> {
  const out: Record<string, VisitMark> = {};
  for (const row of rows) {
    if (isVisitMark(row.mark)) out[row.placeId] = row.mark;
  }
  return out;
}

export function placesForMark<T extends { id: string }>(
  places: T[],
  marks: Record<string, VisitMark>,
  mark: VisitMark,
): T[] {
  return places.filter((place) => marks[place.id] === mark);
}
