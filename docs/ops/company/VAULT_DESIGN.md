---
title: Vault design
type: company
cssclasses:
  - moc
---

# Vault design

Visual system for the Obsidian company OS (`docs/`). Product consumer UI is separate — do not copy these tokens into the PWA without a `PRD-*`. Atlas: [[ATLAS]]. Ticket: [[ops/tickets/WF-036]].

## Tokens

| Token | Hex | Use |
|---|---|---|
| Peat / ink | `#2c2416` / `#1a221c` | Headings, body |
| Gorse | `#c4a035` | Product, plans, tips |
| Sea | `#2a6f7c` | Work / tickets, links, doing |
| Moss | `#3d6b4f` | Knowledge, atlas, ready / done |
| Heather | `#6b4c6d` | Engineer notes, ADRs, company |
| Stone | `#8a8578` | Archive, runs, muted meta |
| Warn | `#a65d2e` | Blocked / todo |
| Danger | `#8b3a3a` | Incidents |

Light-first. Dark theme remaps ink/paper via the same snippet. Folder colour is CSS (`data-path`) so git clones get colour without Iconize.

## Folder groups

| Explorer folder | Group | Colour |
|---|---|---|
| `ops/`, `ops/tickets/` | Work (Jira) | Sea |
| `product/`, `ops/plans/` | Product / plans | Gorse |
| `atlas/`, `ops/runbooks/`, `ops/workflow/` | Knowledge | Moss |
| `notes/`, `ops/company/` | Engineering / handbook | Heather |
| `leads/`, `automation/` | Archive | Stone (muted) |

## cssclasses

| Class | Where |
|---|---|
| `dashboard` | Company `HOME.md`, ops dashboards hub, atlas hub |
| `role-home` | `ops/dashboards/<persona>.md` |
| `workshop` | `ops/workshops/*` |
| `moc` | Folder indexes, atlas group notes |
| `ticket` / `plan` / `run` | Work templates |
| `wiki` / `product` | Confluence-style pages |
| `note` / `adr` | Engineer notes |
| `archive` | History fence |

Custom callouts: `work`, `product`, `knowledge`, `note`, `archive`.

## Snippet

File: `.obsidian/snippets/company-os.css`. Enabled in `.obsidian/appearance.json` (`enabledCssSnippets`). Graph groups: `.obsidian/graph.json`.

## Dashboards

Role homes live in [[ops/dashboards/_index]]. **Bases** (`.base`) are the interactive tables; **Dataview** blocks stay in markdown for GitHub. Ticket SoT is still frontmatter + `board_sync.py` — Bases do not replace the board.

## Brand

Voice and naming: [[ops/company/BRAND]]. Public product name stays **OPEN**.
