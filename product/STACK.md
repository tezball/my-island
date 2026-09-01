---
title: Stack
type: product
status: active
owner: Product
created: 2026-09-01
---

# Stack

Technology decisions for the rebuild. Product capabilities still live in
`MVP.md`; this document records the house they run in.

Nothing here is running yet. These are constraints on the first commit.

## Decisions

| Layer | Choice | Notes |
|---|---|---|
| House | **Java + Spring** | All backend services are Spring Boot. New server-side work is not done in another language unless the exception is written down here first. |
| Observability | **MCP, OSS first** | Logs, metrics and alerts are cross-cutting concerns. Agents and operators query them through MCP. Prefer $0 self-hosted. Paid APM is not the interface. |
| Client | Open against `MVP.md` §3 | Phone-first PWA, installable, offline-capable. Framework is not prescribed; the API it talks to is Spring. |

Database, hosting and the specific client framework remain unchosen in this
file. Proposed defaults (Postgres+PostGIS, Vite/React PWA, GitHub Actions,
remote MCP pack) live in [`ENGINEERING.md`](ENGINEERING.md) until signed.

## Java / Spring house

- Services are Spring Boot. Shared libraries, security, scheduling, data access
  and Actuator live in that stack.
- The previous build was Spring Boot 3 + Java 25. Reuse that shape unless a
  requirement in `MVP.md` forces a change. Do not import the old domain.
- Micrometer and structured logging are in from the first service skeleton —
  not bolted on before launch. They are how the observability constraint is met.

## Logs, metrics, alerts — MCP and free

**Constraint.** Every environment that runs the app (local, staging, production)
exposes logs, metrics and alerts through MCP. Dashboards may exist for humans.
They are not a substitute for MCP. An agent that cannot query a signal does not
have that signal.

**Cost.** Self-hosted OSS first. A free SaaS tier is an escape hatch when a
small VPS cannot hold retention — same MCP, different URL. Paid vendors
(Datadog, New Relic, PagerDuty as the system of record) are out of scope until
this default is proven insufficient.

**Default (researched, $0 + VPS):**

| Signal | Backend | Agent access |
|---|---|---|
| Metrics | Prometheus (Micrometer `/actuator/prometheus`) | `mcp-grafana` PromQL |
| Logs | Loki (structured app logs shipped from the API) | `mcp-grafana` LogQL |
| Alerts | Grafana Alerting + Alertmanager | `mcp-grafana` (read-only for agents) |

One MCP covers all three signals: official [`mcp-grafana`](https://github.com/grafana/mcp-grafana),
run with `--disable-write` for agents. Option analysis and rejected
alternatives: [`docs/automation/OBSERVABILITY_MCP_OPTIONS.md`](../docs/automation/OBSERVABILITY_MCP_OPTIONS.md)
(written against the previous compose; the recommendation still holds).

**Must be true before the first production deploy:**

1. Prometheus, Loki and Alertmanager run beside the API, not as a laptop-only
   afterthought.
2. Core-path alerts exist (API down, 5xx, process up) and are visible over MCP.
3. Cloud / remote agents reach MCP over HTTP/SSE, not only a developer's
   `.mcp.json` stdio.
4. Scrape and log endpoints are authenticated. Grafana uses a service-account
   token, not `admin`/`admin`, outside local throwaway compose.

## What this does not decide

| Still open | Why |
|---|---|
| PostgreSQL vs something else | Spring Data does not require a pick today; maps and geo queries will |
| Where we host | Must fit NFR performance, backups, and the observability compose |
| Client framework | Must meet `MVP.md` §3 (one-handed, installable, offline). Spring serves the API either way |
| Error tracking product | NFR-09 requires error tracking. Sentry-class SaaS is not required if logs + alerts cover it; do not add a second paid sink by default |

## Overturning

| Decision | Cost to reverse |
|---|---|
| Java / Spring house | High once services exist. A second backend language is a documented exception, not a convenience. |
| Observability via MCP, OSS first | Medium. Switching backends is fine if `mcp-grafana` (or an equivalent single MCP) still covers logs, metrics and alerts. Dropping MCP access is not. |
