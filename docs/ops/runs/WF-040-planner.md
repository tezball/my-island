---
id: WF-040
ticket: "[[ops/tickets/WF-040]]"
role: planner
started: 2026-09-19
finished: 2026-09-19
pr: "https://github.com/tezball/my-island/pull/94"
cssclasses:
  - run
---

# Run WF-040 planner (POI VisitIntent land)

## What happened

Docs-only worktree from `origin/main`. Filed via `new_ticket.py`:

- [[ops/tickets/WF-040]] commit→deploy→test→confirm — `status: implement`
- [[ops/tickets/WF-041]] observe lock C (test-server Prom/Loki, Grafana MCP HTTP/SSE, laptop same datasources) — `status: implement`
- [[ops/tickets/WF-042]] agent MCP pack + Gatling trickle/weekly — `status: implement`
- [[ops/tickets/WF-043]] chaos lock C (Chaos Monkey in CI; retries/fallbacks; not public host every deploy) — `status: implement`
- [[ops/tickets/WF-044]] security lock B (ZAP-style CI vs local compose/Testcontainers every merge) — `status: implement`
- [[ops/tickets/WF-045]] alerts lock C (trickle/weekly fail → Jenkins red + Grafana/AM; leftover FJ email muted) — `status: implement`
- [[ops/tickets/WF-046]] catalog writes lock C (close public Place POST; seed/import only) — `status: implement`
- Reshaped [[ops/tickets/WF-011]] — Playwright cron + MCP, not a merge gate — `status: implement`
- [[ops/tickets/PRD-015]] VisitIntent been/want/never; lists **private**; Place **anonymous been count** — `status: implement`
- Reshaped [[ops/tickets/PRD-010]] — username/password **and** Google SSO; seed password Guests; GIS stays

Plans `status: approved`. Folded CEO 2026-09-19 locks into [[ops/company/DECISIONS]], [`product/POI-VISITINTENT.md`](../../product/POI-VISITINTENT.md), [[ops/workshops/poi-visitintent]]. Q&A **closed** (Terry chose **A**: public been count only). Notes on [[ops/tickets/PRD-012]] / [[ops/tickets/PRD-013]] (wrong shape; left `implement`). WF-004 / WF-010 stay blocked. `board_sync.py`. No app code. No `gh pr merge`.

## Result

success (docs PR; CI automerge)

## Follow-up

Two streams in parallel (lock C) — (1) WF-040/041/042/043/044/045/046 + Playwright cron WF-011, (2) PRD-010 + PRD-015. Do not wait on deploy before VisitIntent. Agents observe **test-server** metrics via Grafana MCP, not compose-only. Chaos + ZAP live in CI, not as public-host deploy hooks. Gatling is trickle + weekly, not merge load; failures Jenkins red + Grafana/AM. Close public Place writes. VisitIntent lists private; Place API/UI anonymous been count only (want/never private; no PII). Do not SSH. Do not implement PRD-012/013 as this slice.
