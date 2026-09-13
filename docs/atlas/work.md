---
title: Work
type: moc
group: work
cssclasses:
  - moc
---

# Work — Jira lane

[[HOME]] · [[ATLAS]] · [[ops/HOME]]

Sea teal. Tracked work lives here. Agents pick from [[ops/BOARD]] (`python3 ops/scripts/next_ticket.py`). Humans may start from a [[ops/dashboards/_index|role dashboard]].

## Folders

| Path | What | Index |
|---|---|---|
| `ops/tickets/` | One note per ticket. Stem = `id` | [[ops/tickets/_index]] |
| `ops/plans/` | Implementation plans | [[ops/plans/_index]] |
| `ops/runs/` | Agent session logs | [[ops/runs/_index]] |
| `ops/dashboards/` | Role homes (Bases + Dataview) | [[ops/dashboards/_index]] |
| `ops/daily/` | Daily notes | [[ops/daily/_index]] |

New ticket: `python3 ops/scripts/new_ticket.py --prefix WF --type workflow --title "…"`. Template: [[ops/templates/ticket]].

## Live — not done (non-epic)

```dataview
TABLE status, priority, owner, type
FROM "ops/tickets"
WHERE id AND status != "done" AND type != "epic"
SORT priority ASC, id ASC
```

## Live — blocked

```dataview
TABLE owner, blocked_reason, priority
FROM "ops/tickets"
WHERE status = "blocked"
SORT priority ASC
```

## Live — plans

```dataview
TABLE ticket, status
FROM "ops/plans"
WHERE file.name != "_index"
SORT file.name DESC
LIMIT 20
```
