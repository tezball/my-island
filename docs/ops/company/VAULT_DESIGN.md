---
title: Vault design
type: company
cssclasses:
  - moc
---

# Vault design

Visual system for the Obsidian company OS (`docs/`). Product consumer UI is separate — do not copy these tokens into the PWA without a `PRD-*`.

## Tokens

| Token | Hex | Use |
|---|---|---|
| Peat / ink | `#2c2416` / `#1a221c` | Headings, body |
| Gorse | `#c4a035` | Accent underlines, tips |
| Sea | `#2a6f7c` | Links, doing, architecture |
| Moss | `#3d6b4f` | Success / ready / done |
| Stone | `#8a8578` | Muted meta |
| Warn | `#a65d2e` | Blocked / todo |
| Danger | `#8b3a3a` | Incidents |

Light-first. Dark theme remaps ink/paper via the same snippet.

## cssclasses

| Class | Where |
|---|---|
| `dashboard` | Company `HOME.md`, ops dashboards hub |
| `role-home` | `ops/dashboards/<persona>.md` |
| `workshop` | `ops/workshops/*` |
| `moc` | Folder indexes, company notes |
| `ticket` / `plan` / `run` | Templates default |

## Snippet

File: `.obsidian/snippets/company-os.css`. Enabled in `.obsidian/appearance.json` (`enabledCssSnippets`).

## Dashboards

Role homes live in [[ops/dashboards/_index]]. **Bases** (`.base`) are the interactive tables; **Dataview** blocks stay in markdown for GitHub. Ticket SoT is still frontmatter + `board_sync.py` — Bases do not replace the board.

## Brand

Voice and naming: [[ops/company/BRAND]]. Public product name stays **OPEN**.
