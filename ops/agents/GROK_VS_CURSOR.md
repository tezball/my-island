---
title: Grok Bot vs Cursor agents
type: workflow
---

# Grok Bot vs Cursor agents

Two runtimes, one git repo. Do not pretend they are interchangeable.

| | **Grok Bot teammates** | **Cursor cloud / local agents** |
|---|---|---|
| Job | Coordination and ops: tickets, digests, support drafts, content outlines, escalation | Change **this repository**: code, tests, vault notes that land in a PR |
| Writes | `ops/tickets`, `ops/daily`, `ops/runs`, comments on GitHub when tools allow | Branches, commits, `gh`/`ManagePullRequest`, pytest |
| Must not | Push application code, merge PRs, hold prod secrets | Merge PRs, prod deploy, implement `PRD-*` unless status is `implement`, polish disposable app code |
| Typical trigger | Chat, weekly digest schedule, inbound guest/host message | Board runner, PR opened, human “work the next ticket” |
| Source of truth | Same `ops/` vault after a human or Cursor agent commits the note | Same |

## Mapping

| Role | Default runtime | Why |
|---|---|---|
| CEO (`orchestrator`; formerly Orchestrator) | Grok for intake and digest; Cursor for vault PRs | Split coordination from git |
| automation-expert | Cursor | CI, skills, hooks, Automations YAML/docs; Grok only to describe a routine |
| product | Grok | Specs and ticket shaping; Cursor only if `product/` files must change on a branch |
| eng-frontend / eng-backend | Cursor | Future app (scaffolding). Dormant |
| eng-infra | Cursor | Compose + MCP runtime |
| guest-support / host-onboarding / content-seo / trust-safety | Grok | Language and policy; they **file** `PRD-*` / `INC-*` for Cursor to implement |
| ops-incidents | Grok declares; Cursor patches if the fix is in this repo | Follow [[runbooks/GUEST_SUPPORT]] and [[workflow/SAFETY]] |

## Handoff

1. Grok (or a human) writes or updates a ticket. Status `ready` or `inbox`.
2. Planner (Cursor or Grok if the plan is notes-only) writes `ops/plans/<id>.md`.
3. Human sets `status: implement` (or later: an approved label).
4. Cursor implementer branches, codes, opens PR, sets `status: review`.
5. Cursor reviewer comments. Human merges.
6. Grok weekly digest reads the board and open PRs — it does not merge to make the digest look green.

If Grok needs a file in git and cannot open a PR, it leaves a ticket for a Cursor agent instead of pasting a patch in chat.
