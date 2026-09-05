---
title: CI conventions
type: workflow
---

# CI-friendly conventions

Owner: [[agents/roles/automation-expert]]. Runtime today: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml). Policy: [[SAFETY]].

Agents must be able to **clone → test → PR** without a human laptop ritual.

## What CI proves (now)

| Job | Command | Why |
|---|---|---|
| `unit` | `python3 -m pytest ops/tests -q -m "not stack"` | Vault, tickets, board_sync, next_ticket — no Docker |
| `stack` | `./scripts/dev test` with compose | Ops runtime (Postgres/Grafana) still boots |

There is **no consumer app CI**. Do not add Playwright/Maven jobs until a `PRD-*` ticket in `implement` needs them. Do not keep red app jobs “for later”.

## Agent rules

1. **Same commands locally and in Actions.** `./scripts/dev test` is CI. Do not invent a third runner.
2. **Fast path first.** Vault/docs/script PRs must pass `not stack` without compose. Put slow jobs behind `stack`.
3. **Never `--no-verify`.** Never force-push `main`.
4. **No secrets in logs or notes.** CI has `contents: read` only. Do not add deploy keys on a `WF-*` ticket.
5. **One ticket’s diff.** Do not “while I’m here” rewrite workflows to support an app that will be replaced.
6. **Pytest is the contract for the OS.** If you add a vault file the loop depends on, add it to `ops/tests/test_vault.py`.
7. **Markers.** `stack` = needs compose. Default tests must not need it.

## Branch and PR

- Branch: `wf/<id>-slug` or Cloud Agent `cursor/…`.
- Title: `<id>: <ticket title>`.
- Body: links `ops/tickets/<id>.md` and `ops/plans/<id>.md`.
- CI must be green before a human merges. Agents do not merge.

## Adding a check

1. File a `WF-*` ticket owned by **automation-expert**.
2. Implement in `.github/workflows/ci.yml` + `./scripts/dev` if humans/agents must run it too.
3. Document the job in this note.
4. If the check is product-app, it belongs on a `PRD-*` ticket — and the app is still [[company/SCAFFOLDING|scaffolding]].

Jenkins research in `docs/automation/` is **not** the path. [[AUTOMATIONS]] are.
