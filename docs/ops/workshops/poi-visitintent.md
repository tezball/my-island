---
title: POI VisitIntent MVP — planner brief
type: workshop
created: 2026-09-19
cssclasses:
  - workshop
---

# POI VisitIntent MVP — planner brief

CEO 2026-09-19: next slice is **VisitIntent** (`been` / `want` / `never`) on the **existing** Ireland POI directory. Not booking. Not PRD-012/013 one-tap. Product canon: [`product/POI-VISITINTENT.md`](../../product/POI-VISITINTENT.md). Decisions: [[ops/company/DECISIONS]]. Q&A is **closed** (Terry chose **A**: public anonymous been count only).

Hats: **planner** (this land) → **implementer** worktrees per ticket → **reviewer** comments only. Ready PRs auto-merge. Chat never `gh pr merge`.

## Already true

Explore is live at https://fishing-journals.com: 101 Irish POIs, 32 counties, list + map + detail, Google Sign-In. House stack is enough. Do not start a new stack.

Missing: been / want / never, username/password + seed Guests, unattended commit→deploy→test loop, house metrics on the test box, Gatling, agent MCP, Loki shipping, write-authz, audit.

## Path (ticket → test server)

1. Planner files tickets on `main` (`PRD-*` / `WF-*`, `status: implement` when ready). **This PR.**
2. Implementer works in a worktree, tests in Jenkins + GHA (Testcontainers).
3. Reviewer comments only. Ready PR auto-merges when CI is green.
4. Jenkins (holds the SSH key) deploys `main` to the test box. Agents do not SSH.
5. Post-deploy: smoke + Gatling trickle against https://fishing-journals.com.
6. Agent MCP: Grafana/PromQL, catalog API, Jenkins, Gatling, Playwright, Postgres RO.

## Build order (Terry lock **C** — two streams in parallel)

Do **not** serialize VisitIntent behind deploy. Both streams are `status: implement`.

| Stream | Tickets | What |
|---|---|---|
| **1 — unattended mock-prod + MCP/observe + merge CI** | [[ops/tickets/WF-040]] · [[ops/tickets/WF-041]] · [[ops/tickets/WF-042]] · [[ops/tickets/WF-043]] · [[ops/tickets/WF-044]] · [[ops/tickets/WF-045]] · [[ops/tickets/WF-046]] | Commit → Jenkins `deploy-mock-prod` → HTTP/API confirm. **Observe lock C:** Prom/Loki from fishing-journals.com; Grafana MCP HTTP/SSE. **Test lanes:** catalog API + Chaos + ZAP on **merge**; Playwright cron + MCP. **Gatling:** light trickle + weekly full perf (not merge load). **Alerts lock C:** trickle/weekly fail → Jenkins red + Grafana/AM; leftover FJ email stays muted. **Catalog writes lock C:** no public Place POST/PUT/PATCH/DELETE; seed/import in CI/deploy; Guests write VisitIntent only. |
| **2 — auth + VisitIntent** | [[ops/tickets/PRD-010]] · [[ops/tickets/PRD-015]] | Username/password **and** Google SSO (GIS stays). VisitIntent `been` / `want` / `never` for a **signed-in Guest**. Lists **private**. **Public counts lock A:** Place API/UI expose anonymous **been** count only; want and never stay private to the Guest. No PII. Prove on local compose. |

Playwright is cron + MCP ([[ops/tickets/WF-011]]). Chaos Monkey and ZAP stay **on merge**. Gatling is a **light trickle** plus **weekly** full perf — not merge load. Trickle/weekly failures mark Jenkins red and fire Grafana/AM ([[ops/tickets/WF-045]]); leftover FJ email stays muted. **No public Place writes** ([[ops/tickets/WF-046]]). GIS is not a blocker. Seed passwords never go in `docs/`.

## Out of this MVP

Campsite / B&B / experience booking, per-county mocks, map rewrite, Datadog/Next/FastAPI, a second API service. GIS stays; password is added, not a Google-only or password-only kill.

## Wrong-shape tickets (leave open)

[[ops/tickets/PRD-012]] and [[ops/tickets/PRD-013]] are **`blocked`** (wrong shape; signed CHK/ME backlog). Stay blocked. Map/list of been/want is [[ops/tickets/PRD-030]], not a PRD-013 reopen.

[[ops/tickets/WF-004]] / [[ops/tickets/WF-010]] stay **blocked** (generic staging host). Mock-prod observe is WF-041. Cloud→Jenkins **lock C:** [[ops/tickets/WF-049]] (Mac mini self-hosted worker; not B; not D).

## Links

- Product: [`product/POI-VISITINTENT.md`](../../product/POI-VISITINTENT.md)
- Plans: [[ops/plans/WF-040]] · [[ops/plans/WF-041]] · [[ops/plans/WF-042]] · [[ops/plans/WF-043]] · [[ops/plans/WF-044]] · [[ops/plans/WF-045]] · [[ops/plans/WF-046]] · [[ops/plans/WF-011]] · [[ops/plans/WF-049]] · [[ops/plans/PRD-010]] · [[ops/plans/PRD-015]] · [[ops/plans/PRD-030]]
- Directory workshop (browse slice, 2026-09-12): [[ops/workshops/poi-directory-mvp]]
