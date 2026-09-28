---
title: CI conventions
type: workflow
---

# CI-friendly conventions

Owner: [[ops/agents/roles/automation-expert]]. Runtime: **local Jenkins** ([[ops/runbooks/JENKINS_LOCAL]], [[ops/tickets/WF-031]]) + **GitHub Actions** dual-run ([`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)). Policy: [[SAFETY]].

Agents must be able to **clone → test → PR** without a human laptop ritual. Engineers get Jenkins on `./scripts/dev up`.

## What CI proves (now)

| Job | Command | Where |
|---|---|---|
| `unit` | `python3 -m pytest ops/tests -q -m "not stack"` | Jenkins `local-ci` / GHA `unit` |
| `catalog` | `services/catalog/mvnw test` (Temurin 21, Testcontainers PostGIS — **contract** / what) | Jenkins / GHA `catalog` |
| `web` | `npm ci && npm test && npm run build` in `web/` | Jenkins / GHA `web` |
| `stack` | `./scripts/dev test` with compose (`SKIP_WEB=1`; seed still runs) | Jenkins / GHA `stack` (`SKIP_JENKINS=1` in Actions) |
| `chaos` (ticket) | House overlay / Testcontainers; retries + default fallbacks | [[ops/tickets/WF-043]] — **merge CI**, not inside `unit`/`catalog`, not cron |
| `zap` (ticket) | ZAP-style DAST vs local compose/Testcontainers | [[ops/tickets/WF-044]] — **every merge**; **not** primary scan of fishing-journals.com; not cron |
| `gatling` (ticket) | 10-user trickle on fishing-journals.com (`H/15`); weekly perf; on-demand 100-user 10-minute pulse | [[ops/tickets/WF-042]] · [[ops/tickets/WF-056]] — **not** a merge load test. `gatling-pulse` has no cron and is not a deploy trigger. Failures → Jenkins red + Grafana/AM [[ops/tickets/WF-045]] |
| Playwright | Cron vs fishing-journals.com + MCP on demand | [[ops/tickets/WF-011]] — **not** a merge gate; keep off `unit`/`catalog` |

Vitest is a merge gate. Merge CI: catalog API, Chaos, ZAP. Playwright is cron + MCP. Gatling is trickle + weekly perf (not merge load). **Catalog writes lock C:** no public Place POST/PUT/PATCH/DELETE — seed/import in CI/deploy; Guests write VisitIntent only ([[ops/tickets/WF-046]]). House: Java/Spring + Vite/React PWA per [`product/STACK.md`](../../product/STACK.md) — not Next.js. Full mix (gates vs tools vs want): [[TEST_STACK]].

## Local Jenkins

- Config: `ops/jenkins/casc/` (JCasC) + root `Jenkinsfile` — all in git.
- State: Docker volume `ops_jenkins` (survives restart; wipe with `down -v`).
- UI: http://127.0.0.1:8085 (`admin` / `admin` unless `.env` overrides).
- GitHub PR builds: set `JENKINS_GITHUB_TOKEN` in `.env`, recreate jenkins, scan `my-island` multibranch (polls; no public webhook).
- Multibranch posts commit statuses named `unit tests` / `catalog tests` / `web tests` / `compose stack` ([[ops/tickets/WF-051]]). The host-visible checkout is `~/Projects/my-island-ci/<job>` ([[ops/tickets/WF-052]]), not a sibling under all of `~/Projects` and not the primary clone. Stack uses Compose project `my-island-ci` and remapped host ports so it does not recreate the laptop `my-island` stack. `jenkins_isolate_env` sets `JENKINS_CI_STACK=1`, and `scripts/dev` then loads `compose.ci.yml`, which clears Mailpit host ports 1025 and 8025. Catalog still sends mail to `mailpit:1025` on the compose network. Local `./scripts/dev up` keeps those host ports. Maven/npm caches: volumes `ops_m2` / `ops_npm`. The CI-directory mount applies only after the Jenkins container is recreated.
- Automerge for remote PRs still waits on **GHA** greens plus a valid non-author `APPROVED` ([[ops/tickets/WF-050]], [[ops/tickets/WF-025]]) during dual-run. Do not retarget branch protection until those Jenkins statuses are green on a PR. Do not delete GHA test jobs in WF-051.
- After squash to `main`, GHA `automerge` **dispatches** CI on `main` (`workflow_dispatch`). `GITHUB_TOKEN` squash does **not** fire `push`, so a push-only Jenkins trigger would not see that SHA ([[ops/tickets/WF-048]]). Dispatch + merged-PR-head fallback give `unit` + `catalog` + `web` + `stack` on a SHA the gate can see. When those checks have succeeded, GHA `mock-prod signal` starts Jenkins `deploy-mock-prod` (push **or** dispatch, `main` only). No `production` Environment.

## Agent rules

1. **Same commands locally, in Jenkins, and in Actions.** `./scripts/dev test` is the contract.
2. **Fast path first.** Vault/docs/script PRs must pass `not stack` without compose.
3. **Never `--no-verify`.** Never force-push `main`.
4. **No secrets in logs or notes.** Tokens only in `.env` / credential store.
5. **One ticket’s diff.**
6. **Pytest is the contract for the OS.** Vault files the loop depends on → `ops/tests/test_vault.py`.
7. **Markers.** `stack` = needs compose. Default tests must not need it.
8. **No chaos / ZAP / Playwright / full Gatling inside UI-less jobs.** `unit` / `catalog` stay fast. Dedicated merge jobs: Chaos Monkey [[ops/tickets/WF-043]], ZAP [[ops/tickets/WF-044]]. Playwright is **cron + MCP only** ([[ops/tickets/WF-011]]). Gatling: light trickle + weekly perf, **not** merge load ([[ops/tickets/WF-042]]). Do not assault public fishing-journals.com with Chaos Monkey on every deploy. Do not move Chaos/ZAP to cron.
9. **Do not restore legacy Jenkins** from `docs/automation/`.
10. **ZAP-style DAST in merge CI** against local compose/Testcontainers **every merge** ([[ops/tickets/WF-044]]). Not the primary scan of the public test server.

## Branch and PR

- Branch: `wf/<id>-slug` or `prd/<id>-slug` from a sibling worktree ([[ops/workflow/WORKTREES]]); Cloud Agent `cursor/…`.
- Title: `<id>: <ticket title>`.
- Body: links `docs/ops/tickets/<id>.md` and `docs/ops/plans/<id>.md`.
- CI must be green before merge. Ready same-repo PRs are squash-merged by the sibling GHA `Automerge` workflow (`workflow_run` after `CI` succeeds, or `pull_request_review` submitted) when the four test jobs succeeded **and** a current `APPROVED` exists from `cursor` / a non-author who is not `github-actions[bot]` ([[ops/tickets/WF-050]]). Merge is **not** a job in `ci.yml`, so it does not appear queued at t=0. If CI is green but that Approve is missing, `automerge` succeeds as `waiting for review` — it does **not** fail the PR red. A same-repo draft is marked ready when those four checks succeeded. Forks stay drafts. Chat agents do not merge. Actions does not `createReview`.
- After merge: confirm Actions on **`main`** are green. PR green is not the finish line — if `main` goes red, open a fix PR and re-run the loop ([[ops/workflow/PIPELINE]]).

## Adding a check

1. File a `WF-*` ticket owned by **automation-expert** (or **eng-security** for DAST). Merge CI: catalog API, Chaos, ZAP. Playwright is cron + MCP. Gatling is trickle + weekly (not merge load). Keep Chaos/ZAP/Playwright/full-perf off `unit`/`catalog` bodies.
2. Implement in `Jenkinsfile` + `.github/workflows/ci.yml` + `./scripts/dev` if humans/agents must run it too.
3. Document the job in this note and the TEST_STACK row.

## Review-gated automerge (WF-050)

**Order.** `CI` ([`.github/workflows/ci.yml`](../../../.github/workflows/ci.yml)) on `pull_request` / `push` / `workflow_dispatch` runs **only** `unit tests`, `catalog tests`, `web tests`, `compose stack`, and (on `main`) `mock-prod signal`. There is **no** automerge / auto-review job in that workflow. Putting merge in the same file made GitHub list `auto-review approve merge` as queued from **t=0** on PR opened — before the four tests existed — and Cursor Untitled fired on that.

Merge is a **sibling** workflow [`.github/workflows/automerge.yml`](../../../.github/workflows/automerge.yml) named `Automerge`:

| Trigger | When it runs |
|---|---|
| `check_run` | `types: [completed]` when a github-actions check named `unit tests`, `catalog tests`, `web tests`, or `compose stack` has conclusion **success**. The script still requires all four success on that head SHA. |
| `workflow_run` | Workflow name `CI`, `types: [completed]`, job `if:` conclusion is **success** (and same-repo). Kept so a full CI success still runs the gate. |
| `pull_request_review` | `types: [submitted]` from a login that is **not** the PR author. |

One concurrency group per head SHA, `cancel-in-progress: false`. The script refuses a second run for that SHA while one is in flight or has already decided (`automerge/decision`). That status is not a required check. A non-author review may run again after a wait. `GITHUB_TOKEN` still does not run `pull_request` workflows; the gate keeps `workflow_dispatch` of `ci.yml` for that case.

Separate workflow **names** mean a review event cannot cancel in-flight `unit` / `catalog` / `web` / `stack`. `Automerge` does not define those four jobs (no skip-propagation).

The fast path is that event. [`.github/workflows/automerge-poll.yml`](../../../.github/workflows/automerge-poll.yml) is only the backstop: hourly (`0 * * * *`, and `workflow_dispatch`), not `*/5` and not Jenkins `H/5`. A missed webhook can still merge. The poll runs the same script, including `draft: false` when the four checks already succeeded on a same-repo pull request. It does not re-run `unit tests`, `catalog tests`, `web tests`, or `compose stack`. Jenkins commit statuses reuse those context names; the script reads check-runs only, so a failing Jenkins status does not hide a green Actions check-run. The latest check-run of each name still wins — a later failed check-run named `compose stack` blocks. The poll does not `createReview`. It does not merge `origin/main` into a head on a pass that is not about to squash. Immediately before squash, a same-repo head that is behind `main`, or whose `mergeable_state` is `dirty`, is updated by merging `main` into the head (`POST /merges`, not a force-push). If that merge changes the head, this run does not squash; the check-success event runs the gate on the new SHA. Forks are not updated. A conflict posts one pull request comment, `update skipped: merge of origin/main conflicts`, and skips that pull request. A successful merge dispatches `ci.yml` on that head branch (`workflow_dispatch`, not `main`). A dispatch failure is logged and does not fail the poll. Forks are not dispatched. When those four github-actions check runs are completed and a name is missing from the pull request rollup, the poll copies that conclusion onto a commit status (`success` or `failure` only), then re-fetches the rollup. It does not invent success, does not overwrite an existing `failure` on that same context, and does not write `jenkins/…` contexts. Forks are not mirrored. When the head commit author is `cursoragent` (`cursoragent@cursor.com`), those four checks are success, and there is no valid non-author `APPROVED`, the poll adds one empty commit on that branch (`Trigger review for pull request head`, authored by the Actions token, fast-forward, no force-push), dispatches `ci.yml` on that branch, and skips ready, mirror, and squash for that pull request in that run. If the head message is already that trigger, it does not push another. That fallback stays until the PR Review author filter includes `cursoragent`. Forks are skipped. The four-check gate and the non-author approval rule are unchanged. The new head still needs the four green Actions checks and a valid non-author `APPROVED`. A main-red hold still skips squash except for a pull request labeled `main-fix`.

Ready same-repo non-draft PRs squash-merge only when those four **job names** succeeded on the head SHA **and** a GitHub review on that SHA has state `APPROVED` (create-review event is `APPROVE`) from `cursor` / any actor that is **not** `github-actions[bot]` and **not** the PR author. `CHANGES_REQUESTED` blocks. Stale Approve (`commit_id` ≠ head) does not count. Actions does not `createReview`.

If CI is green but there is no valid Approve yet, `automerge` **succeeds** with `waiting for review`. It does not `setFailed`. Red CI is the four test jobs, never this job.

Do **not** add `automerge` / `auto-review approve merge` / `Cursor Automation: Untitled` as required GitHub checks.

Jenkins `deploy-mock-prod` starts from `mock-prod signal` after CI succeeds on `main` (no few-minute poll). [[ops/tickets/WF-048]] `workflow_dispatch` after squash still runs that CI. No production Environment.

## Cursor PR-review automation (Terry)

Chat **cannot edit** Cursor Automations and **cannot set** this trigger from git. Terry must click it in the Untitled automation on cursor.com.

The existing automation **Untitled** must **not** fire on Pull request opened or pushed.

| | |
|---|---|
| Trigger | **Workflow run completed** |
| Workflow | `CI` |
| Filter | **success only** |
| Do | Review the diff against the linked ticket/plan. Submit **Approve** or **Request changes**. Nits go in the **review body only** — no inline threads for nits. The change and the text of the PR are the path forward. If the docs say something else, that is an oversight and the docs need updating. Every PR leaves the ticket, the code, and the docs in sync. A review that finds them apart asks for the stale ticket or doc to be updated in that same PR. It does not ask to revert the change the PR describes. A fixer updates the ticket and the docs to match the PR and leaves the change in place. |
| Do not | Merge, push, start before the four jobs above are success. Prompt must **no-op** if `unit tests` / `catalog tests` / `web tests` / `compose stack` are not all success. |
| Must not be a required GitHub check | `Cursor Automation: Untitled`, `automerge`, `auto-review approve merge` |

The live row is **PR Review** (`2a5248fd-aedf-11f1-bf4b-42ffb4d10ea7`). Its prompt is dashboard-only. There is no update API. Chat does not edit it. Paste the paragraph in [[ops/workflow/AUTOMATIONS]] into that prompt.

## PR loop (WF-054)

Review, failed Actions, and review comments are one Cursor automation, **my-island PR loop**, specified in [[ops/workflow/PR-LOOP]]. It uses **CI completed**, not only **Workflow run completed**, because `CI` runs on `pull_request` and that workflow-run trigger does not start for `pull_request`. A cron `*/3 * * * *` is the testing backstop when the event is dropped (including pushes by `cursor[bot]`).

The automation may Approve as `cursor` after the four checks are success. It does not merge. It does not push `main`. A Jenkins commit status is not a failed required check. Squash-merge stays in `automerge.yml`.

Agents open pull requests as drafts. When the four checks succeeded, the gate runs `markPullRequestReadyForReview` and prints marked ready only after a re-fetch shows the pull request is not a draft. A failed mutation leaves it a draft. Forks stay drafts. A failed or pending check stays a draft. Merge still requires the four checks and a valid non-author `APPROVED`.

## Required GitHub checks

Branch protection / rulesets: required checks = **only** the four test job names (`unit tests`, `catalog tests`, `web tests`, `compose stack`). **Never** require `automerge`, `auto-review approve merge`, or `Cursor Automation: Untitled`.
