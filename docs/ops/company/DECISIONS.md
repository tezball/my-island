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
| 1 | **Directory MVP** — phone-first curated Ireland directory (POI / experience / campsite / B&B), list + map, one-tap check-off (pre-signup), My Places, curator seed; discovery near-me / not-been-yet / nearby. **Out:** booking, payments, partner portals, reviews, messaging, native apps. **Success:** return tick rate. **Kill** if near-zero after a fair launch. | [`product/SIGNED.md`](../../product/SIGNED.md), [`product/MVP.md`](../../product/MVP.md), [`product/VISION.md`](../../product/VISION.md), [[ops/tickets/PRD-000]] |
| 2 | **Cleanup.** `docs/` is past-company history only. Do not implement from it. Tag `legacy-platform` is archaeology only. Canon = `product/` + `ops/`. Draft PRs #2 / #4 / #5 / #7 **closed** by Orchestrator (2026-09-05). | [`docs/README.md`](../../README.md), [[ops/tickets/WF-008]] (done) |
| 3 | **Backend always Java / Spring Boot.** House rule. Permanent. Do not recommend TypeScript or FastAPI APIs as the default. | [`product/STACK.md`](../../product/STACK.md) |
| 4 | **UI light, easy, fast.** Thin Vite + React PWA (or equivalent). **Not** Next.js-heavy unless later evidence. | [`product/STACK.md`](../../product/STACK.md) |
| 5 | **Ruthless agent loop.** Solid tools + MCP servers + clear idea→prod workflows with logs, metrics, alerts. | [`product/STACK.md`](../../product/STACK.md) gaps |
| 6 | **Leads-only scrape.** Aggressive multi-source collection is approved for Research **leads** with provenance. Leads are not published places. Counsel before publish. No auth/CAPTCHA bypass. | [`data/leads/`](../../data/leads/README.md), [[ops/tickets/PRD-006]], [[ops/tickets/PRD-007]], [[ops/tickets/PRD-009]] |

## Signed house (`product/STACK.md`)

Architecture’s draft is canon. Do not invent a competing stack.

| Layer | Lock | Ticket |
|---|---|---|
| Backend | Java / Spring Boot (permanent) | [[ops/tickets/PRD-001]] (plan [[ops/plans/PRD-001]] approved; `implement`) |
| Client | Vite + React light PWA, **not** Next | [[ops/tickets/PRD-003]] (gated on `implement`) |
| Data | PostgreSQL 17 + PostGIS, Flyway | [[ops/tickets/PRD-001]] |
| Observe | Grafana OSS MCP (`mcp-grafana`) | [[ops/tickets/WF-004]] |
| CI | GitHub Actions; Playwright against job-started compose when the PWA exists | [[ops/tickets/WF-011]] |
| CD | `main` is git; **no production Environment** (CEO 2026-09-12). Ready PRs auto-merge when CI is green. | [[ops/tickets/WF-025]] |

### MCP gaps (must close for idea→prod)

| Gap | Ticket | Status |
|---|---|---|
| Remote / staging MCP (HTTP/SSE, not laptop stdio) | [[ops/tickets/WF-004]] | blocked on [[ops/tickets/WF-010]] |
| Alert → agent (Alertmanager webhook → Cloud Agent) | [[ops/tickets/WF-009]] | inbox |

Host, OIDC provider, and curator-admin depth remain open in STACK.

**Do not build** the consumer app until a `PRD-*` ticket is `implement`.

## 2026-09-12 — No production; ready PRs merge themselves

**Terry.** This project **has no production environment and probably never will.** Relax the old “humans merge / no prod deploy” posture that assumed a fleet.

| # | Decision | Where it lives |
|---|---|---|
| 7 | **No prod.** No GitHub Environment prod gate, no `compose.prod`, no prod SSH. Local compose is the runtime. Do not block agent work on a hypothetical prod. | this note, [[ops/workflow/SAFETY]], `.cursor/rules/no-prod.mdc` |
| 8 | **Ready PRs auto-review, approve, and squash-merge** when CI `unit` + `catalog` + `stack` are green. Drafts and forks never auto-merge. Chat reviewer hat still does not merge. | [[ops/tickets/WF-025]], [[ops/workflow/CI]] |

CD line in [`product/STACK.md`](../../product/STACK.md): `main` is git; there is no prod Environment. Staging tickets ([[ops/tickets/WF-010]]) are separate and not a prod stand-in.
