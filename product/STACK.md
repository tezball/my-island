---
title: Stack
type: product
status: active
owner: Architecture
created: 2026-09-01
updated: 2026-09-05
---

# Stack

Technology decisions for the rebuild. Product capabilities live in `MVP.md`;
this document records the house they run in.

**CEO lock (2026-09-05):** Java / Spring backend is permanent. Architecture does
not re-litigate the house. Client stays **light and fast** (not a Next.js-heavy
monolith). Agents run idea→prod with logs, metrics and alerts through MCP.

Nothing here is running yet except the local compose observability stack.
These are constraints on the first service and UI commits.

## Decisions (signed)

| Layer | Choice | Notes |
|---|---|---|
| House | **Java + Spring Boot** | All backend services. New server-side work is not done in another language unless an exception is written here first. **Not open for overturn.** |
| Client | **Light TypeScript PWA** | Vite + React (or equivalent thin SPA). Phone-first, installable, offline-capable per `MVP.md` §3. **Not** Next.js App Router / full-stack Next — Spring owns the API. |
| Database | **PostgreSQL 17 + PostGIS** | Map/geo is a first-class MVP surface. One engine for relational + distance queries. |
| Migrations | **Flyway** in the API | Expand/contract only. Agents never ad-hoc DDL against shared envs. |
| Observability | **MCP, OSS first** | Logs, metrics, alerts via Grafana stack + `mcp-grafana`. Prefer $0 self-hosted. |
| CI | **GitHub Actions** | Required checks; Playwright against job-started compose. No Jenkins rebuild. |
| CD | Staging auto on `main`; prod = GitHub Environment + human | Agents open PRs. They do not merge to prod or push prod. |

Hosting (EU VPS / Fly / Railway / etc.) remains an open pick as long as it can
run the API + Grafana compose sidecars and meet NFRs. Object storage default:
MinIO local, S3-compatible (e.g. R2) in staging/prod.

## Java / Spring house

- Services are Spring Boot 3. Shared libraries, security, scheduling, data
  access and Actuator live in that stack.
- Shape from the previous build (Boot 3 + modern Java) may be reused.
  **Do not import the old domain** (`legacy-platform` tag is history only).
- Micrometer, structured JSON logging, and OpenTelemetry hooks are in from the
  first service skeleton — not bolted on before launch.
- Auth: Spring Security + OIDC (provider TBD). Feature flags may be DB-backed
  from the start; agents may toggle **staging** only.

## Client — light and fast

- **Vite + React + TypeScript PWA.** Meets `MVP.md` §3 (one-handed, map/list,
  installable, offline cache + queued check-offs).
- Same SPA for Explore and thin curator/admin via role routes.
- Talks only to the Spring API. No BFF-in-Next, no server components as the
  product surface.
- Prefer small bundles, lazy routes, modern image formats. Explore interactive
  target: <2.5s on mid-range Android over 4G.

## Logs, metrics, alerts — MCP and free

**Constraint.** Every environment that runs the app (local, staging, production)
exposes logs, metrics and alerts through MCP. Dashboards may exist for humans.
They are not a substitute for MCP. An agent that cannot query a signal does not
have that signal.

**Cost.** Self-hosted OSS first. A free SaaS tier is an escape hatch when a
small VPS cannot hold retention — same MCP, different URL. Paid vendors
(Datadog, New Relic, PagerDuty as the system of record) are out of scope until
this default is proven insufficient.

| Signal | Backend | Agent access |
|---|---|---|
| Metrics | Prometheus ← Micrometer `/actuator/prometheus` | `mcp-grafana` PromQL |
| Logs | Loki ← structured app logs | `mcp-grafana` LogQL |
| Alerts | Grafana Alerting + Alertmanager | `mcp-grafana` (agents `--disable-write`) |
| Traces | OpenTelemetry from commit one; Tempo when volume justifies | Same Grafana MCP once Tempo is a datasource |

One MCP covers the three core signals: official
[`mcp-grafana`](https://github.com/grafana/mcp-grafana). Analysis:
[`docs/automation/OBSERVABILITY_MCP_OPTIONS.md`](../docs/automation/OBSERVABILITY_MCP_OPTIONS.md).

**Must be true before the first production deploy:**

1. Prometheus, Loki and Alertmanager run beside the API in every env.
2. Core-path alerts exist (API down, 5xx, process up) and are visible over MCP.
3. Cloud / remote agents reach MCP over **HTTP/SSE**, not only laptop stdio.
4. Scrape and log endpoints are authenticated (Grafana service-account token).

Errors (NFR-09): structured logs + alerts + traces first. Sentry-class SaaS is
an escape hatch, not the default second system of record.

## MCP inventory (agent toolbox)

Checked into the repo as one pack, same servers locally and on staging.
Secrets from the environment, never committed. Agents get **read** on prod
observability; **write** on code and staging; **no** prod deploy, prod SQL
writes, or secret values.

| Server | Use | Scope |
|---|---|---|
| **mcp-grafana** | Logs, metrics, alerts (later traces) | RO token. Local + staging + prod datasources isolated. |
| **GitHub MCP** | PRs, checks, Actions, issues | Fine-grained PAT or GitHub App. No admin. |
| **Postgres MCP** | Read-only SQL | Staging first. `SELECT` only, timeout, row limit. No prod until replica + policy. |
| **Docker MCP** | Compose status / sidecar logs | Local + staging. Not prod. |
| **Browser / Playwright MCP** | Drive the running UI | Local + staging URLs only. |
| **Mailpit** (HTTP or thin MCP) | Assert outbound mail | Local + staging. No prod mail read. |

Not in the pack: Stripe (no payments in MVP), Jenkins, Notion (vault is `ops/`
in git), filesystem MCP (workspace is the files).

Tickets and company OS stay in the Obsidian vault at `ops/` (git). Agents edit
markdown via the repo, not a desktop-only vault MCP.

## Gaps (must close for idea→prod)

| Gap | Why it matters | Unblock |
|---|---|---|
| **Remote / staging MCP** | Cloud Agents cannot use laptop `.mcp.json` stdio | HTTP/SSE (or Cursor catalog) for Grafana + Postgres-RO on always-on EU staging |
| **Alert → agent** | On-call still human-only | Alertmanager webhook → Cursor automation / Cloud Agent with firing payload |
| **Always-on staging** | Nowhere safe for an agent to be wrong | Small EU staging from first deployable API + web |
| **Required Playwright in CI** | Agents ship UI that “looks right” in a screenshot | Playwright required on PR; job starts compose |
| **Image registry + digest deploys** | Cannot roll back a bad agent deploy | GHCR; deploy by SHA digest |
| **Deploy MCP** | Host pick may lack a first-class MCP | Prefer hosts with API/`fly`/`gh` scriptability; accept CLI until a connector exists |
| **Auth provider console** | OIDC setup is often dashboard-only | Document human one-time setup; agents use Spring config thereafter |

## Still open (non-house)

| Item | Constraint |
|---|---|---|
| Exact host (Fly / Hetzner / Railway / …) | EU latency, backups, runs Grafana sidecars |
| OIDC / IdP choice | Works with Spring Security; GDPR-friendly |
| Curator admin depth | Thin role routes in the PWA vs separate tool — Product |

## Overturning

| Decision | Policy |
|---|---|---|
| Java / Spring house | **Locked by CEO 2026-09-05.** Architecture does not overturn. A second backend language requires a written exception here plus CEO/Orchestrator sign-off. |
| Light TS PWA (not Next-heavy) | Locked with the house decision. Moving to a heavy full-stack JS framework needs Architecture + Product note. |
| Observability via MCP, OSS first | Medium cost to change backends if `mcp-grafana` (or one equivalent MCP) still covers logs, metrics and alerts. **Dropping MCP access is not allowed.** |
| Postgres + PostGIS | High once geo queries and migrations exist. Change only with Architecture note. |
