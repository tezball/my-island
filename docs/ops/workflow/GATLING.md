---
title: Gatling paths
type: workflow
owner: eng-infra
---

# Gatling paths

Two customer simulations share one walk. Keep the jobs separate.

| Command / job | Simulation | Users | When | URL |
|---|---|---|---|---|
| `./scripts/dev traffic` · Jenkins `gatling-trickle` cron `H/15` | `GuestTrickleSimulation` | 10 (`pulse-001`..`pulse-010`) | one walk, not a hold | public site |
| `./scripts/dev pulse` · Jenkins `gatling-pulse` | `GuestPulseSimulation` | 100 (`pulse-001`..`pulse-100`) | held 10 minutes, think time on | local catalog unless the job sets `https://fishing-journals.com` |

`gatling-trickle` stays the scheduled deploy check. Success bar is 100%. It is not downstream of anything new.

`gatling-pulse` is on demand: no cron, no upstream project. Someone starts it. The job sets `GATLING_BASE_URL=https://fishing-journals.com`, holds 100 users for 10 minutes, and archives the Gatling HTML report (`gatling-report/**`). A red ball does not change cutover. `./scripts/dev pulse` still defaults to `http://127.0.0.1:8081`.

Login password for every pulse user is the test password `guest` (Flyway `V11__gatling_pulse_seed.sql`, house BCrypt). Cohorts: new, a short step, moderate, heavy. Visits attach to places already in the catalog. The seed writes `visited`, `next`, and `saved`. `V12__visit_mark_words.sql` moves any older been, want, or never rows, including rows this seed already inserted. The walk sends `{"mark":"next"}`. The seed does not insert places and does not wipe a volume.

This note does not choose an A/B cutover and does not change `scripts/deploy-mock-prod.sh`. Neither job is merge CI.

## When a feature ships

Add one named chain on `GuestFeatureChains` and call it from `walkOnce()`, with the same think time. Both simulations pick the walk up. Do not scan controllers. Do not point the `H/15` trickle at 100 users or at a 10-minute hold. Do not give `gatling-pulse` a cron or a deploy trigger. Do not weaken merge CI.

Chains now: health, list published places, get place, counties, categories, password login, `/api/v1/me`, save visit intent, get visit intent, list visit intents, logout.

Signup, verify, forgot, reset, and Google stay off this walk. Place create stays import-only.
