---
id: e2e-place-stub-mcp-2026-09-06
ticket: "[[tickets/E2E-001]]"
role: reviewer
started: 2026-09-06
finished: 2026-09-06
pr: https://github.com/tezball/my-island/pull/28
---

# Run e2e-place-stub-mcp-2026-09-06

Happy-path **MCP review** of the catalog stub on `tezball/my-island` `main` (PR #21). Canon: [[workflow/STACK-E2E-place-stub]] §7. Chaos was **not** enabled. [[tickets/E2E-001]] stays `ready` (not done).

## What happened

1. Fast-forwarded local `main` to `origin/main` (`b748fcf`, merge of PR #21).
2. Cloud Agent boot had started **stale** `postgres:17-alpine` (snapshot before PostGIS/catalog). Recreated volumes per [[workflow/LOCAL]]: `docker compose down -v && ./scripts/dev up`.
3. Default compose only (`./scripts/dev up`). No `compose.chaos.yml`, no `--profile chaos`. Catalog `SPRING_PROFILES_ACTIVE` unset.
4. HTTP smoke against **base URL** `http://127.0.0.1:8081`.
5. Optional Grafana/Postgres MCP: **not in this Cloud Agent session**. HTTP/SQL fallbacks only. Did not invent MCP servers.

## Compose (happy path)

| Service | Image / note | Host | Health |
|---|---|---|---|
| catalog | `my-island-catalog` | `127.0.0.1:8081` → 8080 | healthy |
| postgres | `postgis/postgis:17-3.5-alpine` | `127.0.0.1:5433` | healthy |
| grafana | `grafana/grafana:11.6.0` | `127.0.0.1:3030` | healthy |
| prometheus | `prom/prometheus:v3.2.1` | `127.0.0.1:9091` | healthy |
| loki | `grafana/loki:3.4.2` | `127.0.0.1:3101` | healthy |
| alertmanager | `prom/alertmanager:v0.28.1` | `127.0.0.1:9094` | healthy |

Chaos: **off**. Catalog env has JDBC + `APP_ENV=local` only. No `SPRING_PROFILES_ACTIVE`.

## HTTP smoke

Base: `http://127.0.0.1:8081`

| Method | Path | Status | Summary |
|---|---|---|---|
| GET | `/actuator/health` | **200** | `status: UP`; `db` PostgreSQL UP; `postgis` UP (`3.5 USE_GEOS=1 USE_PROJ=1 USE_STATS=1`); liveness/readiness UP |
| GET | `/actuator/prometheus` | **200** | `text/plain;version=0.0.4`; 16545 bytes / 261 lines; includes `jvm_memory_used_bytes` and `http_server_requests_*` |
| POST | `/api/v1/places` | **201** | Created `id=4e8a9083-ba66-4499-956f-d902cdc865e4`, `slug=mcp-review-campsite`, `Location: /api/v1/places/4e8a9083-ba66-4499-956f-d902cdc865e4`. Body: name MCP review campsite, category campsite, county kerry, town Waterville, lat/lon null, published false, partnerId null, facilities [] |
| GET | `/api/v1/places` | **200** | JSON array length 1; includes the created id |
| GET | `/api/v1/places/4e8a9083-ba66-4499-956f-d902cdc865e4` | **200** | Same resource as create |

Create body used (stub contract from PR #21):

```json
{"name":"MCP review campsite","categoryId":"campsite","countyId":"kerry","town":"Waterville"}
```

No auth (workshop exception). No booking/Stripe fields on the resource.

Contract check (not a chaos assault): POST with E2E-001 names `categorySlug` / `countySlug` → **400** `{"error":"countyId must not be blank"}`. See [[tickets/WF-016]].

## Optional MCP

This Cloud Agent session’s dynamic namespaces: Gmail, Google-calendar, Google-drive, Github, cursor-cloud, cursor-subscriptions, cursor.

| Server | In this session? | Notes |
|---|---|---|
| `grafana` (`mcp-grafana --disable-write`) | **No** | Laptop pack is `.cursor/mcp.json` stdio. Cloud Agents do not load it. Expected until [[tickets/WF-004]] / [[tickets/WF-010]]. **Did not invent a grafana MCP server.** |
| `postgres` (ops_reader SELECT-only) | **No** | Same stdio gap. |

### HTTP/SQL fallbacks (not MCP)

These prove scrape and data exist. They are **not** a substitute for §7 MCP.

| Probe | Result |
|---|---|
| Prometheus `GET http://127.0.0.1:9091/api/v1/targets` | job `catalog` **up**, scrape `http://catalog:8080/actuator/prometheus` |
| Prometheus PromQL `up{job="catalog"}` | **1** (`instance=catalog:8080`) |
| Prometheus PromQL `count(jvm_memory_used_bytes{job="catalog"})` | **8** |
| Grafana `GET /api/health` | database ok, version 11.6.0 |
| Grafana `POST /api/ds/query` PromQL `up{job="catalog"}` uid `prometheus` | status 200, value **1** (admin/admin local only — not recorded as a secret beyond house LOCAL.md) |
| `psql` as `ops_reader` on db `ops` | `SELECT` on `mcp_ping` OK |
| `psql` as `ops_reader` on db `catalog` | `permission denied for table place` → [[tickets/WF-015]] |
| `psql` as `ops` on db `catalog` | row `4e8a9083-…` / MCP review campsite present (writer role; not MCP) |

## Result

success — happy-path HTTP smoke green; chaos off; MCP optional surface **unavailable** in Cloud Agent (documented); two follow-up tickets ready.

## Follow-up

- Human: merge this ops PR after CI. Do not merge from an agent.
- Workshop Lead: next gate is **chaos** (`compose.chaos.yml` + `--profile chaos`). Do not turn chaos on in default `./scripts/dev up` or required CI.
- Paste block below to the E2E workshop room.
- Do **not** mark [[tickets/E2E-001]] done (STACK-E2E DoD still includes chaos + MCP).

## Workshop paste

```
E2E-001 happy-path MCP review (2026-09-06) — chaos NOT run.

Compose: ./scripts/dev up (after down -v for PostGIS). Catalog http://127.0.0.1:8081. SPRING_PROFILES_ACTIVE unset.

HTTP:
- POST /api/v1/places → 201 id 4e8a9083-ba66-4499-956f-d902cdc865e4 (body used categoryId/countyId)
- GET /api/v1/places → 200 list includes that id
- GET /api/v1/places/{id} → 200
- GET /actuator/health → 200 UP (postgres + postgis 3.5)
- GET /actuator/prometheus → 200 (jvm_memory_used_bytes present)
Prometheus job catalog is up; PromQL up{job="catalog"}==1. Grafana HTTP PromQL same (not MCP).

MCP grafana + postgres: NOT in Cloud Agent session (stdio .cursor/mcp.json). Expected until WF-004 / WF-010. Did not invent servers.

Gaps (new tickets, status ready, owner automation-expert):
- WF-015 ops_reader cannot SELECT catalog.place (MCP DSN is db ops)
- WF-016 E2E-001 field names (categorySlug/countySlug) 400 against stub (countyId required)

E2E-001 remains ready. Chaos is the next workshop gate.
```
