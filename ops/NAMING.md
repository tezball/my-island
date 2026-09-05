---
title: Vault naming
type: workflow
---

# Naming conventions

Many agents write in this vault. These rules keep it searchable.

## Files

| Kind | Path | Example |
|---|---|---|
| Ticket | `tickets/<ID>.md` | `tickets/PRD-001.md` |
| Plan | `plans/<ID>.md` | `plans/PRD-001.md` |
| Run log | `runs/<ID>-<role>.md` or `runs/<ID>-<n>.md` | `runs/WF-006-implement.md` |
| Role | `agents/roles/<slug>.md` | `agents/roles/guest-support.md` |
| Runbook | `runbooks/<SLUG>.md` | `runbooks/WEEKLY_DIGEST.md` |
| Daily | `daily/YYYY-MM-DD.md` | `daily/2026-09-05.md` |
| Folder index | `<folder>/_index.md` | `agents/_index.md` |

- **kebab-case** for role slugs. **SCREAMING_SNAKE** for runbooks and durable company notes. **YYYY-MM-DD** for dailies.
- Ticket **filename stem = `id`**. Never `tickets/prd-1-explore.md`.
- Do not nest tickets in subfolders. Status is frontmatter, not a directory.
- Do not put spaces in filenames.
- Indexes are `_index.md`, never `README.md`, inside the vault (root `README.md` is the git repo, outside the vault).

## Ticket ids

| Prefix | Use |
|---|---|
| `WF-` | Company OS, agent loop, infra-for-agents |
| `PRD-` | Product (directory, later marketplace) |
| `INC-` | Incidents (prod/staging. Local glue bugs are `WF-` or `PRD-` bugs) |

Next id: `python3 ops/scripts/new_ticket.py --prefix PRD --type story --title "…"`.

Do not reuse ids. Do not skip numbers. `PRD-000` is the directory epic; the next id is always max+1 (`new_ticket.py`).

## Frontmatter (required on tickets)

```yaml
id: PRD-001
title: Short title, no id prefix
status: inbox
priority: P2
type: story
owner: eng-backend
area: catalog
parent:
plan:
pr:
blocked_reason:
```

- `status`: `inbox` \| `ready` \| `plan` \| `implement` \| `review` \| `done` \| `blocked`
- `priority`: `P0` \| `P1` \| `P2` \| `P3`
- `type`: `epic` \| `story` \| `bug` \| `incident` \| `workflow`
- `owner`: role slug from [[agents/_index]] (not a person’s display name)
- `area`: short noun (`ops`, `catalog`, `explore`, `trust`, …)
- Wikilinks in YAML are quoted: `plan: "[[plans/PRD-001]]"`

Optional: `aliases: [PRD-001]` so Obsidian resolves the id.

## Wikilinks

Vault root is `ops/`. Links are vault-relative:

- `[[tickets/PRD-001]]`
- `[[workflow/LOOP]]`
- `[[agents/roles/orchestrator]]`

To product or history (outside the vault) use markdown links: `[MVP](../product/MVP.md)`.

## Body

- One H1 matching the title.
- Tickets: Outcome, Notes, Links — not a design doc. Design goes in `plans/`.
- Keep notes short. If a file grows past ~150 lines, split or move detail to a plan.
- No secrets, tokens, or prod connection strings.
- Do not hand-edit [[BOARD]]. Run `python3 ops/scripts/board_sync.py`.

## What not to create

- Duplicate product specs in the vault. Link to `product/`.
- Parallel kanban in `docs/`.
- Date-stamped copies of living notes (`CHARTER-v2.md`). Edit in place; git is history.
