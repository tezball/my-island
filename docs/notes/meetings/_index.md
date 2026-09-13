---
title: Meetings
type: moc
cssclasses:
  - moc
---

# Meetings

[[notes/_index]] · [[atlas/engineering]]

Human meetings only. Agents log ticket sessions in [[ops/runs/_index]]. Template: [[ops/templates/meeting]]. Filename `YYYY-MM-DD-kebab.md`.

```dataview
TABLE date, attendees
FROM "notes/meetings"
WHERE file.name != "_index"
SORT file.name DESC
```
