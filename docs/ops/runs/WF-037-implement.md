---
id: WF-037
ticket: "[[ops/tickets/WF-037]]"
role: implementer
started: 2026-09-13
finished:
pr:
cssclasses:
  - run
---

# Run WF-037

## What happened

CEO: health 200 on mock-prod was a silent success while `/actuator/info` served the PWA. Caddy now proxies health **and** info. Catalog info JSON carries version + git SHA (baked into the image). `deploy-mock-prod.sh` fails unless public info matches `git rev-parse HEAD`.

## Result

in progress — PR next.

## Follow-up

Redeploy after merge so live Caddy picks up the info handle; then Jenkins `deploy-mock-prod` is the gate.
