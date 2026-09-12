---
id: WF-025
ticket: "[[ops/tickets/WF-025]]"
role: implementer
started: 2026-09-12
finished: 2026-09-12
pr:
---

# Run WF-025

## What happened

Implementer hat (automation-expert). Terry: no prod (probably never); relax; remember it; ready PRs auto-review/approve/merge.

- Branched `cursor/wf-025-no-prod-automerge-0095` from `origin/main` (WF-024 id kept for the Apple Silicon PostGIS PR).
- Signed [[ops/company/DECISIONS]] 2026-09-12. Always-applied `.cursor/rules/no-prod.mdc`.
- SAFETY / LOOP / CI / charter / skills / hooks: chat agents still do not merge; Actions squash-merges non-draft same-repo PRs after unit+catalog+stack. Drafts and forks skipped. No `compose.prod`.
- CI job `automerge` on `.github/workflows/ci.yml`.

## Result

success — vault `not stack` 79 passed. Waiting on CI to self-merge this PR.

## Follow-up

Draft PRs stay draft. [[ops/tickets/WF-003]] Cursor Automations UI is still human-enable, and still does not merge.
