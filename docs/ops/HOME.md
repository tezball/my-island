---
title: Operations home
type: moc
cssclasses:
  - moc
---

Company dashboard: [`../HOME.md`](../HOME.md) · [[HOME]]

# Company OS

This folder (`docs/ops/`) is the company operating system. **Markdown in git is the system of record.** Open **`docs/`** as the Obsidian vault (not this folder, not the repo root).

The mandate is **fully automated agent workflows** (tickets, CI, skills, routines). Application code is [[ops/company/SCAFFOLDING|disposable scaffolding]] — do not preserve or refactor it for its own sake.

Charter: [[ops/CHARTER]]. Design: [[ops/company/VAULT_DESIGN]]. Product canon (read-only until `PRD-*` + `implement`): [`product/`](../product/README.md). Old booking app: [`leads/`](../leads/CAMPSITE_LEADS.md), [`automation/`](../automation/OBSERVABILITY_MCP_OPTIONS.md), and git tag `legacy-platform` — history, not a migration source.

## Right now

→ **[[ops/dashboards/_index|Role dashboards]]** — human entry by hat (Bases + Dataview).

→ **[[ops/BOARD]]** — live engineering kanban. Agents pick the top non-epic ticket (`python3 ops/scripts/next_ticket.py --role auto`).

→ **[[ops/MILESTONES]]** — product roadmap (M0–M7 + gated chunks). Hand-maintained. Canon: [`product/MILESTONES.md`](../product/MILESTONES.md).

→ **[[ops/workshops/_index|Workshops]]** · **[[ops/workshops/vault-os-ux]]** · **[[ops/workflow/vault-os-ux|vault OS canvas]]**.

→ **[[ops/workflow/LOOP]]** · **[[ops/workflow/CI]]** · **[[ops/workflow/SKILLS]]** — loop, CI, skills/routines.

→ **[[ops/runbooks/_index|Runbooks]]** — ticket loop, digest, support, listing, add-skill.

→ **[[ops/agents/_index|Agent roster]]** — including architecture, business, QA, security, [[ops/agents/roles/automation-expert]].

→ **[[ops/workflow/LOCAL]]** — compose + Dev Container + MCP.

→ **[[ops/NAMING]]** — how to add notes without making a mess.

## Folders

| Folder | What |
|---|---|
| [[ops/tickets/_index\|tickets/]] | One note per ticket (`WF-` workflow, `PRD-` product, `INC-` incident) |
| [[ops/plans/_index\|plans/]] | Implementation plans. No code without a plan linked from the ticket |
| [[ops/runs/_index\|runs/]] | Agent run logs |
| [[ops/dashboards/_index\|dashboards/]] | Role homes (Bases + Dataview) |
| [[ops/workshops/_index\|workshops/]] | Multi-role briefs |
| [[ops/workflow/_index\|workflow/]] | Loop, CI, skills, safety, automations, canvases |
| [[ops/runbooks/_index\|runbooks/]] | Reusable procedures |
| [[ops/agents/_index\|agents/]] | Org chart and role notes |
| [[ops/company/_index\|company/]] | Charter, [[ops/company/DECISIONS\|CEO decisions]], scaffolding, [[ops/company/VAULT_DESIGN\|vault design]] |
| [[ops/data/_index\|data/]] | Dataview-friendly reference (taxonomy) |
| [[ops/daily/_index\|daily/]] | Daily notes (YYYY-MM-DD) |
| [[ops/templates/_index\|templates/]] | Ticket / plan / run / daily / dashboard / workshop / role |

## Rules for agents

1. Work **one ticket**. Update its `status`. Run `python3 ops/scripts/board_sync.py`.
2. **Planner** writes `plans/<id>.md`. **Implementer** opens a PR. **Reviewer** only comments — never merge.
3. No production writes. Grafana/Postgres MCP is **read-only**.
4. Skip `type: epic`. Do not spend the session on disposable app code.
5. New ids: `python3 ops/scripts/new_ticket.py --prefix WF --type workflow --title "…"`.
