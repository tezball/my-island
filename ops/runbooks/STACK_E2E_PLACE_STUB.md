---
title: Place-stub STACK-E2E drill (MCP vs compose chaos)
type: runbook
---

# Place-stub STACK-E2E drill

Skill: `.cursor/skills/stack-e2e-place-stub/SKILL.md`. Policy: [[workflow/STACK-E2E-place-stub]]. Local ports: [[workflow/LOCAL]]. MCP pack: [[workflow/MCP]].

**Required CI must not** set Spring profile `chaos` or compose profile `chaos` (`compose.chaos.yml` is not a CI file). `catalog` is `./mvnw -B test`. `stack` is `./scripts/dev up`. Workshop overlay only.

Copy these commands. Do not invent curl. No auth on this stub (workshop exception).

## 1. Happy path

```bash
./scripts/dev up
```

Catalog `SPRING_PROFILES_ACTIVE` stays **unset**. If Postgres was `postgres:17-alpine` before PostGIS: `docker compose down -v && ./scripts/dev up`.

Check: `docker compose exec catalog sh -c 'printenv SPRING_PROFILES_ACTIVE || true'` prints nothing.

## 2. HTTP create / list / get + actuators

Stub contract (`categoryId` / `countyId` / `latitude` / `longitude`; WF-018 decision: stub wins):

```bash
curl -sS -D - -o /tmp/place.json -X POST http://127.0.0.1:8081/api/v1/places \
  -H 'content-type: application/json' \
  -d '{"name":"Skellig Michael","slug":"skellig-michael","categoryId":"poi","countyId":"kerry","town":"Portmagee","latitude":51.7708,"longitude":-10.5406,"published":true}'
# expect HTTP 201 (or 409 if that slug already exists — then skip ID extract, GET by slug)

curl -sS -o /tmp/places.json -w 'list %{http_code}\n' http://127.0.0.1:8081/api/v1/places
# expect 200

ID=$(python3 -c 'import json; print(json.load(open("/tmp/place.json"))["id"])')
curl -sS -o /dev/null -w 'get-id %{http_code}\n' "http://127.0.0.1:8081/api/v1/places/$ID"
curl -sS -o /dev/null -w 'get-slug %{http_code}\n' http://127.0.0.1:8081/api/v1/places/skellig-michael
curl -sS -o /dev/null -w 'health %{http_code}\n' http://127.0.0.1:8081/actuator/health
curl -sS -o /dev/null -w 'prom %{http_code}\n' http://127.0.0.1:8081/actuator/prometheus
```

Expect: create **201**, list/get **200**, health **200** (`UP`, PostGIS), prometheus **200** `text/plain`. `/actuator/chaosmonkey` is **404** (exposure is health, info, prometheus only). 500 JSON from later chaos has **no** chaos marker in the body — read catalog logs.

## 3. Observe (MCP or HTTP)

Prefer `mcp-grafana` PromQL `up{job="catalog"}` → **1** while catalog is healthy. `--disable-write`. Postgres MCP: `SELECT` only. `postgres` → db `ops` (`mcp_ping`). `postgres-catalog` → db `catalog` (`place`). Grants are compose SQL + `./scripts/dev up` ([[tickets/WF-016]], [[workflow/MCP]]).

If those MCP tools are **missing** (Cloud Agent until a human adds dashboard **stdio** matching `.cursor/mcp.json`), HTTP:

```bash
curl -sS -G 'http://127.0.0.1:9091/api/v1/query' --data-urlencode 'query=up{job="catalog"}'
# expect "status":"success" and value "1"

curl -sS -u admin:admin -H 'content-type: application/json' \
  -d '{"queries":[{"refId":"A","datasource":{"type":"prometheus","uid":"prometheus"},"expr":"up{job=\"catalog\"}","instant":true}],"from":"now-5m","to":"now"}' \
  http://127.0.0.1:3030/api/ds/query
# expect results.A.status 200; local Grafana is admin/admin ([[workflow/LOCAL]])

PGPASSWORD=ops_reader psql -h 127.0.0.1 -p 5433 -U ops_reader -d catalog -c 'SELECT id, slug, name FROM place LIMIT 20'
```

Missing MCP is **not** a failed drill. Use HTTP. Do not put tokens in notes. Do not register HTTP MCP against `127.0.0.1` for Cloud Agents (Cursor proxies HTTP off-VM).

## 4. Opt-in chaos overlay

`--profile chaos` on `compose.yml` **alone** leaves `SPRING_PROFILES_ACTIVE` unset. Overlay:

```bash
docker compose -f compose.yml -f compose.chaos.yml --profile chaos up -d catalog --wait
docker compose exec catalog printenv SPRING_PROFILES_ACTIVE
# expect chaos,chaos-monkey
```

Kill stays off. Health usually stays **200**. Place HTTP may **500** (generic Spring body) or slow **200**. Repeat list/get/create a few times. Logs: `Chaos Monkey - RuntimeException`. Write each gap in `ops/runs/` or a ticket. **Automation** owns gap tickets.

## 5. Overlay down / restore default

```bash
docker compose -f compose.yml up -d catalog --wait
docker compose exec catalog sh -c 'printenv SPRING_PROFILES_ACTIVE || true'
# expect unset. Health 200. List 200 without multi-second latency.
```

Do not leave the overlay on default `./scripts/dev up`.

## Must not

- Required CI: no `compose.chaos.yml`, no `--profile chaos`, no `SPRING_PROFILES_ACTIVE: chaos`.
- Toxiproxy / Gremlin / Chaos Mesh.
- Product UI. Merge. Prod Grafana writes. Secrets in `ops/`.
