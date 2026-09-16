---
title: Runbooks
type: moc
cssclasses:
  - moc
---

# Runbooks

Reusable procedures. Workflow *policy* stays in [[ops/workflow/_index]]. These are the steps an agent follows.

| Runbook | When |
|---|---|
| [[TICKET_LOOP]] | Any ticket: intake → implement → PR → verify → close |
| [[WORKTREE]] | Add / test / remove a sibling git worktree for one Cursor session |
| [[ADD_SKILL]] | New Cursor skill, hook, or routine |
| [[STACK_E2E_PLACE_STUB]] | Place-stub STACK-E2E drill: happy-path compose, HTTP, MCP-or-HTTP observe, chaos overlay |
| [[WEEKLY_DIGEST]] | Company health, typically Monday |
| [[GUEST_SUPPORT]] | Inbound guest/explorer message |
| [[LISTING_ROLLOUT]] | New listing type or region |
| [[JENKINS_LOCAL]] | Clone→up Jenkins house CI (JCasC, token, jobs) |
| [[PLACE_LISTING_SIM]] | Repeatable catalog create→list→get against compose (no chaos) |
| [[MOCK_HOST_CSP]] | fishing-journals.com Caddy CSP + geolocation (applied by apex cutover) |
| [[MOCK_PROD_DEPLOY]] | Apex deploy + Google GIS paths + FJ teardown |
| [[GOOGLE_GIS]] | Google Sign-In JS origins (Console + localhost vs 127.0.0.1) |

If a runbook and [[ops/workflow/SAFETY]] disagree, safety wins.
