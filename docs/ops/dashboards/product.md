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
> `PRD-*` and workshop slices. Marketplace stays gated.

![[ops/dashboards/product.base]]

## Workshops

- [[ops/workshops/_index]]
- [[ops/workshops/vault-os-ux]] · [[ops/workshops/e2e-place-stub]]

## Dataview

```dataview
TABLE status, priority, owner, title
FROM "ops/tickets"
WHERE id AND startswith(file.name, "PRD-") AND status != "done"
SORT status ASC, priority ASC, id ASC
```
