export type Me = {
  id: string
  email: string
  displayName: string | null
}

/** GIS credential → session cookie. Path matches fishing-journals: POST /api/auth/google. */
export async function loginWithGoogleIdToken(idToken: string): Promise<void> {
  const res = await fetch("/api/auth/google", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Google login failed (${res.status})`)
  }
}

export async function fetchMe(): Promise<Me | null> {
  const res = await fetch("/api/v1/me", { credentials: "include" })
  if (res.status === 401 || res.status === 403) return null
  if (!res.ok) throw new Error(`/api/v1/me → ${res.status}`)
  return res.json() as Promise<Me>
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
}
