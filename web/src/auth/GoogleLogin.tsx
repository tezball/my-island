import { useCallback, useEffect, useRef, useState } from "react"
import { fetchMe, loginWithGoogleIdToken, logout, type Me } from "../api/auth"
import { gisCanonicalUrl, gisInitializeConfig, gisOriginMismatchMessage } from "./gisOrigin"

const GIS_SRC = "https://accounts.google.com/gsi/client"

function loadGisScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve()
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`)
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () => reject(new Error("GIS script failed")))
    })
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script")
    s.src = GIS_SRC
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error("GIS script failed"))
    document.head.appendChild(s)
  })
}

type Props = {
  me: Me | null
  onMe: (me: Me | null) => void
}

export function GoogleLogin({ me, onMe }: Props) {
  const btnRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  const handleCredential = useCallback(
    async (response: { credential?: string }) => {
      if (!response.credential) return
      setBusy(true)
      setError(null)
      try {
        await loginWithGoogleIdToken(response.credential)
        const profile = await fetchMe()
        onMe(profile)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Sign-in failed")
      } finally {
        setBusy(false)
      }
    },
    [onMe],
  )

  const onGisError = useCallback((err: { type?: string; message?: string }) => {
    const detail = `${err.type ?? ""} ${err.message ?? ""}`
    if (/origin/i.test(detail)) {
      setError(gisOriginMismatchMessage(window.location.origin))
      return
    }
    setError(err.message || err.type || "Google Sign-In failed")
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!clientId || clientId.includes("changeme")) return
      if (me) return
      const canonical = gisCanonicalUrl(window.location.href)
      if (canonical) {
        window.location.replace(canonical)
        return
      }
      try {
        await loadGisScript()
        if (cancelled || !btnRef.current) return
        window.google?.accounts.id.initialize(
          gisInitializeConfig(clientId, handleCredential, onGisError),
        )
        window.google?.accounts.id.renderButton(btnRef.current, {
          type: "standard",
          theme: "outline",
          size: "medium",
          text: "signin_with",
          shape: "rectangular",
          width: 180,
        })
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not load Google Sign-In")
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [clientId, handleCredential, me, onGisError])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const profile = await fetchMe()
        if (!cancelled) onMe(profile)
      } catch {
        /* anonymous OK */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [onMe])

  const signOut = async () => {
    setBusy(true)
    try {
      await logout()
      onMe(null)
      window.google?.accounts.id.disableAutoSelect?.()
    } finally {
      setBusy(false)
    }
  }

  const label = me?.displayName || me?.email

  return (
    <div className="auth-bar">
      {label ? (
        <p className="me-chip">
          <span>{label}</span>
          <button type="button" className="auth-out" onClick={signOut} disabled={busy}>
            Sign out
          </button>
        </p>
      ) : clientId && !clientId.includes("changeme") ? (
        <div ref={btnRef} className="gis-btn" aria-busy={busy} />
      ) : null}
      {error ? (
        <p className="auth-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
