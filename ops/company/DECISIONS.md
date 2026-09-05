---
title: CEO decisions
type: company
status: active
owner: orchestrator
created: 2026-09-05
---

# CEO decisions

Signed calls. Canon for product house is [`product/STACK.md`](../../product/STACK.md). Do not re-litigate in a ticket.

## 2026-09-05 — Directory MVP, cleanup, house stack

**Terry.** Directory MVP is **signed as Product drafted**. Working tree is not a running consumer app.

| # | Decision | Where it lives |
|---|---|---|
| 1 | **Directory MVP** — phone-first curated Ireland directory (POI / experience / campsite / B&B), list + map, one-tap check-off (pre-signup), My Places, curator seed; discovery near-me / not-been-yet / nearby. **Out:** booking, payments, partner portals, reviews, messaging, native apps. **Success:** return tick rate. **Kill** if near-zero after a fair launch. | [`product/MVP.md`](../../product/MVP.md), [`product/VISION.md`](../../product/VISION.md), [[tickets/PRD-000]] |
| 2 | **Cleanup.** `docs/` is past-company history only. Do not implement from it. Close or ignore draft PRs [#2](https://github.com/tezball/my-island/pull/2), [#4](https://github.com/tezball/my-island/pull/4), [#5](https://github.com/tezball/my-island/pull/5). Tag `legacy-platform` is archaeology only. Canon = `product/` + `ops/`. | [`docs/README.md`](../../docs/README.md), [[tickets/WF-008]] |
| 3 | **Backend always Java / Spring.** House rule. Do not recommend TypeScript or FastAPI APIs as the default. | [`product/STACK.md`](../../product/STACK.md) |
| 4 | **UI light, easy, fast.** Thin Vite + React PWA (or equivalent). **Not** Next.js-heavy unless later evidence. | [`product/STACK.md`](../../product/STACK.md) |
| 5 | **Ruthless agent loop.** Solid tools + MCP servers + clear idea→prod workflows with logs, metrics, alerts. | [`product/STACK.md`](../../product/STACK.md) gaps, [[tickets/WF-004]] |

Architecture’s STACK draft is the signed house (Spring Boot, Vite+React PWA, PostgreSQL 17 + PostGIS, Flyway, GitHub Actions, Grafana OSS MCP). Host, OIDC provider, and curator-admin depth remain open.

**Do not build** the consumer app until a `PRD-*` ticket is `implement`. Skeleton work is [[tickets/PRD-001]] (Spring) and [[tickets/PRD-003]] (light PWA) — both stay gated.
