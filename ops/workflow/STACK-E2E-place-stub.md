---
title: Place-listing stub — stack E2E handoff
type: workflow
status: draft
owner: Architecture
created: 2026-09-06
---

# Place-listing stub — stack E2E handoff

CEO/PA handoff draft for [[tickets/E2E-001]]. Plumbing + gap-finding. **Not** full [[tickets/PRD-001]]. House stays [`product/STACK.md`](../../product/STACK.md) — do not rewrite it.

Workshop: [[workshops/e2e-place-stub]]. Canvas: [[e2e-place-stub]] (`ops/workflow/e2e-place-stub.canvas`).

## 1. Purpose

Prove agents can boot a Spring catalog stub, exercise create/list/get, scrape actuators, then run chaos and **write gaps**. Success is plumbing and tickets, not the directory MVP.

## 2. Stub scope

Spring `services/catalog`:

| Surface | In |
|---|---|
| `POST /api/v1/places` | create |
| `GET /api/v1/places` | list |
| `GET /api/v1/places/{id}` | get by id |
| `/actuator/health` | liveness/readiness |
| `/actuator/prometheus` | Micrometer scrape |

**Workshop exception:** no auth. Do not copy into later product APIs.

**Out:** UI, booking, Stripe, inventory, visits API, images.

## 3. Compose happy path

Default `./scripts/dev up`. Chaos is **not** active. Catalog (when present) boots without Spring profile `chaos`.

## 4. Compose chaos

Opt-in only. `--profile chaos` on `compose.yml` alone is **not** enough (catalog env stays unset). Documented equivalent ([[LOCAL]]):

```bash
docker compose -f compose.yml -f compose.chaos.yml --profile chaos up -d catalog --wait
```

Catalog gets `SPRING_PROFILES_ACTIVE=chaos,chaos-monkey`. Default `./scripts/dev up` stays clean — do not attach the chaos profile to the default service.

## 5. Chaos Monkey

- Library: `de.codecentric:chaos-monkey-spring-boot` (Spring Boot 3).
- On Spring profile `chaos` only (`chaos.monkey.enabled=true` in `application-chaos.yml`).
- Assaults: **latency** + **exceptions**. Kill-application **off** unless a gap ticket asks for it.
- Watchers: `restController` + `service`.
- Run ≥2 assaults. Write each gap in `ops/runs/` or a ticket. **Automation** owns gap tickets ([[agents/roles/automation-expert]]).
- **Out:** Toxiproxy, Gremlin, Chaos Mesh.

## 6. CI

Catalog module tests on PR (happy-path create/list/get + actuators). **Never** enable chaos (compose profile or Spring `chaos`) in required green CI.

## 7. MCP review surface

After local/compose up:

1. HTTP against catalog (`POST`/`GET` places, actuators). Repeatable: `./scripts/sim-place-listing.sh` ([[runbooks/PLACE_LISTING_SIM]], [[tickets/WF-019]]). Cloud Agents can curl `127.0.0.1:8081` when compose is up. Stub JSON uses `categoryId`/`countyId`/`latitude`/`longitude` (same names as [[tickets/E2E-001]]).
2. Optional: Postgres-RO MCP (`SELECT` only). `.cursor/mcp.json` targets db `ops`. Catalog `place` SELECT for `ops_reader` is **TODO Engineering** (grants + optional second DSN) — see [[tickets/WF-016]] / [[workflow/MCP]].
3. Optional: `mcp-grafana` PromQL against the catalog `/actuator/prometheus` scrape. Laptop Cursor loads `.cursor/mcp.json` stdio. Cloud Agents must have matching **stdio** servers on cursor.com (they do not inherit mcp.json; `environment.json` cannot attach MCP). Until then, HTTP Grafana/Prometheus is the fallback ([[runbooks/STACK_E2E_PLACE_STUB]], [[workflow/MCP]]). Staging/prod remote MCP stays [[tickets/WF-004]] / [[tickets/WF-010]].

Drill procedure: [[runbooks/STACK_E2E_PLACE_STUB]] (skill `.cursor/skills/stack-e2e-place-stub/SKILL.md`; ticket [[tickets/WF-017]]).

## 8. Definition of done

- [ ] Stub boots on compose (happy path).
- [ ] Happy create / list / get + `/actuator/health` + `/actuator/prometheus`.
- [ ] Chaos profile run; ≥2 written gaps (`ops/runs/` or tickets).
- [ ] Refs: [[tickets/E2E-001]] · [[e2e-place-stub]] (`ops/workflow/e2e-place-stub.canvas`) · [`product/STACK.md`](../../product/STACK.md).
