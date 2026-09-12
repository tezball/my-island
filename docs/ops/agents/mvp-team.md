---
title: MVP cloud team
type: roster
status: active
parent: "[[ops/tickets/PRD-000]]"
cssclasses:
  - moc
---

# MVP cloud team

Dispatch for Release 1. Program plan: [[ops/plans/PRD-000]]. Hats stay the roles in [[ops/agents/_index]]. This note is **who is assigned**, not a second org chart.

**CEO ask (2026-09-06):** complete the directory MVP with a team of online agents. **E2e plan first** (this program plan). Then one Cloud Agent per ticket.

## Standing rules

- One ticket per session. Skip the epic.
- Planner lands an **approved** plan on `main` and advances the ticket (usually to `implement` unless `gate: human`).
- Implementer (new session) branches from `main`, codes, opens a PR, sets `status: review`. Does not merge.
- Prefer no human in the loop; use ticket `gate: human` for Automations UI, counsel, OIDC console.
- Reviewer comments only.
- House: [`product/STACK.md`](../../product/STACK.md). Safety: [[ops/workflow/SAFETY]].

## Wave 1 — planners (parallel)

| Callsign | Ticket | Hat | Must not |
|---|---|---|---|
| mvp-trust | [[ops/tickets/PRD-009]] | product | App code; waive counsel |
| mvp-seed | [[ops/tickets/PRD-002]] | content-seo / eng-backend | Publish from scrape; second lead schema |
| mvp-explore | [[ops/tickets/PRD-003]] | eng-frontend | Next.js; Place/Check-off/My Places (those are PRD-011–013) |
| mvp-auth | [[ops/tickets/PRD-010]] | eng-backend | Custom IdP in another language; prod secrets in notes |
| mvp-stub | [[ops/tickets/E2E-001]] | eng-backend | Rebuild create/list/get; consumer UI |
| mvp-factory | [[ops/tickets/WF-003]] | automation-expert | Auto-merge; product UI |

## Wave 2+ — do not start until listed dependency is `implement` or `done`

| Callsign | Ticket | Wait for |
|---|---|---|
| mvp-place | [[ops/tickets/PRD-011]] | PRD-003 plan approved (API shape for detail) |
| mvp-checkoff | [[ops/tickets/PRD-012]] | PRD-010 plan (migrate ticks on signup) |
| mvp-me | [[ops/tickets/PRD-013]] | PRD-012 |
| mvp-launch | [[ops/tickets/PRD-014]] | Core loop tickets in review or done |

## Collision protocol

Two planners must not edit the same ticket file. `BOARD.md` is generated; last `board_sync.py` wins — rebase onto `main` before push. Do not “fix” another agent’s frontmatter.

## Links

- Program: [[ops/plans/PRD-000]]
- Loop: [[ops/workflow/LOOP]]
- Automations (human UI): [[ops/workflow/AUTOMATIONS]] · [[ops/tickets/WF-003]]
