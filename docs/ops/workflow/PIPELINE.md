---
title: Agent pipeline — automated vs not
type: workflow
owner: automation-expert
audience: cto
---

# Agent pipeline — automated vs not

Owner: [[ops/agents/roles/automation-expert]]. Visual: [[ops/workflow/agent-pipeline]]. Meeting brief: [[ops/workshops/cto-pipeline-brief]].

**Question this note answers:** what runs without a person, what needs an agent session, and what still needs a human.

Legend: **auto** = machine/CI does it · **agent** = Cursor/chat or Cloud Agent must be started · **human** = person must click or provide a secret · **never** = out of policy

## Happy path (ticket → `main`)

```
pick ticket → plan/docs on main → implement + open PR → review comment
  → CI → squash-merge → delete branch → confirm main CI green, else fix
```

| Step | Who | Mode | How |
|---|---|---|---|
| Pick next ticket | Agent | agent | `next_ticket.py --role auto` |
| Plan + land docs on `main` | Planner | agent | Short docs PR; statuses on `main` |
| Implement + open PR | Implementer | agent | Branch `wf/…` or `prd/…`; `gh pr create` |
| Safety review comment | Reviewer | agent | Comment only; no merge from chat |
| CI `unit` + `catalog` + `stack` | GHA (+ local Jenkins) | **auto** | [[ops/workflow/CI]] · [[ops/tickets/WF-031]] |
| Approve + squash-merge ready PR | GitHub Actions | **auto** | [[ops/tickets/WF-025]] — drafts/forks skipped |
| Delete feature branch | Agent / house rule | agent | After merge; no orphan docs branches |
| Confirm `main` CI green | Agent | agent | Watch Actions on `main` after merge; if red, open a fix PR and repeat from implement |
| Board sync (when statuses change) | Agent | agent | `board_sync.py` after ticket frontmatter |

Cloud Cursor Automations (board runner / PR reviewer / re-review) are **specified** but **not enabled** for MVP ([[ops/tickets/WF-003]] `done`). Until then, a human or Cloud Agent **starts** each session; the merge step is still auto. PR CI green is not enough — **`main` must stay green** after the squash.

## CI / CD surface

| Capability | Mode | Notes |
|---|---|---|
| Vault / OS pytest (`not stack`) | **auto** | Required on every PR |
| Catalog Maven + Testcontainers | **auto** | Required |
| Compose stack `./scripts/dev test` | **auto** | Required; GHA uses `SKIP_JENKINS=1` |
| Local Jenkins UI / `local-ci` | **auto** (laptop) | `./scripts/dev up` → :8085 |
| Jenkins multibranch PR poll | agent+secret | Needs `JENKINS_GITHUB_TOKEN` in `.env` |
| Playwright / consumer UI CI | **human** backlog | Waits [[ops/tickets/WF-011]] |
| Test mix (unit → chaos → Gatling) | map | [[ops/workflow/TEST_STACK]] — gates vs agent tools |
| Deploy to mock-prod VPS | **human** / blocked | Stub [[ops/tickets/WF-032]]; host [[ops/tickets/WF-010]] |
| Production deploy | **never** | No prod Environment ([[ops/company/DECISIONS]]) |

## Explicitly not automated (today)

| Item | Mode | Ticket / note |
|---|---|---|
| Save + Activate Cursor Automations UI | **human** (deferred) | Plan kept; not MVP — [[ops/workflow/AUTOMATIONS]] |
| Google Sign-In client id/secret | **human** post-MVP | [[ops/tickets/WF-014]] |
| Apple Sign-In Developer creds | **human** post-MVP | [[ops/tickets/WF-033]] |
| Counsel revisit before customer-facing prod | **human** later | [[ops/tickets/PRD-009]] — data OK for current use |
| Staging host pick | **human** | [[ops/tickets/WF-010]] |
| Chat agent `gh pr merge` | **never** | CI merges; reviewer hat comments only |
| Secrets in vault notes | **never** | `.env` / credential store only |

## Product loop (MVP agents)

Implement work is **agent**, not cron: [[ops/agents/mvp-team]]. Suggested parallel: seed ∥ auth ∥ explore → place → checkoff → me → launch.

## Related

- Loop policy: [[ops/workflow/LOOP]]
- Safety: [[ops/workflow/SAFETY]]
- Test mix: [[ops/workflow/TEST_STACK]] · [[ops/workshops/cto-test-stack]]
- Jenkins canvas (CI only): [[ops/workflow/jenkins-local-ci]]
