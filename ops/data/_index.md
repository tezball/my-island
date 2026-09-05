---
title: Company data
type: moc
---

# Company data

Small reference tables for Dataview and agents. **Not a CMS.** Place copy does not live here. Research **leads** (unpublished) live outside the vault: [`../../data/leads/`](../../data/leads/README.md).

| Note | What |
|---|---|
| [[listing-types]] | Place categories |
| [[regions]] | Launch geography |

## Dataview — tickets by owner

````markdown
```dataview
TABLE status, priority, type, area
FROM "tickets"
WHERE owner = "eng-infra" AND status != "done"
SORT priority ASC
```
````

## Dataview — ready queue (non-epic)

````markdown
```dataview
TABLE priority, type, owner, title
FROM "tickets"
WHERE status = "ready" AND type != "epic"
SORT priority ASC, id ASC
```
````
