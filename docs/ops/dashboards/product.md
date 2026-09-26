---
title: Product dashboard
type: dashboard
owner: product
cssclasses:
  - role-home
---

# Product

Role: [[ops/agents/roles/product]]. Canon: [`product/README.md`](../../product/README.md) · [[ops/MILESTONES]].

> [!info] Focus
> Current build is the free Ireland directory ([`product/FREE-DIRECTORY.md`](../../product/FREE-DIRECTORY.md)). Implement pick: [[ops/tickets/WF-040]]. Booking-site children [[ops/tickets/PRD-016]]–[[ops/tickets/PRD-029]] stay `inbox`. Epic [[ops/tickets/PRD-004]] is never implement.

![[ops/dashboards/product.base]]

## Workshops

- [[ops/workshops/_index]]
- [[ops/workshops/vault-os-ux]] · [[ops/workshops/e2e-place-stub]] · [[ops/workshops/poi-visitintent]] · [[ops/workshops/booking-site]]

## Dataview

```dataview
TABLE status, priority, owner, title
FROM "ops/tickets"
WHERE id AND startswith(file.name, "PRD-") AND status != "done"
SORT status ASC, priority ASC, id ASC
```
