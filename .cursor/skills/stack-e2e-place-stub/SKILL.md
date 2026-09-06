---
name: stack-e2e-place-stub
description: >-
  Run the place-stub STACK-E2E drill (E2E-001): happy-path compose, HTTP
  create/list/get + actuators, mcp-grafana catalog scrape or PromQL HTTP
  fallback, and the opt-in compose chaos overlay. Use when an agent mentions
  E2E-001, STACK-E2E, chaos overlay, Chaos Monkey, mcp-grafana catalog scrape,
  or “MCP vs compose”.
---

# Place-stub STACK-E2E drill

Read [[runbooks/STACK_E2E_PLACE_STUB]] and copy its commands. Do **not** invent curl.

Handoff: `ops/workflow/STACK-E2E-place-stub.md`. Workshop: [[tickets/E2E-001]]. Proven run: [[runs/e2e-place-stub-mcp-chaos-2026-09-06]].

## Do this

1. Happy path: `./scripts/dev up` (no Spring profile `chaos`).
2. HTTP: create / list / get + `/actuator/health` + `/actuator/prometheus` from the runbook.
3. Observe: `mcp-grafana` PromQL `up{job="catalog"}` if those tools exist; else HTTP PromQL (Prometheus or Grafana). Postgres-RO is optional SELECT only.
4. Opt-in chaos: overlay + `--profile chaos` (see runbook). `--profile chaos` **without** `compose.chaos.yml` does nothing.
5. Write gaps in `ops/runs/` or a `WF-*` ticket. Automation owns gap tickets.
6. Restore default catalog. Leave compose up.

## Must not

- Set Spring profile `chaos` or compose profile `chaos` on **required CI** (`unit`, `catalog`, `stack` in `.github/workflows/ci.yml`). Chaos stays workshop-only.
- Attach chaos to default `./scripts/dev up` / `compose.yml` catalog.
- Expand into full [[tickets/PRD-001]], product UI, or booking.
- Touch [[tickets/WF-015]] (spine strip).
- Merge, prod-deploy, or put secrets in notes.

JSON create body uses the **stub contract**: `categoryId` / `countyId` / `latitude` / `longitude` (WF-018 decision: stub wins). Do not invent `categorySlug` / `countySlug` / `lon` / `lat`.

Cloud Agents often have **no** grafana MCP until a human adds dashboard stdio ([[workflow/MCP]]) — use the runbook HTTP fallback.
