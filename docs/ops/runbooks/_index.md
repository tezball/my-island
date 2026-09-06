---
title: Runbooks
type: moc
---

# Runbooks

Reusable procedures. Workflow *policy* stays in [[ops/workflow/_index]]. These are the steps an agent follows.

| Runbook | When |
|---|---|
| [[TICKET_LOOP]] | Any ticket: intake → implement → PR → verify → close |
| [[ADD_SKILL]] | New Cursor skill, hook, or routine |
| [[STACK_E2E_PLACE_STUB]] | Place-stub STACK-E2E drill: happy-path compose, HTTP, MCP-or-HTTP observe, chaos overlay |
| [[WEEKLY_DIGEST]] | Company health, typically Monday |
| [[GUEST_SUPPORT]] | Inbound guest/explorer message |
| [[LISTING_ROLLOUT]] | New listing type or region |
| [[PLACE_LISTING_SIM]] | Repeatable catalog create→list→get against compose (no chaos) |

If a runbook and [[ops/workflow/SAFETY]] disagree, safety wins.
