---
title: Mock-prod deploy (fishing-journals.com)
type: runbook
owner: eng-infra
created: 2026-09-13
cssclasses:
  - runbook
---

# Mock-prod deploy

**Not production.** Apex host is `https://fishing-journals.com/` (CEO playground VPS). Credentials stay in `.env` / remote `.env.mock-prod`.

```bash
# from a machine with MOCK_PROD_* and GOOGLE_* in .env
# MOCK_PROD_URL must be https://fishing-journals.com (not http://<vps-ip> — Caddy 308s HTTP).
./scripts/deploy-mock-prod.sh
```

Jenkins job `deploy-mock-prod` runs the same script when those env vars are present.

## Google OAuth (reuse fishing-journals client)

Fishing-journals used **Google Identity Services** (not a Spring OAuth2 redirect). Keep these exact:

| What | Value |
|---|---|
| Web client | Same `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` as `server/.env` on the VPS |
| Authorized JavaScript origins | `https://fishing-journals.com` and `https://app.fishing-journals.com` |
| Token exchange | `POST /api/auth/google` JSON `{"idToken":"<GIS credential>"}` |
| Session | `GET /api/v1/me` (cookie); `POST /api/auth/logout` |
| Do **not** register | `/login/oauth2/code/google` unless you later switch to Spring OIDC |

`VITE_GOOGLE_CLIENT_ID` is baked into the web image at compose build.

## After cutover

- Explore: https://fishing-journals.com/
- Health: https://fishing-journals.com/actuator/health
- Old `/explore/` 308s to `/`
- `app.` still serves my-island (GIS origin)
- `admin.` / `venues.` redirect to apex
- FJ dump: `/opt/backups/fishing-journals-*.sql.gz`
- Grafana stays at `grafana.fishing-journals.com`

## CSP / geolocation

Caddy `web_app_headers` is rewritten by `ops/deploy/caddy_apex.py` (Leaflet tiles + `geolocation=(self)` + GIS). See [[MOCK_HOST_CSP]].
