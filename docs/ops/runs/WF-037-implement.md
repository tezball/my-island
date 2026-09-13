---
id: WF-037
ticket: "[[ops/tickets/WF-037]]"
role: implementer
started: 2026-09-13
finished: 2026-09-13
pr: https://github.com/tezball/my-island/pull/89
cssclasses:
  - run
---

# Run WF-037

## What happened

CEO: health 200 on mock-prod was a silent success while `/actuator/info` served the PWA. Caddy now proxies health **and** info. Catalog info JSON carries version + git SHA (baked into the image). `deploy-mock-prod.sh` fails unless public info matches `git rev-parse HEAD`.

## Result

success — [#89](https://github.com/tezball/my-island/pull/89) squash-merged to `main` (`fe90716`).

## Follow-up

Redeploy mock-prod / Jenkins `deploy-mock-prod` so live Caddy picks up the info handle and public `/actuator/info` SHA matches tip.
