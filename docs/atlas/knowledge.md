---
title: Knowledge
type: moc
group: knowledge
cssclasses:
  - moc
---

# Knowledge — how we operate

[[HOME]] · [[ATLAS]]

Moss. Reusable procedures and policy. This is the Confluence *operations* space (not product canon).

## Folders

| Path | What | Index |
|---|---|---|
| `ops/runbooks/` | Steps an agent follows | [[ops/runbooks/_index]] |
| `ops/workflow/` | Policy, CI, safety, canvases | [[ops/workflow/_index]] |
| `ops/workshops/` | Multi-role briefs | [[ops/workshops/_index]] |
| `ops/templates/` | Reuse | [[ops/templates/_index]] |
| `ops/data/` | Small taxonomy tables | [[ops/data/_index]] |
| `ops/PLUGINS.md` | Obsidian plugins | [[ops/PLUGINS]] |
| `ops/NAMING.md` | How to add notes | [[ops/NAMING]] |

Policy vs procedure: if a runbook and [[ops/workflow/SAFETY]] disagree, safety wins.

## Live — workshops

```dataview
LIST
FROM "ops/workshops"
WHERE file.name != "_index"
SORT file.name ASC
```
