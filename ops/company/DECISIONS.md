---
title: CEO decisions
type: company
status: active
owner: orchestrator
created: 2026-09-05
---

# CEO decisions

Signed calls. Product freeze: [`product/SIGNED.md`](../../product/SIGNED.md). Canon for product house is [`product/STACK.md`](../../product/STACK.md). Do not re-litigate in a ticket.

## 2026-09-05 — Directory MVP, cleanup, house stack

**Terry.** Directory MVP is **signed** (CEO 2026-09-05 — [`product/SIGNED.md`](../../product/SIGNED.md)). Working tree is not a running consumer app.

| # | Decision | Where it lives |
|---|---|---|
| 1 | **Directory MVP** — phone-first curated Ireland directory (POI / experience / campsite / B&B), list + map, one-tap check-off (pre-signup), My Places, curator seed; discovery near-me / not-been-yet / nearby. **Out:** booking, payments, partner portals, reviews, messaging, native apps. **Success:** return tick rate. **Kill** if near-zero after a fair launch. | [`product/SIGNED.md`](../../product/SIGNED.md), [`product/MVP.md`](../../product/MVP.md), [`product/VISION.md`](../../product/VISION.md), [[tickets/PRD-000]] |
| 2 | **Cleanup.** `docs/` is past-company history only. Do not implement from it. Tag `legacy-platform` is archaeology only. Canon = `product/` + `ops/`. Draft PRs #2 / #4 / #5 / #7 **closed** by Orchestrator (2026-09-05). | [`docs/README.md`](../../docs/README.md), [[tickets/WF-008]] (done) |
| 3 | **Backend always Java / Spring Boot.** House rule. Permanent. Do not recommend TypeScript or FastAPI APIs as the default. | [`product/STACK.md`](../../product/STACK.md) |
| 4 | **UI light, easy, fast.** Thin Vite + React PWA (or equivalent). **Not** Next.js-heavy unless later evidence. | [`product/STACK.md`](../../product/STACK.md) |
| 5 | **Ruthless agent loop.** Solid tools + MCP servers + clear idea→prod workflows with logs, metrics, alerts. | [`product/STACK.md`](../../product/STACK.md) gaps |
| 6 | **Leads-only scrape.** Aggressive multi-source collection is approved for Research **leads** with provenance. Leads are not published places. Counsel before publish. No auth/CAPTCHA bypass. | [`data/leads/`](../../data/leads/README.md), [[tickets/PRD-006]] |

## Signed house (`product/STACK.md`)

Architecture’s draft is canon. Do not invent a competing stack.

| Layer | Lock | Ticket |
|---|---|---|
| Backend | Java / Spring Boot (permanent) | [[tickets/PRD-001]] (gated on `implement`) |
| Client | Vite + React light PWA, **not** Next | [[tickets/PRD-003]] (gated on `implement`) |
| Data | PostgreSQL 17 + PostGIS, Flyway | [[tickets/PRD-001]] |
| Observe | Grafana OSS MCP (`mcp-grafana`) | [[tickets/WF-004]] |
| CI | GitHub Actions; Playwright against job-started compose when the PWA exists | [[tickets/WF-011]] |
| CD | Staging auto on `main`; prod = GitHub Environment + human | [[tickets/WF-010]] |

### MCP gaps (must close for idea→prod)

| Gap | Ticket | Status |
|---|---|---|
| Remote / staging MCP (HTTP/SSE, not laptop stdio) | [[tickets/WF-004]] | blocked on [[tickets/WF-010]] |
| Alert → agent (Alertmanager webhook → Cloud Agent) | [[tickets/WF-009]] | inbox |

Host, OIDC provider, and curator-admin depth remain open in STACK.

**Do not build** the consumer app until a `PRD-*` ticket is `implement`.
