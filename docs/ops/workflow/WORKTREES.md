---
title: Git checkouts and worktrees
type: workflow
owner: automation-expert
cssclasses:
  - moc
---

# Git checkouts and worktrees

Multiple Cursor sessions cannot share one working tree: git allows **one branch per checkout**. Worktrees give each session its own folder and branch so `main` stays the source of truth.

Procedure: [[ops/runbooks/WORKTREE]]. Loop: [[LOOP]]. Mock-prod: [[ops/tickets/WF-032]].

## Three layers

| Layer | Git | Where | What it is |
|---|---|---|---|
| **Truth** | `main` | Primary clone `~/Projects/my-island` | Company state. After CI squash-merge, this is what the playground VPS **should** run. |
| **PR / test** | `wf/<id>-slug` or `prd/<id>-slug` | Sibling worktree | One Cursor session, one ticket, one PR. CI tests this branch. |
| **Playground VPS** | **Deploy from `main` only** | `https://fishing-journals.com/` | Mock-prod. **Not** a GitHub Environment named `production`. |

Local compose remains the agent runtime ([[LOCAL]]). The VPS is a playground that tracks `main`. Do not invent `compose.prod` or a prod fleet ([[ops/company/DECISIONS]]).

```
main (primary)  →  company OS + what mock-prod should match
     ↑ squash-merge when CI green + valid APPROVED
worktree branch  →  this ticket’s PR and tests
```

## Rules

1. **Primary stays on `main`.** Fast-forward only (`git pull --ff-only`). No feature commits in `~/Projects/my-island`.
2. **One Cursor Agent session = one ticket = one worktree = one branch.** Same as [[SAFETY]] “one ticket per agent session”.
3. **Open the worktree as a new Cursor window.** Do not run two Agent sessions in the same folder.
4. **PRs come from the worktree branch.** Title `<id>: <title>`. Chat does not merge; Actions does.
5. **One Compose on the laptop.** Project name `my-island`, fixed ports. The tree that last ran `./scripts/app start` owns the stack. Other sessions: unit tests, or wait. Do not `up` a second stack.
6. **Obsidian vault** is `docs/` of the **primary** (on `main`). Do not open a second vault from a worktree. Vault updates after merge.
7. **Mock-prod follows `main` only.** Never deploy a feature branch / worktree to the VPS.
8. **Cloud Agents** clone in a VM. They do not use laptop worktrees.
9. **Reviewer** needs no worktree — `gh pr diff` / `/review` from anywhere.
10. **Docs-only** still uses a short-lived worktree + docs PR so the primary never leaves `main`. Exception: already implementing code in a worktree — fold related docs into **that** PR.

## Layout

Sibling directories next to the primary clone (already how this laptop looks):

```
~/Projects/my-island                      # primary; always main
~/Projects/my-island-WF-032-vps-cutover   # example worktree
~/Projects/my-island-WF-037-worktrees
```

Name: `~/Projects/my-island-<id>-<short-slug>`.

Do **not** nest worktrees inside the primary (no `.worktrees/` / `.cursor/worktrees` in the clone). Cursor “open in worktree” must point at a sibling path.

Stale trees (remote branch gone, ticket `done`) — `git worktree remove` them.

## Who uses which checkout

| Role | Checkout |
|---|---|
| Planner (docs-only) | Short-lived worktree from `origin/main` |
| Implementer | Worktree `wf/<id>-…` or `prd/<id>-…` from `origin/main` |
| Reviewer | Primary on `main`, or any tree — comments only |
| Human Obsidian | Primary `docs/` |
| `./scripts/app start` | One tree at a time (usually the implementer who needs HTTP/MCP) |
| `./scripts/deploy-mock-prod.sh` | From `main` after merge, machine with secrets — never from a feature tree |

## Testing

| Need | Where |
|---|---|
| Vault pytest | In the worktree (`python3 -m pytest ops/tests -q -m "not stack"`) |
| Catalog / web unit | In the worktree |
| HTTP / Grafana MCP / `./scripts/app test` | Shared compose; start from the worktree you are proving |
| PR CI | GitHub Actions (and local Jenkins) on the PR branch |
| “What should be on the VPS” | `main` after merge |

Rebuilds from a worktree replace the singleton stack’s images with **that** tree’s files. Stop first if another session had the stack.

`.env` is gitignored. If a worktree needs it, symlink from the primary: `ln -s ../my-island/.env .env`.

## Close-out

After CI squash-merge: delete the remote branch → `git worktree remove` → delete the local branch if it remains → `git pull --ff-only` on the primary → confirm Actions on `main` are green (else fix on a new worktree).

## If primary is not on `main`

Someone checked a feature branch out in `~/Projects/my-island`. Fix:

1. If that branch is still needed, `git worktree add ../my-island-<id>-<slug> <branch>` then `git checkout main` in the primary (git will refuse checkout while the branch is linked — add the worktree first, or stash + wait until the PR tree exists).
2. Prefer: finish or move the in-flight branch to a sibling tree, then keep primary on `main`.
