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
| `catalog` | `services/catalog/mvnw test` (Temurin 21, Testcontainers PostGIS) | Jenkins / GHA `catalog` |
| `stack` | `./scripts/dev test` with compose | Jenkins / GHA `stack` (`SKIP_JENKINS=1` in Actions) |

There is **no consumer UI CI**. Playwright waits on [[ops/tickets/WF-011]]. House: Java/Spring + Vite/React PWA per [`product/STACK.md`](../../product/STACK.md) — not Next.js.

## Local Jenkins

- Config: `ops/jenkins/casc/` (JCasC) + root `Jenkinsfile` — all in git.
- State: Docker volume `ops_jenkins` (survives restart; wipe with `down -v`).
- UI: http://127.0.0.1:8085 (`admin` / `admin` unless `.env` overrides).
- GitHub PR builds: set `JENKINS_GITHUB_TOKEN` in `.env`, recreate jenkins, scan `my-island` multibranch (polls; no public webhook).
- Automerge for remote PRs still waits on **GHA** greens ([[ops/tickets/WF-025]]) during dual-run.

## Agent rules

1. **Same commands locally, in Jenkins, and in Actions.** `./scripts/dev test` is the contract.
2. **Fast path first.** Vault/docs/script PRs must pass `not stack` without compose.
3. **Never `--no-verify`.** Never force-push `main`.
4. **No secrets in logs or notes.** Tokens only in `.env` / credential store.
5. **One ticket’s diff.**
6. **Pytest is the contract for the OS.** Vault files the loop depends on → `ops/tests/test_vault.py`.
7. **Markers.** `stack` = needs compose. Default tests must not need it.
8. **No chaos in required CI.**
9. **Do not restore legacy Jenkins** from `docs/automation/`.

## Branch and PR

- Branch: `wf/<id>-slug` or Cloud Agent `cursor/…`.
- Title: `<id>: <ticket title>`.
- Body: links `docs/ops/tickets/<id>.md` and `docs/ops/plans/<id>.md`.
- CI must be green before merge. Ready same-repo PRs are auto-approved and squash-merged by the GHA `automerge` job ([[ops/tickets/WF-025]]). Drafts and forks are skipped. Chat agents do not merge.

## Adding a check

1. File a `WF-*` ticket owned by **automation-expert**.
2. Implement in `Jenkinsfile` + `.github/workflows/ci.yml` + `./scripts/dev` if humans/agents must run it too.
3. Document the job in this note.
