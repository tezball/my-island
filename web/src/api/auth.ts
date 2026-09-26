export type Me = {
  id: string
  email: string
  displayName: string | null
  emailVerified?: boolean
}

export function isSignupPassword(value: string): boolean {
  return value.length >= 8 && value.length <= 72
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

export async function loginWithPassword(username: string, password: string): Promise<void> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Login failed (${res.status})`)
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
}

async function postJson(path: string, body: unknown): Promise<void> {
  const res = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `${path} failed (${res.status})`)
  }
}

export function signup(username: string, email: string, password: string): Promise<void> {
  return postJson("/api/auth/signup", { username, email, password })
}

export function verifyEmail(token: string): Promise<void> {
  return postJson("/api/auth/verify", { token })
}

export function forgotPassword(username: string): Promise<void> {
  return postJson("/api/auth/forgot", { username })
}

export function resetPassword(token: string, password: string): Promise<void> {
  return postJson("/api/auth/reset", { token, password })
}
