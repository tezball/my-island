---
id: WF-049
ticket: "[[ops/tickets/WF-049]]"
role: implementer
started: 2026-09-20
finished: 2026-09-20
pr:
cssclasses:
  - run
---

# Run WF-049 implement

## What happened

Triggered host Jenkins `deploy-mock-prod` from loopback (Lock C). Catalog on fishing-journals.com is `195422c` (`/actuator/info` matches `origin/main`). Smoke: health UP, 103 published places, `/api/auth/login` 401 (exists).

Controller image had no `python3`, so the job's info gate failed after the VPS was already live. Dockerfile now installs `python3`. `scripts/dev` seed prefers `http://catalog:8080` when Jenkins is on the compose network (loopback `:8081` is not catalog inside the controller). Local Flyway V7 checksum mismatch was a laptop volume (`user_auth` vs `place_image`); catalog DB recreated. Agents never SSH.

## Result

success (PR open; chat does not merge)

## Follow-up

Rebuild Jenkins image so python3 survives recreate. Rebuild `my-island » main` so stack seed uses compose DNS.
