---
title: Confirm mock-prod deploy and debug
type: runbook
owner: automation-expert
cssclasses:
  - runbook
---

# Confirm mock-prod deploy

**Not production.** Host: https://fishing-journals.com/. Agents **never SSH**. They do not run `./scripts/deploy-mock-prod.sh`. Handbook: [[ops/workflow/DX]]. Job: Jenkins `deploy-mock-prod` ([[ops/runbooks/MOCK_PROD_DEPLOY]], [[ops/tickets/WF-040]]).

Post-deploy proof is **HTTP/API smoke**, not Playwright, Chaos, or ZAP.

## 1. Health

```bash
curl -sS -H 'Accept: application/json' https://fishing-journals.com/actuator/health
```

Expect JSON `{"status":"UP",...}`. HTML (PWA) = Caddy/catalog routing is wrong.

## 2. Info SHA

```bash
git fetch origin main
curl -sS -H 'Accept: application/json' https://fishing-journals.com/actuator/info
git rev-parse origin/main
```

`gitCommit` must equal `origin/main`. `unknown`, a different hash, or HTML fails. Jenkins already runs `ops/scripts/check_deploy_info.py` then `ops/scripts/smoke_mock_prod.py`.

## 3. Places (public GET)

```bash
curl -sS -H 'Accept: application/json' \
  'https://fishing-journals.com/api/v1/places?published=true'
```

Expect a JSON array. Each Place may include anonymous **`beenCount`**. Do **not** POST Places at this URL without `X-Catalog-Import-Key` from Jenkins env (anonymous POST is 401). Do not print that key.

## 4. Optional session checks (local or seed Guest)

Local compose defaults (git `compose.yml`): password Guest `guest` / `guest`. Mock-prod seed lives in Jenkins env — do not paste it here.

```bash
# password Guest (automation). Google humans use GIS, not this curl.
curl -sS -c /tmp/guest.cj -H 'content-type: application/json' \
  -d '{"username":"guest","password":"guest"}' \
  http://127.0.0.1:8081/api/auth/login
curl -sS -b /tmp/guest.cj http://127.0.0.1:8081/api/v1/me
curl -sS -b /tmp/guest.cj http://127.0.0.1:8081/api/v1/me/visit-intents
```

Private lists: 401/403 without a session. Want/never must not appear on public Place JSON.

## Debug (Grafana MCP or PromQL)

Laptop: reload MCP after `./scripts/app start`. Query `up{job="catalog"}` via `grafana`.

Cloud Agents often have **no** grafana toolbox. Compose fallback (not public Prom):

```bash
curl -sS -G 'http://127.0.0.1:9091/api/v1/query' \
  --data-urlencode 'query=up{job="catalog"}'
curl -sS -u admin:admin -H 'content-type: application/json' \
  -d '{"queries":[{"refId":"A","datasource":{"type":"prometheus","uid":"prometheus"},"expr":"up{job=\"catalog\"}","instant":true}],"from":"now-5m","to":"now"}' \
  http://127.0.0.1:3030/api/ds/query
```

House SoR after [[ops/tickets/WF-041]] is Prom/Loki **from the test server** via Grafana MCP HTTP/SSE (`--disable-write`). Do not treat leftover `grafana.fishing-journals.com` as house. Do not publish Prometheus on the internet.

If health is UP but info SHA lags `main`: wait for the next `H/5` Jenkins run, or inspect job status via UI/MCP ([[ops/tickets/WF-042]]). Still no SSH.

## Must not

- `gh pr merge` from chat
- SSH to the VPS
- Chaos Monkey or primary ZAP against the public host as a deploy hook
- Secrets, PATs, or SSH keys in this note
