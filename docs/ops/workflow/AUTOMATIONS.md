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

The change and the text of the PR are the path forward. If the docs say something else, that is an oversight and the docs need updating. Every PR leaves the ticket, the code, and the docs in sync.

A review that finds them apart asks for the stale ticket or doc to be updated in that same PR. It does not ask to revert the change the PR describes. A fixer updates the ticket and the docs to match the PR and leaves the change in place.

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

## 4. PR loop (review, failed CI, review comments)

| | |
|---|---|
| Name | `my-island PR loop` |
| When | **CI completed** (any conclusion, PRs, not drafts). Also PR review submitted, PR review comment, comment added, and cron `*/3 * * * *` (testing cadence) so a `cursor[bot]` push or a `pull_request`-only Actions run is not missed. |
| Does | One PR. Fix a failed Actions check-run, or fix `CHANGES_REQUESTED` / review comments, or Approve / Request changes when the four checks are green. A fixer updates the ticket and the docs to match the PR and leaves the change in place. Spec and prompt: [[ops/workflow/PR-LOOP]]. |
| Does not | Merge, push `main`, treat a Jenkins commit status as failed CI, open a second PR, approve before the four checks are success |
| Merge | Still [[ops/tickets/WF-050]] `automerge.yml`. This job does not squash-merge. |

## Enablement

These cannot be fully saved from chat until you confirm the draft in the Automations UI. Chat **cannot set** the Untitled trigger from git — Terry clicks **Workflow run completed** / workflow `CI` / success only. The PR loop row is the same limit: paste [[ops/workflow/PR-LOOP]] and Activate. Local loop works without them: open Cursor and say “work the next ready ticket”.

The live automation **PR Review** (`2a5248fd-aedf-11f1-bf4b-42ffb4d10ea7`) stores its prompt on the dashboard. There is no update API. This note does not edit that prompt. Paste this paragraph into it:

```
The change and the text of the PR are the path forward. If the docs say something else, that is an oversight and the docs need updating. Every PR leaves the ticket, the code, and the docs in sync.

A review that finds them apart asks for the stale ticket or doc to be updated in that same PR. It does not ask to revert the change the PR describes. A fixer updates the ticket and the docs to match the PR and leaves the change in place.
```
