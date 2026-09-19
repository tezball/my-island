---
title: Engineering
type: moc
group: engineering
cssclasses:
  - moc
  - note
---

# Engineering — notes and toolbox

[[HOME]] · [[ATLAS]] · [[notes/_index]]

Heather. This is the engineer second brain: lasting notes, ADRs, meetings. Tickets still go in [[ops/tickets/_index]]. Stack canon is [[product/STACK]], not a note.

## Folders

| Path | What |
|---|---|
| [[notes/_index]] | Permanent engineer notes |
| [[notes/adr/_index]] | Architecture Decision Records |
| [[notes/meetings/_index]] | Meeting notes |
| [[ops/dashboards/engineering]] | Dev queue |
| [[ops/workflow/DX]] | Run, observe, test (human + agent) |
| [[ops/workflow/AGENT_DX]] | Skills, slash, MCP, IntelliJ |
| [[ops/workflow/LOCAL]] | Compose + Dev Container |
| [[ops/workflow/WORKTREES]] | Multi-session git: primary on `main`, sibling worktree per ticket |
| [[ops/workflow/TEST_STACK]] | Test mix |

## Templates

- [[ops/templates/note]] — thinking that is not a ticket
- [[ops/templates/adr]] — a lock we must not re-argue
- [[ops/templates/meeting]] — humans in a room

## Live — engineer notes

```dataview
TABLE type, area
FROM "notes"
WHERE file.name != "_index" AND type
SORT file.mtime DESC
```

## Live — in flight for eng

```dataview
TABLE status, priority, owner, title
FROM "ops/tickets"
WHERE id AND type != "epic" AND (status = "implement" OR status = "review")
SORT status ASC, priority ASC
```
