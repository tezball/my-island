---
title: Cursor Automations
type: workflow
---

# Cursor Automations

Cloud jobs that run the loop when nobody is in the IDE. They do **not** replace local agents. Merge of ready PRs is GitHub Actions ([[ops/tickets/WF-050]]), not these jobs. Enable them in the Cursor Automations editor after this vault is on `main` (prompts may `@` files only once those files are committed).

## 1. PR reviewer

| | |
|---|---|
| When | **Workflow run completed** — workflow `CI`, **success only**. Not Pull request opened. Not pushed. |
| Does | Review the diff against the linked ticket/plan. **No-op** if `unit tests` / `catalog tests` / `web tests` / `compose stack` are not all success. Submit Approve or Request changes. Nits in the **review body only** (no inline threads for nits). |
| Does not | Merge, push, start before those four jobs succeeded, approve as `github-actions[bot]` |
| Tools | Pull request review |

Detail and required-check names: [[ops/workflow/CI]].

## 2. Board runner

| | |
|---|---|
| When | Weekdays 09:00 UTC (adjust in editor) |
| Does | Checkout `main`. If a ticket is `ready` with no plan, write the plan on a branch and open a PR. If a ticket is `implement` with an approved plan and no open PR, implement **that one ticket** and open a PR. Stop after one ticket. |
| Does not | Merge, touch more than one ticket, prod |
| Tools | GitHub (PR create via agent), repo checkout |

## 3. Re-review on push

| | |
|---|---|
| When | New commits on an open PR |
| Does | Same as reviewer, shorter: only the new commits |
| Does not | Merge |

## Enablement

These cannot be fully saved from chat until you confirm the draft in the Automations UI. Chat **cannot set** the Untitled trigger from git — Terry clicks **Workflow run completed** / workflow `CI` / success only. Local loop works without them: open Cursor and say “work the next ready ticket”.
