---
title: PR agent loop
type: workflow
---

# PR agent loop

Owner: [[ops/agents/roles/automation-expert]]. Ticket: [[ops/tickets/WF-054]]. Merge policy stays [[ops/tickets/WF-050]] — this note does not add a second one.

Every same-repo pull request is tested, then leaves draft once CI has succeeded. Forks stay drafts. A failed or pending check stays a draft. After that it is reviewed, fixed when review or GitHub Actions is red, then squash-merged.

```
PR opened or marked ready
  → GitHub Actions CI tests the head SHA
  → four checks green → cursor reviews (Approve or Request changes)
  → a required check failed → cursor pushes a fix on that PR branch
  → Changes requested or a review comment → cursor pushes a fix on that PR branch
  → four checks green AND a valid non-author APPROVED → Automerge squash-merges
```

## Who does what

| Step | Runner | Pushes? | Approves? | Merges? |
|---|---|---|---|---|
| Test | [`.github/workflows/ci.yml`](../../../.github/workflows/ci.yml) on `pull_request` | No | No | No |
| Review, CI fix, comment fix | Cursor automation **my-island PR loop** (prompt below) | Only the PR head branch, and only to fix | Yes, only through the Cursor pull-request review tool that posts as `cursor[bot]`, and only when the four checks are already green | No |
| Merge | [`.github/workflows/automerge.yml`](../../../.github/workflows/automerge.yml) | No | No. Actions does not `createReview` | Squash, `sha` = head |

Required check names, same as CI: `unit tests`, `catalog tests`, `web tests`, `compose stack`. Pending or failure is not green. `CHANGES_REQUESTED` blocks merge. A stale Approve (`commit_id` ≠ head) does not count. `github-actions[bot]` and the PR author do not count. Submit Approve or Request changes only through the Cursor pull-request review tool that posts as `cursor[bot]`. That review counts. The 15:00 UTC loop run did not land a review. `gh api` as `cursor` returned 403, and the GitHub MCP ran as `tezball`, the author. Those do not count. Squash still needs those four green checks and a valid non-author `APPROVED` on the head SHA.

Chat still does not `gh pr merge`.

## What “failed CI” means

Fix a failed **check-run** from GitHub Actions on the head SHA. Jenkins posts **commit statuses**, including `continuous-integration/jenkins/branch` (“This commit cannot be built”) and a status that reuses the name `compose stack`. Those are not check-runs. Do not treat them as the failure, and do not change code to chase them. The gate in `ops/scripts/gha_review_gate.py` already ignores them the same way.

`chaos monkey` and `zap baseline` are merge CI. If one of those check-runs failed, fix that too. Do not re-run the four test jobs from a schedule on `ci.yml`.

## Caps

- At most **3** fix commits on one PR. Before pushing, count prior comments whose first line is `pr-loop fix`. At 3, comment `pr-loop stopped: fix cap` and stop.
- One PR per automation run. Do not open a second pull request.
- Do not force-push. Do not push `main`. Do not close the PR. Do not post to Slack. Do not touch Jenkins.
- A same-repo head that is behind `main`, or dirty, is updated by merging `origin/main` into that branch. No force-push. A conflict comments `update skipped: merge of origin/main conflicts` and skips the pull request. Forks are not updated. The new SHA still needs the four checks and a valid non-author `APPROVED`.
- Automerge marks a same-repo draft ready when CI succeeded (`draft: false`) by calling `markPullRequestReadyForReview`, and only after a re-fetch shows it is not a draft. A failed mutation leaves it a draft. The loop does not do that itself. Forks stay drafts. A failed or pending check stays a draft.

## Triggers to save

CI on this repo runs on `pull_request`. Cursor’s **Workflow run completed** trigger does not start for that event (it follows `push`). **CI completed** does. **CI completed** also skips PRs whose commits were pushed by `cursor[bot]`, so a cron backstop is part of the same automation.

Save **one** automation named `my-island PR loop` at [cursor.com/automations](https://cursor.com/automations). Repository `tezball/my-island`.

| Trigger | Settings |
|---|---|
| CI completed | On PRs. Condition **any**. |
| Pull request opened | Includes a draft marked ready. Ignore forks. |
| PR review submitted | Any review state. Ignore drafts. |
| PR review comment | Ignore drafts. |
| Comment added | Ignore drafts. |
| Scheduled | `*/3 * * * *` (testing cadence). Repository must be set (a schedule defaults to no repo). |

Tools: **Comment on pull request** with approvals **on** and inline comments **off** (nits stay in the review body). **Resolve review threads** on. **Pull request creation off** (the agent pushes the existing head branch; it does not open another PR). Memories off. Slack off. Computer use off.

This chat cannot Save or Activate that row. The prompt below is the workflow.

## Prompt

```
You are the PR loop for tezball/my-island. One open pull request, then stop.

Read @docs/ops/workflow/PR-LOOP.md @docs/ops/workflow/SAFETY.md @docs/ops/workflow/CI.md @ops/scripts/gha_review_gate.py

Skip forks. A same-repo draft is marked ready by Automerge when CI succeeded; do not mark it ready yourself, and do not skip it after that. A draft whose checks are still pending or failed stays a draft — stop. Never push main. Never force-push. Never gh pr merge. Never close a PR. Never post to Slack. Never touch Jenkins. Actions must not be asked to createReview.

Pick the pull request this event names. On a schedule, list open same-repo PRs and pick the oldest that is not a draft and not a fork and that still needs review, a CI fix, or a comment fix. If none, stop.

Decide in this order:

1. A GitHub Actions check-run named unit tests, catalog tests, web tests, or compose stack is missing, pending, or not success on the head SHA — or chaos monkey or zap baseline failed. Jenkins commit statuses do not count, including continuous-integration/jenkins/branch and a status named compose stack. If a real check-run failed: read that job log, push one fix to the PR head branch, and comment with the first line exactly `pr-loop fix`. If three such comments already exist, comment `pr-loop stopped: fix cap` and stop. Do not approve on this path.

2. The latest review state is CHANGES_REQUESTED, or a review comment / top-level comment asks for a code change that is not done. Push one fix to the PR head branch. Comment `pr-loop fix`. Same cap. Do not approve. Do not dismiss someone else's review.

3. Those four check-runs are success and there is no valid APPROVED on the head SHA from an actor other than github-actions[bot] and other than the PR author. Review against SAFETY and the linked ticket/plan. Nits go in the review body only. If SAFETY is broken, Request changes. Otherwise Approve. Submit that Approve or Request changes only through the Cursor pull-request review tool that posts as cursor[bot]. gh api as cursor returned 403 and does not land a review. The GitHub MCP running as the PR author does not count. Do not push.

4. Otherwise stop. Automerge squash-merges when the four checks are green and that Approve is on the head SHA.

If you already commented `pr-loop` on this same head SHA for the same reason, stop.
```
