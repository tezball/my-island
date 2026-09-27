---
title: Stack
type: product
status: active
owner: Architecture
created: 2026-09-01
updated: 2026-09-19
---

# Stack

Technology decisions for the rebuild. Product capabilities live in
[`MVP.md`](MVP.md); this document records the house they run in.

**CEO lock (2026-09-05):** Java / Spring backend is permanent. Architecture does
not re-litigate the house. Client stays **light and fast** (not a Next.js-heavy
monolith). Agents run idea→`main` with logs, metrics and alerts through MCP.
There is **no production environment** and probably never will be (CEO 2026-09-12). **Dated exception (decision 39, 2026-09-26), this product only:** the host is https://fishing-journals.com. The current VPS is still one machine until a later split. Do not add a GitHub Environment named `production`, `compose.prod`, or a prod SSH path.

Local compose (`./scripts/app start`) is the agent **runtime**. Mock-prod
(https://fishing-journals.com/, not a GitHub `production` Environment) already
serves the Ireland POI directory. House observe **source of truth** after
[[ops/tickets/WF-041]] is Prometheus/Loki data **from that test server**, read
via Grafana MCP HTTP/SSE (laptop Grafana uses the same datasources). Local
compose Grafana remains a workshop fallback — not the agent SoR. These remain
constraints on new services and UI.

## Decisions (signed)

| Layer | Choice | Notes |
|---|---|---|
| House | **Java + Spring Boot** | All backend services. New server-side work is not done in another language unless an exception is written here first. **Not open for overturn.** |
| Client | **Light TypeScript PWA** | Vite + React (or equivalent thin SPA). Phone-first, installable, offline-capable per `MVP.md` §3. **Not** Next.js App Router / full-stack Next — Spring owns the API. |
| Database | **PostgreSQL 17 + PostGIS** | Map/geo is a first-class MVP surface. One engine for relational + distance queries. |
| Migrations | **Flyway** in the API | Expand/contract only. Agents never ad-hoc DDL against shared envs. |
| Observability | **MCP, OSS first** | Logs, metrics, alerts via Grafana stack + `mcp-grafana`. Prefer $0 self-hosted. |
| CI | **Jenkins** (local compose + JCasC); GHA dual-run for remote PRs | Clone→`./scripts/dev up` → :8085. Same `unit`/`catalog`/`stack` contract. Dedicated chaos + ZAP jobs: [[ops/tickets/WF-043]] · [[ops/tickets/WF-044]]. No legacy Jenkins restore. [[ops/tickets/WF-031]] |
| CD | **No production Environment.** `main` is git. Local compose is the runtime. Ready PRs squash-merge when CI is green **and** a valid non-author `APPROVED` exists ([[ops/tickets/WF-050]]). This product is served at https://fishing-journals.com via Jenkins `deploy-mock-prod` ([[ops/tickets/WF-040]], decision 39). | Decision 39 (2026-09-26) names that host for this product only. The VPS is still one machine until a later split. Agents do not invent `compose.prod` or a prod SSH path. Agents never SSH; the key stays in Jenkins. |

The public host is the existing fishing-journals.com VPS (CEO 2026-09-13, decision 14). Decision 39 (2026-09-26) calls that same machine this product’s production host. It is still one machine until a later split. A
separate always-on staging-with-Grafana-sidecars box remains the open pick on
[[ops/tickets/WF-010]] (still blocked). Object storage default: MinIO local,
S3-compatible later. Do not treat Vercel as the default host.

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
[`docs/automation/OBSERVABILITY_MCP_OPTIONS.md`](../automation/OBSERVABILITY_MCP_OPTIONS.md).

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
| **Browser / Playwright MCP** | Drive the running UI | Local + staging / mock-prod URLs only. |
| **IntelliJ MCP** | Inspections, build, symbols via IDEA 2025.2+ | **Laptop.** IDE open. Not Cloud Agents. [[ops/tickets/WF-034]] |
| **Mailpit** (HTTP or thin MCP) | Assert outbound mail | Local + staging. No prod mail read. **Not packed yet.** |
| **Jenkins / deploy status** | Job status + deploy-on-main | Mock-prod. Key stays in Jenkins. Ticket: [[ops/tickets/WF-042]] |
| **Gatling** | Light trickle on fishing-journals.com + weekly full perf (MCP/manual) | Not merge load. Failures → Jenkins red + Grafana/AM. Ticket: [[ops/tickets/WF-042]] · [[ops/tickets/WF-045]] |
| **Chaos Monkey (CI)** | Retries + default fallbacks | Dedicated **merge** job. Not cron. Ticket: [[ops/tickets/WF-043]] |
| **ZAP-style DAST (CI)** | Every merge vs local compose/Testcontainers | Not cron. Not primary public-host scan. Ticket: [[ops/tickets/WF-044]] |
| **Catalog Place writes** | None on public HTTP | Seed/import in CI/deploy only. Close `POST /api/v1/places`. Guests write VisitIntent only. Ticket: [[ops/tickets/WF-046]] |

Not in the pack: Stripe (no live payments; booking mock PSP is [[ops/tickets/PRD-018]]), Notion (vault is `ops/`
in git), filesystem MCP (workspace is the files). Local Jenkins is compose
house CI ([[ops/tickets/WF-031]]). Jenkins **as MCP** is [[ops/tickets/WF-042]],
not a second CD system.

Tickets and company OS stay in the Obsidian vault at `ops/` (git). Agents edit
markdown via the repo, not a desktop-only vault MCP.

## Gaps (must close for idea→prod)

| Gap | Why it matters | Unblock |
|---|---|---|
| **Remote / staging MCP** | Cloud Agents cannot use laptop `.mcp.json` stdio | Observe lock C: test-server Prom/Loki + Grafana MCP HTTP/SSE ([[ops/tickets/WF-041]]). Do not leave agents on local-compose-only metrics. Do not publish Prometheus. Generic staging/prod MCP remains [`WF-004`](../ops/tickets/WF-004.md) (blocked on [`WF-010`](../ops/tickets/WF-010.md)). |
| **Alert → agent** | On-call still human-only for spawn | Agents **read** Jenkins + AM via MCP now ([[ops/tickets/WF-045]]). Webhook spawn remains [`ops/tickets/WF-009.md`](../ops/tickets/WF-009.md). Mute leftover FJ email ([[ops/tickets/INC-001]]). |
| **Always-on staging** | Nowhere safe for an agent to be wrong | Small EU staging from first deployable API + web. Ticket: [`ops/tickets/WF-010.md`](../ops/tickets/WF-010.md) |
| **Required Playwright in CI** | UI coverage without blocking merge | **Not a merge gate.** Cron vs fishing-journals.com (6h) + MCP on demand. Ticket: [`ops/tickets/WF-011.md`](../ops/tickets/WF-011.md) |
| **Open `POST /api/v1/places`** | Anyone can create Places on the public catalog | **Catalog writes lock C:** close it. Seed/import in CI/deploy. Guests write VisitIntent only. Ticket: [`ops/tickets/WF-046.md`](../ops/tickets/WF-046.md) |
| **Image registry + digest deploys** | Cannot roll back a bad agent deploy | GHCR; deploy by SHA digest |
| **Deploy MCP** | Host pick may lack a first-class MCP | Prefer hosts with API/`fly`/`gh` scriptability; accept CLI until a connector exists |
| **Auth provider console** | OIDC setup is often dashboard-only | Document human one-time setup; agents use Spring config thereafter |

## Still open (non-house)

| Item | Constraint |
|---|---|
| Exact host (Fly / Hetzner / Railway / …) | EU latency, backups, runs Grafana sidecars |
| OIDC / IdP choice | Works with Spring Security; GDPR-friendly |
| Curator admin depth | Thin role routes in the PWA vs separate tool — Product |

## Overturning

| Decision | Policy |
|---|---|
| Java / Spring house | **Locked by CEO 2026-09-05.** Architecture does not overturn. A second backend language requires a written exception here plus CEO/Orchestrator sign-off. |
| Light TS PWA (not Next-heavy) | Locked with the house decision. Moving to a heavy full-stack JS framework needs Architecture + Product note. |
| Observability via MCP, OSS first | Medium cost to change backends if `mcp-grafana` (or one equivalent MCP) still covers logs, metrics and alerts. **Dropping MCP access is not allowed.** |
| Postgres + PostGIS | High once geo queries and migrations exist. Change only with Architecture note. |
