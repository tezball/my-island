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
pick ticket → plan/docs on main → implement in worktree + open PR → review comment
  → CI → squash-merge → delete branch + remove worktree → confirm main CI green, else fix
```

| Step | Who | Mode | How |
|---|---|---|---|
| Pick next ticket | Agent | agent | `next_ticket.py --role auto` |
| Plan + land docs on `main` | Planner | agent | Short docs PR; statuses on `main` |
| Implement + open PR | Implementer | agent | Sibling worktree `wf/…` or `prd/…`; `gh pr create` ([[ops/workflow/WORKTREES]]) |
| Safety review comment | Reviewer | agent | Comment only; no merge from chat |
| CI `unit` + `catalog` + `stack` | GHA (+ local Jenkins) | **auto** | [[ops/workflow/CI]] · [[ops/tickets/WF-031]] |
| Approve + squash-merge ready PR | GitHub Actions | **auto** after valid `APPROVED` | [[ops/tickets/WF-050]] — green `unit tests`+`catalog tests`+`web tests`+`compose stack` **and** non-author, non-`github-actions[bot]` Approve on the head SHA. Drafts/forks skipped. Actions does not `createReview`. |
| Delete feature branch + worktree | Agent / house rule | agent | After merge; primary stays on `main` |
| Confirm `main` CI green | Agent | agent | Watch Actions on `main` after merge; if red, open a fix PR and repeat from implement. Merge CI includes catalog API, Chaos, ZAP. Playwright is cron. Gatling is trickle + weekly, not merge load. |
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
| Playwright / consumer UI | **auto** (cron) | **Not merge CI.** Cron vs fishing-journals.com (recommend 6h) + MCP on demand [[ops/tickets/WF-011]]. Keep off `unit`/`catalog`. |
| Test mix (how / what / wiring / operate) | map | [[ops/workflow/TEST_STACK]] — contract is Gherkin on Testcontainers. Only Playwright is outside merge CI. |
| Chaos Monkey (retries / fallbacks) | **auto** (merge) | Dedicated merge job [[ops/tickets/WF-043]]. Not inside `unit`/`catalog`. Not cron. Not on public fishing-journals.com every deploy. |
| ZAP-style DAST | **auto** (merge) | Every merge vs local compose/Testcontainers [[ops/tickets/WF-044]]. Not cron. Not the primary scan of the public test server. |
| Gatling trickle | **auto** (ongoing) | Light trickle on fishing-journals.com as feature smoke — not merge load [[ops/tickets/WF-042]]. Failures mark Jenkins red and fire Grafana/AM [[ops/tickets/WF-045]]. |
| Gatling full perf | **auto** (weekly) | Weekly Jenkins cron and/or MCP/manual. Not every merge. Failures mark Jenkins red and fire Grafana/AM [[ops/tickets/WF-045]]. |
| Deploy to mock-prod VPS | **auto** (Jenkins) | Green `origin/main` (GHA `unit` + `catalog` + `web` + `stack` on the SHA, or on the merged PR head after a `GITHUB_TOKEN` squash — [[ops/tickets/WF-048]]) → Jenkins `deploy-mock-prod` cron `H/5` + `gate_mock_prod_deploy.py` ([[ops/tickets/WF-040]]). Automerge dispatches CI on `main` because squash does not fire `push`. No human click. From **`main` only**. SSH key stays in Jenkins. Agents never SSH — they watch the job + public HTTPS. **Lock C ([[ops/tickets/WF-049]]):** optional trigger from the Mac mini self-hosted worker (loopback Jenkins). Not Cloud VM HTTPS to Jenkins (not B). Not GHA SSH (not D). Not a GitHub `production` Environment. Host-pick ticket [[ops/tickets/WF-010]] stays blocked. Do **not** run Chaos Monkey or primary ZAP against the public host on every deploy. |
| Production deploy | **never** | No prod Environment ([[ops/company/DECISIONS]]) |

## Explicitly not automated (today)

| Item | Mode | Ticket / note |
|---|---|---|
| Save + Activate Cursor Automations UI | **human** (deferred) | Plan kept; not MVP — [[ops/workflow/AUTOMATIONS]] |
| Google Sign-In client id/secret | **human** if Console origins change | GIS already live; [[ops/tickets/WF-014]] Spring OIDC still later. Password seed Guests are the agent login path ([[ops/tickets/PRD-010]]). |
| Apple Sign-In Developer creds | **human** post-MVP | [[ops/tickets/WF-033]] |
| Counsel revisit before customer-facing prod | **human** later | [[ops/tickets/PRD-009]] — data OK for current use |
| Staging host pick | **human** | [[ops/tickets/WF-010]] |
| Chat agent `gh pr merge` | **never** | CI merges; reviewer hat comments only |
| Secrets in vault notes | **never** | `.env` / credential store only |

## Product loop (MVP agents)

Implement work is **agent**, not cron: [[ops/agents/mvp-team]]. CEO lock **C**: two streams in **parallel** — (1) [[ops/tickets/WF-040]] + [[ops/tickets/WF-041]] + [[ops/tickets/WF-042]] + [[ops/tickets/WF-043]] + [[ops/tickets/WF-044]] + [[ops/tickets/WF-045]] + [[ops/tickets/WF-046]] (commit→deploy→test→confirm; chaos + ZAP in CI; Gatling trickle/weekly fail → Jenkins red + Grafana/AM; close public Place writes); (2) [[ops/tickets/PRD-010]] + [[ops/tickets/PRD-015]] (password **and** Google SSO; VisitIntent). Do not serialize VisitIntent behind deploy. GIS stays. Do not pick [[ops/tickets/PRD-012]] / [[ops/tickets/PRD-013]] for that slice.

## Related

- Loop policy: [[ops/workflow/LOOP]]
- Safety: [[ops/workflow/SAFETY]]
- Test mix: [[ops/workflow/TEST_STACK]] · [[ops/workshops/cto-test-stack]]
- Jenkins canvas (CI only): [[ops/workflow/jenkins-local-ci]]
