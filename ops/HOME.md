---
title: Operations home
type: moc
---

# Operations

This vault is the team’s Jira, Confluence, and runbook. **Markdown in git is the system of record.** Cursor agents read and write these files. There is no other ticket tracker.

Open this folder as an Obsidian vault (`ops/`). Product canon lives outside: [[../product/BRIEFING|briefing]], [[../product/MVP|MVP]], [[../product/ENGINEERING|CTO review]]. Do not implement the product MVP until a ticket in this vault says so.

## Right now

→ **[[BOARD]]** — kanban. Agents pick the top `ready` ticket.

→ **[[workflow/LOOP]]** — plan → implement → PR → review. Humans merge.

→ **[[workflow/LOCAL]]** — compose + Dev Container + MCP (start here).

→ **[[workflow/MCP]]** — local vs prod servers, safety.

→ **[[workflow/AUTOMATIONS]]** — Cursor cloud jobs (PR review, board runner).

## Folders

| Folder | What |
|---|---|
| [[tickets/]] | One note per ticket (`WF-…` workflow, later `PRD-…` product) |
| [[plans/]] | Implementation plans. No code without a plan linked from the ticket |
| [[runs/]] | Agent run logs (what happened, PR URL, what failed) |
| [[workflow/]] | How the loop works. Change these like you change code: PR |
| [[templates/]] | New ticket / plan / run |

## Rules for agents

1. Work **one ticket**. Update its `status`. Run `python3 ops/scripts/board_sync.py`.
2. **Planner** writes `plans/<id>.md`. **Implementer** opens a PR. **Reviewer** only comments — never merge.
3. No production writes. Grafana/Postgres MCP is **read-only**.
4. This repo’s current mandate is the **agent workflow**, not the consumer app.
