---
id: WF-040
ticket: "[[ops/tickets/WF-040]]"
role: implementer
started: 2026-09-19
finished: 2026-09-19
pr:
cssclasses:
  - run
---

# Run WF-040

## What happened

Implementer: unattended mock-prod from green `main`. Jenkins `deploy-mock-prod` now cron-polls (`H/5`), gates on GHA `unit` + `catalog` + `web` + `stack` for `origin/main` (`gate_mock_prod_deploy.py`), ff-only pulls `main`, runs `deploy-mock-prod.sh`, then HTTP/API smoke (`smoke_mock_prod.py`). Feature branches refuse. Fail closed without `MOCK_PROD_*`. GHA `mock-prod-signal` on push to `main` is the visible green-main check — no GitHub `production` Environment. Agents never SSH. PIPELINE / runbooks updated. No PRD-012/013 / VisitIntent.

## Result

success

## Follow-up

Reviewer comments only. Do not `gh pr merge`. After merge, laptop Jenkins (key in `.env`) picks up `origin/main`.
