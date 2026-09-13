---
title: Company
type: moc
group: company
cssclasses:
  - moc
---

# Company — handbook

[[HOME]] · [[ATLAS]] · [[ops/company/_index]]

Heather / peat. Who we are and how we behave. Product *what* is [[atlas/product]].

## Start here

| Note | What |
|---|---|
| [[ops/CHARTER]] | Purpose, repo map, principles |
| [[ops/company/_index]] | Handbook index |
| [[ops/company/DECISIONS]] | CEO locks |
| [[ops/company/VAULT_DESIGN]] | Colour, cssclasses, atlas |
| [[ops/company/SCAFFOLDING]] | App code is disposable |
| [[ops/company/BRAND]] | Voice; public name OPEN |
| [[ops/company/PEOPLE]] | Humans |
| [[ops/agents/_index]] | Agent roster |
| [[ops/dashboards/_index]] | Role homes |

## Live — workflow tickets

```dataview
TABLE status, priority, owner, title
FROM "ops/tickets"
WHERE id AND startswith(id, "WF") AND status != "done" AND type != "epic"
SORT priority ASC, id ASC
```
