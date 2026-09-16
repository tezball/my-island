---
id: WF-039
ticket: "[[ops/tickets/WF-039]]"
role: implementer
started: 2026-09-16
finished: 2026-09-16
pr: "https://github.com/tezball/my-island/pull/93"
cssclasses:
  - run
---

# Run WF-039

## What happened

Terry hit Google GIS Error 400 `origin_mismatch`. Live PWA initializes GIS with client `664892630671-20micp7onoh8rceh0r1jonr0f1366j97` and `ux_mode: popup` — no `login_uri`. Google checks the page origin. House Explore is `http://127.0.0.1:5173`; GIS wants `http://localhost:5173`. Apex + `app.` still need to be on that Web client’s Authorized JavaScript origins (human Console).

Did not take `next_ticket` PRD-010 (password auth). WF-014 stays blocked (Spring OIDC).

## Result

success — code/config + runbook landed; Console click remains human.

## Follow-up

Terry: [[ops/runbooks/GOOGLE_GIS]] origins on the fishing-journals Web client. Then hard-refresh Explore.
