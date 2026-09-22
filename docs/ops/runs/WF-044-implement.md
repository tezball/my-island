---
id: WF-044
ticket: "[[ops/tickets/WF-044]]"
role: implementer
started: 2026-09-22
finished: 2026-09-22
pr:
cssclasses:
  - run
---

# Run WF-044 implement

## What happened

Dedicated GHA job `zap` and Jenkins stage `zap` start local compose and run `ops/scripts/zap_style_scan.py` against `http://127.0.0.1:8081`. The scan fails when `GET /api/v1/places` is not 200 or when anonymous `POST`/`PUT`/`PATCH`/`DELETE` is not 401 or 403. Automerge and mock-prod-signal `needs` include `zap`. The public host is not the target. Scanner stays out of `unit` and `catalog`.

## Result

success (PR open; chat does not merge)

## Follow-up

Jenkins `H/5` deploy-mock-prod after this SHA is on `origin/main`. Agents never SSH.
