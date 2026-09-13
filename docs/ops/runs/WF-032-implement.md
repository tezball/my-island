---
id: WF-032
ticket: "[[ops/tickets/WF-032]]"
role: implementer
started: 2026-09-13
finished: 2026-09-13
pr: https://github.com/tezball/my-island/pull/85
cssclasses:
  - run
---

# Run WF-032

## What happened

CEO asked to remove the fishing-journals test app, put my-island on the domain root, and reuse the Google GIS client with the same callback path (`POST /api/auth/google`). Implemented GIS on catalog, apex Caddy cutover, dump+stop of FJ app containers, seeded 101 POIs.

Live: https://fishing-journals.com/ — Explore OPEN, GIS button, 101 places. Health JSON UP. `/explore/` 308s to `/`.

## Result

success — awaiting PR review

## Follow-up

If GIS fails for some browsers, confirm JS origin `https://fishing-journals.com` on the Google Web client ( `app.` still serves the same app). FJ dump at `/opt/backups/fishing-journals-*.sql.gz`. Grafana kept.
