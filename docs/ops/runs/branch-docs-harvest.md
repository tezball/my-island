---
id: branch-docs-harvest
ticket: ""
role: orchestrator
status: done
cssclasses:
  - run
---

# Run: fold unique branch docs into main

## What

Reviewed ~29 unmerged remote branches. Folded **information** into `main` company state; then delete branches for a clean slate.

## Kept (landed on this PR)

| Source | Landed as |
|---|---|
| Draft plan PRs (#55–62) | `docs/ops/plans/{PRD-000,PRD-002,PRD-003,PRD-009,PRD-010,E2E-001,WF-003}.md` (approved; LOOP-aligned) |
| MVP child tickets | `docs/ops/tickets/PRD-010` … `PRD-014` |
| `mvp-team.md` | `docs/ops/agents/mvp-team.md` (rules updated: main-first, prefer no human gate) |
| Plan session runs | `docs/ops/runs/*-plan.md` for those ids |

Ticket frontmatter: plans linked; `WF-003` / `PRD-009` have `gate: human`; `E2E-001` / `PRD-003` stay `ready` (vault freezes); others `plan` where a plan exists.

## Discarded on purpose (no fold)

| Branch content | Why |
|---|---|
| `docs/old/**`, screenshots, Designs HTML | Archaeology; tag `legacy-platform` / old booking app |
| `docs/automation/JENKINS.md`, TARGET_LOOP, etc. | Pre–house-stack; house CI is `ops/jenkins/` + [[ops/runbooks/JENKINS_LOCAL]] |
| Root `MVP.md` / `MVP_FEATURE_SET.md` / booking SEED_DATA | Contradicts signed directory MVP (`product/MVP.md`); booking/Stripe out of scope |
| `docs/domain/**` marketplace/booking | Explicitly stripped by vault tests; not the product |
| Halfdoor / Inis brand copy | Public brand stays **OPEN** |
| Mark-done / home-snapshot / already-squash-merged WF-024/025/031 tips | Already on `main` via squash; no unique SoR |

## Verify

- [ ] `python3 ops/scripts/board_sync.py`
- [ ] `python3 -m pytest ops/tests -q -m "not stack"`
- [ ] Remote feature branches deleted; draft PRs closed
