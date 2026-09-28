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

## 5. Main red

GitHub Actions workflow [`.github/workflows/main-red.yml`](../../../.github/workflows/main-red.yml) runs on `main` only. The script is [`ops/scripts/main_red_issue.py`](../../../ops/scripts/main_red_issue.py). `check_run` completed and commit `status` (including `jenkins/*`) both call it. The job checks out `main`.

| | |
|---|---|
| Opens | One issue labeled `main-red` per red main SHA. The title and body include the SHA, each failing check name, the status description, and the target URL. If that issue already exists, a new failing check is a comment. A second issue for the same SHA is not opened. |
| Red | A check-run conclusion of `failure`, or a commit status of `failure` or `error`. |
| Not red | `pending`, `success`, `skipped`, `cancelled`, and `neutral`. A pending Jenkins status does not open an issue and does not keep one open by itself. |
| Ignores | Every SHA that is not the current `main` HEAD. A red feature-branch pull request does not open an issue. |
| Closes | When that SHA is green, or `main` HEAD has moved on, with a short comment. |

While a `main-red` issue is open, [`ops/scripts/gha_review_gate.py`](../../../ops/scripts/gha_review_gate.py) (the poll and the one-PR automerge) skips squash-merge for every pull request except the open one linked from that issue or labeled `main-fix`. Reviews and CI keep running. The fix pull request still needs `unit tests`, `catalog tests`, `web tests`, `compose stack`, and a non-author approval.

The gate posts a commit status named `queue/main-fix`. It never uses the four real check names and never `jenkins/*`. Success on the main-fix pull request head. Failure on other same-repo open pull request heads, description `held while main is red`. It does not post that failure when the head SHA is main HEAD. `queue/main-fix` is ignored when deciding whether main is red, so it does not open or keep a `main-red` issue and does not keep the hold. When the issue closes or main is green, it posts success on those heads so they are not stuck. A pending status does not count as red, so it does not start or keep that hold.

This does not lock `main`, edit the ruleset, or add a bypass actor. The bypass list stays empty. The fix does not use the ruleset bypass list. After this is on `main`, `queue/main-fix` can be added as a required check. This PR does not add that required check. Requiring it before the workflow posts it would block the fix pull request too.

The live Cursor automation cannot be edited from git (no API). Paste this prompt into a new dashboard automation triggered when a `main-red` issue opens:

```
The issue is a red main SHA. Open one fix pull request from latest main. Label it main-fix and link the issue. Do not push to main. Do not post a green status. Do not weaken checks. Do not click Jenkins Build. Do not SSH. If the only log is http://127.0.0.1:8085 and the status description does not name the cause, say so on the issue and stop. If a main-fix pull request for this SHA already exists, do not open another. A failing fix pull request is not a new main failure.
```

## Enablement

These cannot be fully saved from chat until you confirm the draft in the Automations UI. Chat **cannot set** the Untitled trigger from git — Terry clicks **Workflow run completed** / workflow `CI` / success only. The PR loop row is the same limit: paste [[ops/workflow/PR-LOOP]] and Activate. Local loop works without them: open Cursor and say “work the next ready ticket”.

The live automation **PR Review** (`2a5248fd-aedf-11f1-bf4b-42ffb4d10ea7`) stores its prompt on the dashboard. There is no update API. This note does not edit that prompt. Paste this paragraph into it:

```
The change and the text of the PR are the path forward. If the docs say something else, that is an oversight and the docs need updating. Every PR leaves the ticket, the code, and the docs in sync.

A review that finds them apart asks for the stale ticket or doc to be updated in that same PR. It does not ask to revert the change the PR describes. A fixer updates the ticket and the docs to match the PR and leaves the change in place.
```
