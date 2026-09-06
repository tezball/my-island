---
title: Vault naming
type: workflow
---

# Naming conventions

Many agents write in this vault. These rules keep it searchable.

## Files

| Kind | Path (vault-relative from `docs/`) | Example |
|---|---|---|
| Ticket | `ops/tickets/<ID>.md` | `ops/tickets/PRD-001.md` |
| Plan | `ops/plans/<ID>.md` | `ops/plans/PRD-001.md` |
| Run log | `ops/runs/<ID>-<role>.md` or `ops/runs/<ID>-<n>.md` | `ops/runs/WF-006-implement.md` |
| Role | `ops/agents/roles/<slug>.md` | `ops/agents/roles/guest-support.md` |
| Runbook | `ops/runbooks/<SLUG>.md` | `ops/runbooks/WEEKLY_DIGEST.md` |
| Daily | `ops/daily/YYYY-MM-DD.md` | `ops/daily/2026-09-05.md` |
| Folder index | `<folder>/_index.md` | `ops/agents/_index.md` |
| Workshop brief | `ops/workshops/<kebab>.md` | `ops/workshops/e2e-place-stub.md` |
| Canvas | `ops/workflow/<kebab>.canvas` | `ops/workflow/e2e-place-stub.canvas` |

- **kebab-case** for role slugs. **SCREAMING_SNAKE** for runbooks and durable company notes. **YYYY-MM-DD** for dailies.
- Living canvases only; do not put date stamps in the filename; do not drop canvases at vault root.
- Ticket **filename stem = `id`**. Never `tickets/prd-1-explore.md`.
- Do not nest tickets in subfolders. Status is frontmatter, not a directory.
- Do not put spaces in filenames.
- Indexes are `_index.md`, never `README.md`, inside OS folders. Vault root `docs/README.md` explains the vault; git repo `README.md` is outside the vault.

## Ticket ids

| Prefix | Use |
|---|---|
| `WF-` | Company OS, agent loop, infra-for-agents |
| `PRD-` | Product (directory, later marketplace) |
| `E2E-` | Workshop / e2e slices (thin HTTP stubs for agent demo). Hand-filed; not `new_ticket.py` |
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
- `owner`: role slug from [[ops/agents/_index]] (not a person’s display name)
- `area`: short noun (`ops`, `catalog`, `explore`, `trust`, …)
- Wikilinks in YAML are quoted: `plan: "[[ops/plans/PRD-001]]"`

Optional: `aliases: [PRD-001]` so Obsidian resolves the id.

## Wikilinks

Vault root is `docs/`. Links are vault-relative:

- `[[ops/tickets/PRD-001]]`
- `[[ops/workflow/LOOP]]`
- `[[ops/agents/roles/orchestrator]]`
- `[[product/STACK]]`

## Body

- One H1 matching the title.
- Tickets: Outcome, Notes, Links — not a design doc. Design goes in `ops/plans/`.
- Keep notes short. If a file grows past ~150 lines, split or move detail to a plan.
- No secrets, tokens, or prod connection strings.
- Do not hand-edit [[ops/BOARD]]. Run `python3 ops/scripts/board_sync.py`.

## What not to create

- Duplicate product specs in the OS notes. Link to `product/`.
- Parallel kanban besides [[ops/MILESTONES]] (hand-maintained). Live tickets stay on [[ops/BOARD]].
- Date-stamped copies of living notes (`CHARTER-v2.md`). Edit in place; git is history.
