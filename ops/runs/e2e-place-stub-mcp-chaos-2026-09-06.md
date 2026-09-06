---
id: E2E-001
ticket: "[[tickets/E2E-001]]"
role: automation-expert
started: 2026-09-06
finished: 2026-09-06
pr: https://github.com/tezball/my-island/pull/30
---

# Run e2e-place-stub MCP/chaos 2026-09-06

Cloud Agent workshop pass on `tezball/my-island` `main` after PR #21. Hat: [[agents/roles/automation-expert]]. **Not** full [[tickets/PRD-001]]. Did not merge. Did not enable chaos in required CI. [[tickets/E2E-001]] stays `ready`.

Handoff: [[workflow/STACK-E2E-place-stub]]. Canvas: [[workflow/e2e-place-stub]].

## What happened

VM had booted the **pre-stub** compose (`postgres:17-alpine`, no catalog) from a stale snapshot. Recreated per [[workflow/LOCAL]]: `docker compose down -v && ./scripts/dev up`. PostGIS 17-3.5 + catalog image built and became healthy.

### Happy path (`./scripts/dev up`, no chaos)

`SPRING_PROFILES_ACTIVE` in catalog: **unset**. No `CHAOS*` env.

| Surface | URL | Status | Notes |
|---|---|---|---|
| Create | `POST http://127.0.0.1:8081/api/v1/places` | **201** | 93ms. UUID `3670e599-b81c-45ff-b46d-470e083c0c97`, slug `skellig-michael`, category `poi`, county `kerry`, PostGIS lon/lat |
| List | `GET http://127.0.0.1:8081/api/v1/places` | **200** | 16ms. Count 1, includes created id |
| Get | `GET http://127.0.0.1:8081/api/v1/places/{id}` | **200** | 8ms |
| Get slug | `GET http://127.0.0.1:8081/api/v1/places/skellig-michael` | **200** | stub also accepts slug |
| Health | `GET http://127.0.0.1:8081/actuator/health` | **200** | `UP`; `db` PostgreSQL; `postgis` 3.5 |
| Prometheus | `GET http://127.0.0.1:8081/actuator/prometheus` | **200** | 16550 bytes, `text/plain;version=0.0.4` |
| Grafana | `GET http://127.0.0.1:3030/api/health` | **200** | 11.6.0, database ok |

Workshop exception: **no auth** on the stub (called out on PR #21). Payload used stub fields `categoryId` / `countyId` (not the ticket’s `categorySlug` / `countySlug` names).

### Observe (HTTP vs MCP)

| Check | Result |
|---|---|
| Prometheus scrape `catalog:8080` `/actuator/prometheus` | **up{job="catalog"}=1** via `http://127.0.0.1:9091/api/v1/query` |
| Grafana datasource Prometheus PromQL `up{job="catalog"}` | **1** via `POST http://127.0.0.1:3030/api/ds/query` (admin basic, already documented locally) |
| `http_server_requests_seconds_count` after smoke | SUCCESS 200 on `/actuator/health` and `/actuator/prometheus` (place series appear after next scrape) |
| Postgres `ops_reader` @ db `ops` | `SELECT` `mcp_ping` **ok** |
| Postgres `ops_reader` @ db `catalog` | `SELECT` `place` → **permission denied** |
| `mcp-grafana` / Postgres MCP tools on this Cloud Agent | **missing** — namespaces were GitHub, Gmail, Calendar, Drive, cursor-cloud, subscriptions. `.cursor/mcp.json` stdio is not in the toolbox. `uvx` is installed. **Expected until [[tickets/WF-004]] / [[tickets/WF-010]] for remote staging; still a local-compose DX hole → [[tickets/WF-015]]** |
| `/actuator/chaosmonkey` | **404** (exposed: health, info, prometheus only) |

Cloud environment snapshot `environmentJson` ports listed Grafana/Prometheus/Loki/Alertmanager/Postgres but **not** Catalog `:8081`. Repo `.cursor/environment.json` already has Catalog; the running snapshot is behind `main`. HTTP from inside the VM still reached 8081.

### Chaos (opt-in overlay only)

`docker compose --profile chaos up` **without** `compose.chaos.yml` did **not** set Spring profiles (catalog stayed `<unset>`).

Documented equivalent:

```bash
docker compose -f compose.yml -f compose.chaos.yml --profile chaos up -d catalog --wait
```

Then `SPRING_PROFILES_ACTIVE=chaos,chaos-monkey`. Logs: Chaos Monkey banner, profiles `chaos` + `chaos-monkey`. Kill stayed off (`kill-application-active: false`). Catalog remained **healthy**.

Assaults (latency 1–3s **and** exceptions, watchers `restController` + `service`):

| Assault | n | Codes | Slow ≥0.9s | Symptom |
|---|---|---|---|---|
| `GET /api/v1/places` | 25 | 18×500, 7×200 | 11 | 200s took 2.2–5.6s (happy path was 16ms). 500 body is generic Spring JSON — no “chaos” string |
| `GET /api/v1/places/{id}` | 20 | 17×500, 3×200 | 8 | 200s 3.9–5.7s |
| `GET /actuator/health` | 8 | 8×200 | 0 | Probes not assaulted; compose healthcheck still green |
| `POST /api/v1/places` | 8 | 7×500, 1×201 | 6 | One create succeeded (`chaos-place-6`) in 4.5s |

Logs: `Chaos Monkey - exception` / `java.lang.RuntimeException: Chaos Monkey - RuntimeException`. Prometheus after scrape: `http_server_requests_seconds_count{status="500",exception="RuntimeException"}` on `/api/v1/places` (18) and `/api/v1/places/{idOrSlug}` (17).

Restored default catalog (`docker compose -f compose.yml up -d catalog`). `SPRING_PROFILES_ACTIVE` **unset**. Health 200 ~38ms, list 200 ~41ms.

CI `.github/workflows/ci.yml` `catalog` job is `./mvnw -B test` (no chaos profile). `stack` job is `./scripts/dev up` (no overlay). Unchanged.

## Result

success — happy smoke proved; ≥2 gaps filed as [[tickets/WF-015]] and [[tickets/WF-016]]. E2E-001 not marked done.

## Follow-up

- [[tickets/WF-015]] — attach mcp-grafana + Postgres-RO (catalog SELECT) to Cloud Agents against local compose
- [[tickets/WF-016]] — skill + runbook for the MCP/HTTP + chaos overlay drill
- Staging remote MCP remains [[tickets/WF-004]] / [[tickets/WF-010]] (blocked)
- Human merges this PR. Agents do not merge.
