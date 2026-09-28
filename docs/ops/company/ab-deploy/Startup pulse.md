---
title: Startup pulse
tags:
  - research
  - deploy
status: research
audience: cto
date: 2026-09-28
---

# Startup pulse

The check [[ops/company/ab-deploy/A and B ports]], [[ops/company/ab-deploy/Blue green compose]], and [[ops/company/ab-deploy/Port redirect]] run before a process is allowed to take customers. It is a mechanism, not a second deploy system. Index: [[ops/company/ab-deploy/AB deploy]].

> [!important] Idle port only
> Public `https://fishing-journals.com/actuator/info` is what `ops/scripts/gate_mock_prod_deploy.py` calls the live SHA. The pulse curls the process that is not in the Caddyfile yet. Publishing B's info on the apex early makes the next timer `SKIP` while customers are still on A.

## What already exists

The catalog image contains `curl`. The mock-prod healthcheck is:

`curl -sf http://127.0.0.1:8080/actuator/health/readiness`

Probes are enabled. With no custom health groups, readiness includes Boot's readiness state, the JDBC `db` indicator (`SELECT 1` through Hikari), and `services/catalog/src/main/java/island/catalog/health/PostgisHealthIndicator.java` (`select PostGIS_Version()`). Mail health is disabled, so `CATALOG_MAIL_MODE=log` does not fail the check. Details are `show-details: always`.

`/actuator/health` (no `/readiness`) is what `deploy-mock-prod.sh` greps for `"status":"UP"` on `127.0.0.1:18081`, and what `ops/scripts/smoke_mock_prod.py` checks on the public URL. Aggregate UP includes the same components once the process is accepting traffic.

Flyway runs before the web server is ready. `SeedGuestRunner` runs as an `ApplicationRunner` and blocks readiness until the guest upsert returns. A pulse that requires readiness UP has waited for both.

`ops/scripts/smoke_mock_prod.py` then does `GET /api/v1/places?published=true` and expects a JSON array. That is the synthetic traffic already in the house. It runs today only after Caddy is on the new container.

Nothing in `application.yml` configures Hikari. Boot's default maximum pool size is 10. Hikari fills `minimumIdle` (it defaults that to the maximum) in the background. The `db` health indicator borrows one connection. It does not report that all 10 are idle-open. `/actuator/prometheus` can show `hikaricp` meters, and the endpoint is exposed, but Caddy does not route `/actuator/prometheus`, and the my-island Prometheus service is profile `local-jenkins-only` on this overlay. The pulse can `docker exec` curl the prometheus endpoint on the idle container if a later ticket wants pool gauges. The deploy script does not do that today.

There is no one-shot startup `ApplicationRunner` whose only job is a synthetic request. Readiness plus the places GET is the one-shot, run by the Jenkins script, not by a second framework.

## The check, in order

Run this against the idle catalog, before [[ops/company/ab-deploy/Drain]] and before the Caddy reload:

1. Readiness HTTP 200 and JSON status `UP`. That is PostGIS, the catalog database, and "runners finished" (guest seed included).
2. `GET /api/v1/places?published=true` returns a JSON array. That is a real query through the pool, the same one smoke uses. It is a read. It does not write a VisitIntent.
3. Optional: scrape `hikaricp_connections` on the idle container's `/actuator/prometheus` and require the pool's active or idle count to be at least 1. That is the warmup signal actuator health does not spell out. It is still not proof that every statement the PWA uses is warm.
4. Record `app.gitCommit` from the idle `/actuator/info` and require it to equal the SHA the job just built. Do not read that from the public URL.

Then drain, reload Caddy, and let the existing public health, `check_deploy_info.py`, and smoke run. Those stay the proof that the apex moved.

A web pulse is the nginx healthcheck already in the overlay: `wget` of `http://127.0.0.1:80/`. The static container does not talk to Postgres. Its pulse is "the new files answer". It does not validate the baked `VITE_GOOGLE_CLIENT_ID` beyond "the image built".

## How the other options call it

| Option | Where the pulse runs |
|---|---|
| [[ops/company/ab-deploy/A and B ports]] | `docker exec` into the idle catalog, then the same for idle nginx |
| [[ops/company/ab-deploy/Blue green compose]] | Compose `--wait` on the idle project, plus the places GET the healthcheck does not perform |
| [[ops/company/ab-deploy/Port redirect]] | Same idle curl, before any nftables rule changes |
| [[ops/company/ab-deploy/Second host]] | Would be the same HTTP, across a network, at a host this lock does not have |

Caddy can also grow `health_uri /actuator/health/readiness` on `reverse_proxy`. That stops Caddy from sticking to a process that is listening and not ready. It is a backstop. It is a poor primary gate: the job would be watching Caddy's choice instead of a SHA it controls, and two healthy upstreams bring back the flapping info URL.

## Pros

- Uses checks the repo already ships: readiness, PostGIS SQL, places JSON, git SHA.
- Runs on the VPS over the SSH session the Jenkins job already opens. No new credential, no public Prometheus.
- A failed pulse leaves A in the Caddyfile. The public SHA is unchanged, so the next `H/5` tick can `DEPLOY` again.
- Guest seed and Flyway are inside the readiness window, so the pulse does not pass in front of them.

## Cons

- Readiness proves one JDBC borrow and `PostGIS_Version()`, not a warm pool of 10, not a spatial query plan, not Google token verification.
- The places GET is one published list. Empty directory and a broken map query can both be a JSON array of the wrong kind of "success" if the list happens to be empty. Smoke has the same limit.
- Tomcat listens before runners finish. Anything that proxies to B before readiness (shared alias, early Caddy line, published 18081 moved too soon) skips the pulse.
- The pulse cannot see whether A's still-running code tolerates the migration B just committed. That is [[ops/company/ab-deploy/Expand contract]].
- Adding a heavy synthetic (login, VisitIntent write, Gatling) turns the timer into the trickle/weekly perf jobs ([[ops/tickets/WF-042]], [[ops/tickets/WF-045]]). Those are separate Jenkins jobs on purpose. The pulse stays one read.

## What still breaks

Flyway failure fails the pulse, which is what we want: B never takes the apex, A keeps serving, and the job goes red. A migration that commits and is incompatible with A fails in the other direction: the pulse is green, A is already broken, and the drain is draining a process that cannot serve. The pulse does not roll back Flyway. There is no undo in this repo's migrations.

`import_leads.py` after the flip is more write traffic, not part of the pulse. Customers are on B while it runs, same as today.
