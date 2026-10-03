export type StayCounty = { id: string; name: string; countryCode?: string; ni?: boolean };

export type Stay = {
  id: string;
  kind: string;
  title: string;
  description: string;
  cost: number | null;
  currency: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  county: StayCounty | null;
  status: "submitted" | "public" | "hidden" | string;
  review: "pass" | "fail" | null;
  feedback: string | null;
  imageCount: number;
  hostUserId?: string | null;
  hostUsername?: string | null;
  hostBanned?: boolean;
  banReason?: string | null;
};

export type BannedAccount = {
  userId: string;
  username: string | null;
  email: string | null;
  banReason: string | null;
};

async function errorMessage(res: Response): Promise<string> {
  const text = await res.text().catch(() => "");
  try {
    const body = JSON.parse(text) as { error?: string };
    if (body.error) return body.error;
  } catch {
    /* plain text */
  }
  return text || `Request failed (${res.status})`;
}

async function send(path: string, init: RequestInit): Promise<Response> {
  const res = await fetch(path, { credentials: "include", ...init });
  if (!res.ok) throw new Error(await errorMessage(res));
  return res;
}

export function listPublicStays(): Promise<Stay[]> {
  return fetch("/api/v1/stays").then(async (res) => {
    if (!res.ok) throw new Error(await errorMessage(res));
    return res.json() as Promise<Stay[]>;
  });
}

export function getPublicStay(id: string): Promise<Stay> {
  return fetch(`/api/v1/stays/${encodeURIComponent(id)}`).then(async (res) => {
    if (!res.ok) throw new Error(await errorMessage(res));
    return res.json() as Promise<Stay>;
  });
}

export function countyFromPin(latitude: number, longitude: number): Promise<StayCounty | null> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
  });
  return fetch(`/api/v1/stays/county?${params}`).then(async (res) => {
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(await errorMessage(res));
    return res.json() as Promise<StayCounty>;
  });
}

export function listHostStays(): Promise<Stay[]> {
  return send("/api/v1/host/stays", {}).then((res) => res.json() as Promise<Stay[]>);
}

export function getHostStay(id: string): Promise<Stay> {
  return send(`/api/v1/host/stays/${encodeURIComponent(id)}`, {}).then(
    (res) => res.json() as Promise<Stay>,
  );
}

export function submitStay(form: FormData, id?: string): Promise<Stay> {
  const path = id ? `/api/v1/host/stays/${encodeURIComponent(id)}` : "/api/v1/host/stays";
  return send(path, { method: id ? "PUT" : "POST", body: form }).then(
    (res) => res.json() as Promise<Stay>,
  );
}

export function listAdminStays(): Promise<Stay[]> {
  return send("/api/v1/admin/stays", {}).then((res) => res.json() as Promise<Stay[]>);
}

export function listStuckStays(): Promise<Stay[]> {
  return send("/api/v1/admin/stays/stuck", {}).then((res) => res.json() as Promise<Stay[]>);
}

export function listBans(): Promise<BannedAccount[]> {
  return send("/api/v1/admin/bans", {}).then((res) => res.json() as Promise<BannedAccount[]>);
}

export function runReviewAgain(id: string): Promise<Stay> {
  return send(`/api/v1/admin/stays/${encodeURIComponent(id)}/review`, { method: "POST" }).then(
    (res) => res.json() as Promise<Stay>,
  );
}

export function unban(userId: string): Promise<void> {
  return send(`/api/v1/admin/bans/${encodeURIComponent(userId)}/unban`, { method: "POST" }).then(
    () => undefined,
  );
}

export function eur(cost: number | null): string | null {
  if (cost == null) return null;
  return `EUR ${cost}`;
}
