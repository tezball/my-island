---
title: Atlas
type: moc
cssclasses:
  - moc
  - dashboard
---

# Atlas — Maps of Content

Website sitemap for this vault. Open **`docs/`** in Obsidian. GitHub readers use the same markdown.

[[HOME]] · [[ops/HOME]] · [[ops/dashboards/_index]] · [[ops/PLUGINS]]

This vault is **Jira + Confluence + engineer notes** in one repo. Colour in the file explorer is the group: sea = work, gorse = product, moss = knowledge, heather = notes, stone = archive. Design: [[ops/company/VAULT_DESIGN]].

## Groups

| Group | Colour | What | MOC |
|---|---|---|---|
| Work | Sea | Tickets, board, plans, runs — the Jira lane | [[atlas/work]] |
| Product | Gorse | Signed canon — the Confluence product space | [[atlas/product]] |
| Engineering | Heather | Engineer notes, ADRs, meetings, stack | [[atlas/engineering]] |
| Company | Heather | Charter, decisions, people, brand | [[atlas/company]] |
| Knowledge | Moss | Runbooks, workflow, workshops, templates | [[atlas/knowledge]] |
| Archive | Stone | Historical booking platform — do not implement | [[atlas/archive]] |

> [!work] Work
> [[atlas/work]] — [[ops/BOARD]] · [[ops/tickets/_index]] · [[ops/plans/_index]]

> [!product] Product
> [[atlas/product]] — [[product/README]] · [[product/SIGNED]] · [[product/STACK]]

> [!note] Engineering
> [[atlas/engineering]] — [[notes/_index]] · [[ops/dashboards/engineering]] · [[ops/workflow/AGENT_DX]]

> [!knowledge] Knowledge
> [[atlas/knowledge]] — [[ops/runbooks/_index]] · [[ops/workflow/_index]] · [[ops/templates/_index]]

> [!info] Company
> [[atlas/company]] — [[ops/CHARTER]] · [[ops/company/_index]]

> [!archive] Archive
> [[atlas/archive]] — [`leads/`](leads/CAMPSITE_LEADS.md) · [`automation/`](automation/OBSERVABILITY_MCP_OPTIONS.md)

## How to place a note

| Need | Put it | Template |
|---|---|---|
| Tracked work | `ops/tickets/` via `new_ticket.py` | [[ops/templates/ticket]] |
| Design for a ticket | `ops/plans/<id>.md` | [[ops/templates/plan]] |
| Session log | `ops/runs/` | [[ops/templates/run]] |
| Durable product truth | `product/` (do not fork into ops) | — |
| Handbook / decision | `ops/company/` | [[ops/templates/wiki]] |
| Engineer thinking | `notes/` | [[ops/templates/note]] |
| Architecture lock | `notes/adr/` | [[ops/templates/adr]] |
| Meeting | `notes/meetings/` | [[ops/templates/meeting]] |
| Daily | `ops/daily/YYYY-MM-DD` | [[ops/templates/daily]] |
| Map of a folder | `<folder>/_index.md` | [[ops/templates/moc]] |

Do not nest tickets in subfolders. Status is frontmatter. Naming: [[ops/NAMING]].

## Live — work in flight

```dataview
TABLE status, priority, owner, area
FROM "ops/tickets"
WHERE id AND status != "done" AND type != "epic"
SORT priority ASC, id ASC
```
