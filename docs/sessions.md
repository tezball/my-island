# Sessions

Sign-in returns a server session. The caller sends that session on later requests. A missing or expired session is rejected.

The token is 32 random bytes. The database stores only its SHA-256 hash in `session`, with the account and an expiry 12 hours ahead. The response field is `token`. Calls send `Authorization: Bearer` plus that token. An email in that header is not a session, so it is rejected. Signing in again does not keep expired rows for that account.

Google sign-in, when `GOOGLE_CLIENT_ID` is set, returns the same kind of session. This change does not invent a client id.

Tools: JDK `SecureRandom`, JDK SHA-256, PostgreSQL, Flyway `V4__harden.sql`, Ktor.
