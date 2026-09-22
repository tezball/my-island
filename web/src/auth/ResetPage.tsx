import { FormEvent, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { isSignupPassword, resetPassword } from "../api/auth"

export function ResetPage() {
  const [params] = useSearchParams()
  const token = params.get("token") ?? ""
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isSignupPassword(password)) {
      setError("Password must be 8–72 characters.")
      return
    }
    setBusy(true)
    setError(null)
    try {
      await resetPassword(token, password)
      setMessage("Password updated. Sign in on Explore.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <h1>Reset password</h1>
      {!token ? <p className="status">Missing token.</p> : null}
      <form className="auth-page-form" onSubmit={onSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="New password"
          autoComplete="new-password"
        />
        <button className="bar-btn" type="submit" disabled={busy || !token}>
          Save password
        </button>
      </form>
      {message ? <p className="status">{message}</p> : null}
      {error ? (
        <p className="auth-error" role="alert">
          {error}
        </p>
      ) : null}
      <p>
        <Link to="/">Back to Explore</Link>
      </p>
    </main>
  )
}
