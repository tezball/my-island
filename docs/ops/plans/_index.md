---
title: Plans
type: moc
cssclasses:
  - moc
---

# Plans

[[atlas/work]] · [[ops/tickets/_index]]

One plan per ticket, same id. Copy [[ops/templates/plan]]. Planner sets plan `status: approved` and advances the ticket on `main` by default. Use ticket `gate: human` when a person must act.

```dataview
TABLE ticket, status
FROM "ops/plans"
WHERE file.name != "_index"
SORT file.name DESC
```


| Plan | Notes |
|---|---|
| [[PRD-000]] | Program / e2e waves |
| [[PRD-001]] | Catalog skeleton |
| [[PRD-002]] | **Seed DB from research leads** (not spreadsheet) |
| [[PRD-003]] | Explore PWA list+map |
| [[PRD-006]] | Leads store |
| [[PRD-007]] | Wave 1 leads acceptance |
| [[PRD-008]] | Draft Place import |
| [[PRD-009]] | Counsel gate |
| [[PRD-010]] | **Email+password auth** (no OIDC stub; Google later) |
| [[PRD-011]] | Place detail |
| [[PRD-012]] | Check-off / visits |
| [[PRD-013]] | My Places |
| [[PRD-014]] | Launch quality |
| [[E2E-001]] | Place-stub workshop close-out |
| [[WF-003]] | Cursor Automations enablement |
| [[WF-016]] | Cloud Agent local MCP |
| [[WF-017]] | STACK-E2E drill |
| [[WF-019]] | Place-listing sim |
| [[WF-023]] | Living markdown under `docs/` |
| [[WF-024]] | Apple Silicon PostGIS |
| [[WF-025]] | No prod / auto-merge |
| [[WF-030]] | Vault OS UX |
| [[WF-036]] | Second brain — atlas, folder colour, engineer notes |
| [[WF-037]] | Mock-prod info probe (version + git hash) |
| [[WF-031]] | Jenkins local house CI |
| [[WF-034]] | Agent DX pack (Goal 1 list; Goal 2 after review) |
| [[WF-035]] | Test stack today vs want (shift-left, human+agent) |
