---
title: Architecture Decision Records
type: moc
cssclasses:
  - moc
  - adr
---

# ADRs

[[notes/_index]] · [[atlas/engineering]] · [[ops/company/DECISIONS]]

House locks that already live in git (stack, no-prod, vault root) stay in [[ops/company/DECISIONS]] and [[product/STACK]]. Use this folder for **new** engineering decisions that are not CEO locks.

Template: [[ops/templates/adr]]. Filename `ADR-NNN-kebab.md` or a short slug.

```dataview
TABLE status, date, area
FROM "notes/adr"
WHERE file.name != "_index"
SORT file.name ASC
```
