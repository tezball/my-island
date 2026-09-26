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
| `gatling` (ticket) | Light trickle on fishing-journals.com; weekly full perf | [[ops/tickets/WF-042]] — **not** a merge load test. Failures → Jenkins red + Grafana/AM [[ops/tickets/WF-045]] |
| Playwright | Cron vs fishing-journals.com + MCP on demand | [[ops/tickets/WF-011]] — **not** a merge gate; keep off `unit`/`catalog` |

Vitest is a merge gate. Merge CI: catalog API, Chaos, ZAP. Playwright is cron + MCP. Gatling is trickle + weekly perf (not merge load). **Catalog writes lock C:** no public Place POST/PUT/PATCH/DELETE — seed/import in CI/deploy; Guests write VisitIntent only ([[ops/tickets/WF-046]]). House: Java/Spring + Vite/React PWA per [`product/STACK.md`](../../product/STACK.md) — not Next.js. Full mix (gates vs tools vs want): [[TEST_STACK]].

## Local Jenkins

- Config: `ops/jenkins/casc/` (JCasC) + root `Jenkinsfile` — all in git.
- State: Docker volume `ops_jenkins` (survives restart; wipe with `down -v`).
- UI: http://127.0.0.1:8085 (`admin` / `admin` unless `.env` overrides).
- GitHub PR builds: set `JENKINS_GITHUB_TOKEN` in `.env`, recreate jenkins, scan `my-island` multibranch (polls; no public webhook).
- Multibranch posts commit statuses named `unit tests` / `catalog tests` / `web tests` / `compose stack` ([[ops/tickets/WF-051]]). Stack uses Compose project `my-island-ci` and remapped host ports so it does not recreate the laptop `my-island` stack. Maven/npm caches: volumes `ops_m2` / `ops_npm`.
- Automerge for remote PRs still waits on **GHA** greens plus a valid non-author `APPROVED` ([[ops/tickets/WF-050]], [[ops/tickets/WF-025]]) during dual-run. Do not retarget branch protection until those Jenkins statuses are green on a PR. Do not delete GHA test jobs in WF-051.
- After squash to `main`, GHA `automerge` **dispatches** CI on `main` (`workflow_dispatch`). `GITHUB_TOKEN` squash does **not** fire `push`, so Jenkins cannot wait on push-check-runs for the squash SHA ([[ops/tickets/WF-048]]). Dispatch + merged-PR-head fallback give `unit` + `catalog` + `web` + `stack` on a SHA the `H/5` gate can see. GHA `mock-prod-signal` is the visible “main is green” check (push **or** dispatch). No `production` Environment.

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
- CI must be green before merge. Ready same-repo PRs are squash-merged by the sibling GHA `Automerge` workflow (`workflow_run` after `CI` succeeds, or `pull_request_review` submitted) when the four test jobs succeeded **and** a current `APPROVED` exists from `cursor` / a non-author who is not `github-actions[bot]` ([[ops/tickets/WF-050]]). Merge is **not** a job in `ci.yml`, so it does not appear queued at t=0. If CI is green but that Approve is missing, `automerge` succeeds as `waiting for review` — it does **not** fail the PR red. Drafts and forks are skipped. Chat agents do not merge. Actions does not `createReview`.
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
| `workflow_run` | Workflow name `CI`, `types: [completed]`, job `if:` conclusion is **success** (and same-repo). |
| `pull_request_review` | `types: [submitted]` — late Cursor `APPROVED` after CI is already green. |

Separate workflow **names** mean a review event cannot cancel in-flight `unit` / `catalog` / `web` / `stack`. `Automerge` does not define those four jobs (no skip-propagation).

Ready same-repo non-draft PRs squash-merge only when those four **job names** succeeded on the head SHA **and** a GitHub review on that SHA has state `APPROVED` (create-review event is `APPROVE`) from `cursor` / any actor that is **not** `github-actions[bot]` and **not** the PR author. `CHANGES_REQUESTED` blocks. Stale Approve (`commit_id` ≠ head) does not count. Actions does not `createReview`.

If CI is green but there is no valid Approve yet, `automerge` **succeeds** with `waiting for review`. It does not `setFailed`. Red CI is the four test jobs, never this job.

Do **not** add `automerge` / `auto-review approve merge` / `Cursor Automation: Untitled` as required GitHub checks.

Jenkins `H/5` mock-prod / [[ops/tickets/WF-048]] `workflow_dispatch` after squash is unchanged. No production Environment.

## Cursor PR-review automation (Terry)

Chat **cannot edit** Cursor Automations and **cannot set** this trigger from git. Terry must click it in the Untitled automation on cursor.com.

The existing automation **Untitled** must **not** fire on Pull request opened or pushed.

| | |
|---|---|
| Trigger | **Workflow run completed** |
| Workflow | `CI` |
| Filter | **success only** |
| Do | Review the diff against the linked ticket/plan. Submit **Approve** or **Request changes**. Nits go in the **review body only** — no inline threads for nits. |
| Do not | Merge, push, start before the four jobs above are success. Prompt must **no-op** if `unit tests` / `catalog tests` / `web tests` / `compose stack` are not all success. |
| Must not be a required GitHub check | `Cursor Automation: Untitled`, `automerge`, `auto-review approve merge` |

## Required GitHub checks

Branch protection / rulesets: required checks = **only** the four test job names (`unit tests`, `catalog tests`, `web tests`, `compose stack`). **Never** require `automerge`, `auto-review approve merge`, or `Cursor Automation: Untitled`.
