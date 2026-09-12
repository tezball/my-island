---
title: Business dashboard
type: dashboard
owner: business
cssclasses:
  - role-home
---

# Business

Role: [[ops/agents/roles/business]]. People: [[ops/company/PEOPLE]]. Brand: [[ops/company/BRAND]] (public name **OPEN**).

> [!tip] Focus
> Milestones and open commercial questions. Do not invent pricing or lock a ship name.

- Roadmap: [[ops/MILESTONES]] · [`product/MILESTONES.md`](../../product/MILESTONES.md)
- Briefing open Qs: [`product/BRIEFING.md`](../../product/BRIEFING.md)

![[ops/dashboards/business.base]]

## Dataview

```dataview
TABLE status, priority, type, title
FROM "ops/tickets"
WHERE id AND priority = "P0" AND status != "done"
SORT status ASC, id ASC
```
