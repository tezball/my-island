---
title: Operations home
type: moc
---

# Company OS

This vault (`ops/`) is the company operating system. **Markdown in git is the system of record.** Open this folder as an Obsidian vault.

The mandate is **fully automated agent workflows** (tickets, CI, skills, routines). Application code is [[company/SCAFFOLDING|disposable scaffolding]] — do not preserve or refactor it for its own sake.

Charter: [[CHARTER]]. Product canon (read-only until `PRD-*` + `implement`): [`product/`](../product/README.md). Old booking app: [`docs/`](../docs/README.md) and git tag `legacy-platform` — history, not a migration source.

## Right now

→ **[[BOARD]]** — kanban. Agents pick the top non-epic ticket (`python3 ops/scripts/next_ticket.py --role auto`).

→ **[[workflow/LOOP]]** · **[[workflow/CI]]** · **[[workflow/SKILLS]]** — loop, CI, skills/routines.

→ **[[runbooks/_index|Runbooks]]** — ticket loop, digest, support, listing, add-skill.

→ **[[agents/_index|Agent roster]]** — including [[agents/roles/automation-expert]].

→ **[[workflow/LOCAL]]** — compose + Dev Container + MCP.

→ **[[NAMING]]** — how to add notes without making a mess.

## Folders

| Folder | What |
|---|---|
| [[tickets/_index\|tickets/]] | One note per ticket (`WF-` workflow, `PRD-` product, `INC-` incident) |
| [[plans/_index\|plans/]] | Implementation plans. No code without a plan linked from the ticket |
| [[runs/_index\|runs/]] | Agent run logs |
| [[workflow/_index\|workflow/]] | Loop, CI, skills, safety, automations |
| [[runbooks/_index\|runbooks/]] | Reusable procedures |
| [[agents/_index\|agents/]] | Org chart and role notes |
| [[company/_index\|company/]] | Charter, scaffolding rule, brand |
| [[data/_index\|data/]] | Dataview-friendly reference |
| [[daily/_index\|daily/]] | Daily notes (YYYY-MM-DD) |
| [[templates/_index\|templates/]] | Ticket / plan / run / daily |

## Rules for agents

1. Work **one ticket**. Update its `status`. Run `python3 ops/scripts/board_sync.py`.
2. **Planner** writes `plans/<id>.md`. **Implementer** opens a PR. **Reviewer** only comments — never merge.
3. No production writes. Grafana/Postgres MCP is **read-only**.
4. Skip `type: epic`. Do not spend the session on disposable app code.
5. New ids: `python3 ops/scripts/new_ticket.py --prefix WF --type workflow --title "…"`.
