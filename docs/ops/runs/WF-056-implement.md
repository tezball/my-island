---
id: WF-056
ticket: "[[ops/tickets/WF-056]]"
role: implementer
started: 2026-09-28
finished: 2026-09-28
pr: https://github.com/tezball/my-island/pull/142
cssclasses:
  - run
---

# Run WF-056

## What happened

On-demand Jenkins job `gatling-pulse` holds 100 seeded users for 10 minutes against https://fishing-journals.com and archives the Gatling HTML report. No cron and no deploy upstream. `gatling-trickle` stays `H/15` with ten of those users and one walk. Flyway `V11__gatling_pulse_seed.sql` seeds the accounts. The pulse was not started and was not run against the public site.

## Result

success

## Follow-up

Terry starts `gatling-pulse` after this is on `main`. JCasC picks the job up on the next Jenkins reload. Chat does not click Build and does not merge.
