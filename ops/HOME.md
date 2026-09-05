---
title: Operations home
type: moc
---

# Company OS

This vault (`ops/`) is the company operating system: handbook, Jira, Confluence, and runbooks. **Markdown in git is the system of record.** Open this folder as an Obsidian vault.

Charter: [[CHARTER]]. Product canon lives outside the vault: [`product/`](../product/README.md). Historical booking platform: [`docs/`](../docs/README.md) — not requirements. Do not implement the consumer app until a `PRD-*` ticket in this vault is `implement`.

## Right now

→ **[[BOARD]]** — kanban. Agents pick the top non-epic ticket for their role (`python3 ops/scripts/next_ticket.py --role auto`).

→ **[[workflow/LOOP]]** — plan → implement → PR → review. Humans merge.

→ **[[runbooks/_index|Runbooks]]** — ticket loop, guest support, listing rollout, weekly digest.

→ **[[agents/_index|Agent roster]]** — who does what, Grok vs Cursor.

→ **[[workflow/LOCAL]]** — compose + Dev Container + MCP.

→ **[[NAMING]]** — how to add notes without making a mess.

## Folders

| Folder | What |
|---|---|
| [[tickets/_index\|tickets/]] | One note per ticket (`WF-` workflow, `PRD-` product, `INC-` incident) |
| [[plans/_index\|plans/]] | Implementation plans. No code without a plan linked from the ticket |
| [[runs/_index\|runs/]] | Agent run logs |
| [[workflow/_index\|workflow/]] | How the loop works. Change these like code: PR |
| [[runbooks/_index\|runbooks/]] | Reusable procedures agents follow |
| [[agents/_index\|agents/]] | Org chart and role notes |
| [[company/_index\|company/]] | Charter details, brand, principles, people |
| [[data/_index\|data/]] | Dataview-friendly reference (regions, listing types) |
| [[daily/_index\|daily/]] | Daily notes (YYYY-MM-DD) |
| [[templates/_index\|templates/]] | Ticket / plan / run / daily |

## Rules for agents

1. Work **one ticket**. Update its `status`. Run `python3 ops/scripts/board_sync.py`.
2. **Planner** writes `plans/<id>.md`. **Implementer** opens a PR. **Reviewer** only comments — never merge.
3. No production writes. Grafana/Postgres MCP is **read-only**.
4. Skip `type: epic` — work a child story/bug/incident.
5. New ids: `python3 ops/scripts/new_ticket.py --prefix PRD --type story --title "…"`.
