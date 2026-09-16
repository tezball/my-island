---
title: Google Identity Services (GIS) origins
type: runbook
owner: eng-backend
created: 2026-09-16
cssclasses:
  - runbook
---

# Google Identity Services (GIS) origins

**Not production.** Mock-prod host is `https://fishing-journals.com/`. Local runtime is compose. GIS is popup + ID token (`POST /api/auth/google`), not Spring `/login/oauth2/code/google` ([[ops/tickets/WF-014]]).

The PWA never sends a custom OAuth origin. Google checks **the page’s** `window.location.origin` against the Web client’s **Authorized JavaScript origins**. `http://localhost:5173` and `http://127.0.0.1:5173` are different origins. Google’s GIS docs want `http://localhost` **and** `http://localhost:<port>`; IP loopback often 400s even when listed.

House `./scripts/app start` still prints `http://127.0.0.1:5173`. When `VITE_GOOGLE_CLIENT_ID` is set, Explore redirects that host to `http://localhost:5173` before GIS loads.

## Console (human — IdP)

1. Open [Google Auth Platform → Clients](https://console.cloud.google.com/auth/clients) (same list under **APIs & Services → Credentials → OAuth 2.0 Client IDs**).
2. Select the Cloud project that owns the fishing-journals **Web application** client. Public client id in the live PWA: `664892630671-20micp7onoh8rceh0r1jonr0f1366j97`.
3. Open that client (application type **Web application**).
4. **Authorized JavaScript origins** — add **exactly** these URIs, no trailing slash, no path:

| Origin | Why |
|---|---|
| `https://fishing-journals.com` | Mock-prod Explore (apex). `www` and `http://` already redirect here. |
| `https://app.fishing-journals.com` | Same PWA still served on `app.` |
| `http://localhost` | GIS local requirement (no port) |
| `http://localhost:5173` | Local Vite / compose PWA |

5. **Authorized redirect URIs** — leave empty for GIS popup. Do **not** add `/login/oauth2/code/google` unless WF-014 is implementing Spring OIDC.
6. **OAuth branding / Authorized domains** (consent screen): `fishing-journals.com` (host only, no scheme).
7. Save. Wait a few minutes, hard-refresh Explore, retry Sign in with Google.

Do **not** register Cloud Agent preview URLs, LAN IPs, `http://127.0.0.1:5173`, or a production host (there is none).

## Env (no secrets in notes)

Root `.env` (gitignored):

```
GOOGLE_CLIENT_ID=….apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=…
VITE_GOOGLE_CLIENT_ID=….apps.googleusercontent.com
```

`VITE_GOOGLE_CLIENT_ID` may copy `GOOGLE_CLIENT_ID`. Compose `web` and mock-prod image build bake the Vite value. Secret stays server-side on catalog.

## Verify a page origin

In the browser on Explore: `window.location.origin` must be one of the four rows above. If it is `http://127.0.0.1:5173`, reload after this ticket’s PWA (redirect). If it is a Cursor preview host, open mock-prod or local loopback instead.

Related: [[ops/runbooks/MOCK_PROD_DEPLOY]] · [[ops/tickets/WF-039]] · [[ops/tickets/WF-032]]
