---
title: MVP cloud team
type: roster
status: active
parent: "[[ops/tickets/PRD-000]]"
cssclasses:
  - moc
---

# MVP cloud team

Dispatch for Release 1. Program: [[ops/plans/PRD-000]]. One ticket per agent session. Prefer no human in the loop (`gate: human` only for Automations UI, counsel, Google console credentials).

## Standing rules

1. Checkout latest `main`. Land company-state docs on `main` first; then branch for code.
2. Wear **one** hat. Skip epics.
3. House: Spring + Vite/React PWA (not Next) + PostGIS + Grafana MCP + Jenkins local CI.
4. Do not merge from chat. Do not invent OIDC stubs. Do not publish scraped batches without [[ops/tickets/PRD-009]].

## Agents — ready now (`status: implement`)

| Callsign | Ticket | Hat | Job |
|---|---|---|---|
| **mvp-seed** | [[ops/tickets/PRD-002]] | eng-backend | Seed catalog DB from `data/leads/places.jsonl` on compose up; idempotent; local `published=true` |
| **mvp-explore** | [[ops/tickets/PRD-003]] | eng-frontend | Scaffold `web/` Explore list+map; proxy to `:8081`; seams only for tick/detail/me |
| **mvp-auth** | [[ops/tickets/PRD-010]] | eng-backend | Email+password + JDBC session + Mailpit; **no OIDC stub**; Google waits on credentials |
| **mvp-place** | [[ops/tickets/PRD-011]] | eng-backend + eng-frontend | Place detail API + PWA route (after Explore shell exists — coordinate; Explore first if conflict) |
| **mvp-checkoff** | [[ops/tickets/PRD-012]] | eng-backend + eng-frontend | Visits API + one-tap; migrate after password login |
| **mvp-me** | [[ops/tickets/PRD-013]] | eng-frontend | My Places list/map/32-county (after PRD-012) |
| **mvp-launch** | [[ops/tickets/PRD-014]] | eng-backend | Local launch quality slice; blank thresholds for Terry |

**Suggested order:** mvp-seed ∥ mvp-auth ∥ mvp-explore → mvp-place → mvp-checkoff → mvp-me → mvp-launch.

## Agents — human-gated (do not start code)

| Callsign | Ticket | Wait for |
|---|---|---|
| mvp-trust | [[ops/tickets/PRD-009]] | Terry + counsel name/date in git |
| mvp-factory | [[ops/tickets/WF-003]] | Terry Save/Activate in Automations UI |
| mvp-google | [[ops/tickets/WF-014]] | Terry Google client id + secret (then wire OAuth; still no stub) |

## Docs agent (this PR / vault)

| Callsign | Job |
|---|---|
| **mvp-docs** | Keep tickets/plans/BOARD aligned with CEO pivots; `board_sync`; vault tests. No application code. |

## Closed / skip

- [[ops/tickets/E2E-001]] — `done` (stub close-out; do not rebuild create/list/get)
- [[ops/tickets/PRD-001]], [[ops/tickets/PRD-006]], [[ops/tickets/PRD-007]], [[ops/tickets/PRD-008]] — landed spine

## Prompt skeleton (Cloud Agent / board runner)

```
You are <callsign> for tezball/my-island. One ticket: <id>.
Read docs/ops/workflow/LOOP.md docs/ops/workflow/SAFETY.md docs/ops/plans/<id>.md docs/ops/tickets/<id>.md
Branch from main, implement only that ticket, open PR, set status review. Do not merge.
```

## Links

- Program: [[ops/plans/PRD-000]]
- Loop: [[ops/workflow/LOOP]]
- Automations: [[ops/workflow/AUTOMATIONS]]
