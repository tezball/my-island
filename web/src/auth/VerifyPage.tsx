import { FormEvent, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { verifyEmail } from "../api/auth"

export function VerifyPage() {
  const [params] = useSearchParams()
  const token = params.get("token") ?? ""
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await verifyEmail(token)
      setMessage("Email verified. You can use Explore.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verify failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <h1>Verify email</h1>
      {!token ? <p className="status">Missing token.</p> : null}
      <form onSubmit={onSubmit}>
        <button className="bar-btn" type="submit" disabled={busy || !token}>
          Verify
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
