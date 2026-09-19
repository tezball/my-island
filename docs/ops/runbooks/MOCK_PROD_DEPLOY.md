---
title: Mock-prod deploy (fishing-journals.com)
type: runbook
owner: eng-infra
created: 2026-09-13
cssclasses:
  - runbook
---

# Mock-prod deploy

**Not production.** Apex host is `https://fishing-journals.com/` (CEO playground VPS). Credentials stay in `.env` / remote `.env.mock-prod`. **Agents never SSH.** Unattended path: green `main` → Jenkins `deploy-mock-prod` (cron `H/5` + GitHub check gate) → HTTP/API smoke ([[ops/tickets/WF-040]]). The SSH key stays in Jenkins. No human click.

```bash
# humans / Jenkins only — not the agent path. Agents do not run this script.
# MOCK_PROD_URL must be https://fishing-journals.com (not http://<vps-ip> — Caddy 308s HTTP).
./scripts/deploy-mock-prod.sh
```

Jenkins job `deploy-mock-prod` polls, deploys **`origin/main` only** when GHA `unit` + `catalog` + `web` + `stack` are green on that SHA **or** on the merged PR head that produced a `GITHUB_TOKEN` squash ([[ops/tickets/WF-048]] — squash does not fire `push` CI). Automerge dispatches CI on `main` after merge. Then `ops/scripts/smoke_mock_prod.py`. Fail closed if `MOCK_PROD_*` is missing. Cloud Agents watch the public site (`/actuator/health`, `/actuator/info`, `GET /api/v1/places`) and Jenkins/MCP ([[ops/tickets/WF-042]]); they do not SSH and they do not run this script. Post-deploy confirm is **HTTP/API smoke**, not Playwright. Do **not** start Chaos Monkey on this host as a deploy hook ([[ops/tickets/WF-043]] is merge CI). Do **not** make this apex the primary ZAP target ([[ops/tickets/WF-044]] scans local compose every merge). Gatling **light trickle** may already run here ([[ops/tickets/WF-042]]); full perf is weekly. Trickle/weekly failures mark Jenkins red and fire house Grafana/AM ([[ops/tickets/WF-045]]); leftover FJ email stays muted.

Health 200 is not enough. The script stamps `GIT_COMMIT` into the catalog image and then requires public JSON at `/actuator/info` to match that SHA (`ops/scripts/check_deploy_info.py`). HTML (PWA), `unknown`, or a different hash fails the job.

## Google OAuth (reuse fishing-journals client)

Fishing-journals used **Google Identity Services** (not a Spring OAuth2 redirect). Exact Console origins + click path: [[GOOGLE_GIS]]. Keep these:

| What | Value |
|---|---|
| Web client | Same `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` as `server/.env` on the VPS |
| Authorized JavaScript origins | `https://fishing-journals.com` and `https://app.fishing-journals.com` (plus local `http://localhost` + `http://localhost:5173` — [[GOOGLE_GIS]]) |
| Token exchange | `POST /api/auth/google` JSON `{"idToken":"<GIS credential>"}` |
| Session | `GET /api/v1/me` (cookie); `POST /api/auth/logout` |
| Do **not** register | `/login/oauth2/code/google` unless you later switch to Spring OIDC |

`VITE_GOOGLE_CLIENT_ID` is baked into the web image at compose build.

## After cutover

- Explore: https://fishing-journals.com/
- Health: https://fishing-journals.com/actuator/health
- Info (CI deploy stamp): https://fishing-journals.com/actuator/info
- Old `/explore/` 308s to `/`
- `app.` still serves my-island (GIS origin)
- `admin.` / `venues.` redirect to apex
- FJ dump: `/opt/backups/fishing-journals-*.sql.gz`
- Grafana stays at `grafana.fishing-journals.com`
- Leftover fishing-journals Prometheus/Alertmanager **must not email**. `deploy-mock-prod.sh` runs `ops/deploy/disable_legacy_alerts.py` (Alertmanager `keep` receiver, empty Prometheus rules). Pre-release: we are not on-call for this host ([[ops/tickets/INC-001]]).

## CSP / geolocation

Caddy `web_app_headers` is rewritten by `ops/deploy/caddy_apex.py` (Leaflet tiles + `geolocation=(self)` + GIS). See [[MOCK_HOST_CSP]].
