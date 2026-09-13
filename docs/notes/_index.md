---
title: Engineer notes
type: moc
cssclasses:
  - moc
  - note
---

# Engineer notes

[[HOME]] · [[ATLAS]] · [[atlas/engineering]]

Permanent thinking that is **not** a ticket. If the work needs a status, file `ops/tickets/` with `new_ticket.py`. Dailies stay in [[ops/daily/_index]].

| Lane | Path | Template |
|---|---|---|
| Permanent note | `notes/<kebab>.md` | [[ops/templates/note]] |
| ADR | `notes/adr/<SLUG>.md` | [[ops/templates/adr]] |
| Meeting | `notes/meetings/YYYY-MM-DD-<kebab>.md` | [[ops/templates/meeting]] |

Link notes to tickets with wikilinks (`[[ops/tickets/WF-036]]`). Do not copy product canon — point at [[product/STACK]] / [[ops/company/DECISIONS]].

Obsidian: new notes default to this folder (`.obsidian/app.json` `newFileFolderPath`). Tickets still come from the script.

## Live

```dataview
TABLE type, area, created
FROM "notes"
WHERE file.name != "_index"
SORT file.mtime DESC
```
