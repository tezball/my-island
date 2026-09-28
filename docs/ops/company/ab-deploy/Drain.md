---
title: Drain
tags:
  - research
  - deploy
status: research
audience: cto
date: 2026-09-28
---

# Drain

Confirm A is quiet, then let the switch happen. Index: [[ops/company/ab-deploy/AB deploy]]. The switch on this host is a Caddy reload ([[ops/company/ab-deploy/A and B ports]]), after [[ops/company/ab-deploy/Startup pulse]] on B.

> [!warning] What "quiet" can mean here
> Quiet HTTP means Caddy has finished the requests it already accepted for A. Quiet SQL means Postgres shows no active or idle-in-transaction backends from A's address. Quiet jobs means nothing, today, because catalog has no scheduler. Those are three different observations. No single actuator URL returns all three.

## What each layer can see

**Caddy** (`server-caddy-1`, config patched by `ops/deploy/caddy_apex.py`). The site blocks are `reverse_proxy` with no `health_uri`, no `lb_policy`, and no drain directive. `caddy reload` is already how the deploy script applies a Caddyfile. A reload keeps the process up and sends new connections through the new config. Requests already accepted on the old config finish if the old upstream is still there. The script never asks Caddy how many of those are left. The admin API is not mentioned in `caddy_apex.py`; this packet does not assume it is on or off. What we know is the job does not read it.

**Spring Boot catalog.** `application.yml` does not set `server.shutdown`. Boot 3.5's default is `immediate`. `docker stop` / Compose recreate sends SIGTERM, waits Docker's stop grace (10s unless the compose file says otherwise; this one does not), then SIGKILL. Immediate shutdown does not wait for Tomcat to finish the request. Setting `server.shutdown=graceful` and `spring.lifecycle.timeout-per-shutdown-phase` (Boot's default phase timeout is 30s, and it is unused while shutdown is immediate) would let in-flight HTTP complete up to that cap. That flag is an application change. This packet does not make it.

Graceful HTTP shutdown does not watch:

- SQL that has left the request thread
- Hikari connections sitting idle
- JDBC session rows (they are supposed to survive)
- Flyway (that already ran on B)
- the phone's Workbox cache

**Actuator.** Exposed: `health`, `info`, `prometheus`. Health is component status (`db`, `postgis`, readiness). Info is the build stamp. Prometheus has JVM and Hikari meters if something scrapes the idle or live container. None of those list "requests in flight" as a customer drain signal. There is no custom metric for open VisitIntent writes.

**Postgres.** One server, database `catalog`, user `ops`. `pg_stat_activity` shows backend `state` (`active`, `idle in transaction`, `idle`) and `client_addr`. The JDBC URL is `jdbc:postgresql://postgres:5432/catalog` with no `ApplicationName`, so the row does not say "catalog A". During overlap the two containers have two addresses on the Compose network. A drain query can wait until A's address has no `active` or `idle in transaction` session. Idle pool connections remain until the pool closes; they are not in-flight work. The deploy user can `docker exec` the existing `my-island-postgres-1`. That is the same SSH session as the rest of the job.

**Scheduled jobs.** `services/catalog` has no `@Scheduled` and no `@EnableScheduling`. There is nothing to drain. Boot does not await scheduled tasks on shutdown unless `spring.task.scheduling.shutdown.await-termination` is true, and that property is absent because the feature is absent. A later scheduler would be invisible to Caddy and to `/actuator/health`. The drain would have to learn it then (a table, or that shutdown flag). Inventing a job drain now would be theater.

**PWA.** Nginx has no open JDBC work. Draining `island-web` is "stop sending new HTML to this container". Browsers with `autoUpdate` and a `StaleWhileRevalidate` cache of places, categories, and counties are not on the VPS. The drain cannot see them.

## A drain that matches this job

After B's pulse is green and before `docker stop` of A:

1. Reload Caddy so new HTTP goes to B. Do this first. Draining A while Caddy still sends customers to A never converges.
2. For a bounded wait (well under the 90 minute job timeout, and short enough that `H/5` plus `disableConcurrentBuilds` does not stack a queue of deploys), poll `pg_stat_activity` for A's `client_addr` in `active` or `idle in transaction`.
3. If graceful shutdown gets turned on later, SIGTERM A at the start of this window so Tomcat stops accepting and finishes what it has, and let the phase timeout be the cap. Until that property exists, the wait only covers SQL that is already running; HTTP dies when the container stops.
4. Stop A. Idle Hikari sessions disappear with the process. Postgres aborts any transaction that was still open when the socket died.
5. Public smoke runs after this, as it does today.

The wait needs a ceiling. On timeout, stop A anyway and let smoke tell the truth. An unbounded drain holds the only deploy job (`disableConcurrentBuilds`) and the next green `main` sits in the Jenkins queue.

## Pros

- The expensive observation (in-flight SQL) is a query on the Postgres this deploy already `docker exec`s.
- With the reload first, new customers are on a process that passed the pulse while the old transactions finish or hit the cap.
- Sessions in `spring_session` are not "in flight". Leaving them alone is the correct drain. Logged-in guests survive.
- No scheduler means step "jobs" is an empty check the note can record, not a blocker.

## Cons

- Caddy, as configured in this repo, does not export a count the script reads. "No in-flight HTTP" is not something the current Caddyfile can answer. The honest substitute is "new HTTP goes to B, then A is stopped after the cap".
- Without `server.shutdown=graceful`, the HTTP half of the drain is a hope that requests finish inside Docker's stop grace. They often will not, because immediate shutdown does not try.
- `client_addr` works only while A and B are different containers. A force-recreate of the only container has no address left to query: the process is already gone. Drain is useless on [[ops/company/ab-deploy/Current cutover]]'s order of operations.
- `import_leads.py` and `SeedGuestRunner` create SQL on purpose during deploy. They must be attributed to B (or run before the flip, against B). If they run on A, the activity query waits on our own seed.
- Gatling trickle ([[ops/tickets/WF-045]]) may be hitting the apex during the window. After the reload it hits B, which is fine. During the cap it can still be the last requests on A. The drain does not pause trickle. Chaos and ZAP are merge CI and are not aimed at this host.

## What still breaks

A transaction that started on A and needs a row shape B's Flyway already changed can fail or block on the migration lock. Drain does not reorder Flyway. See [[ops/company/ab-deploy/Expand contract]].

Work the phone has not sent yet is invisible. A guest who taps Save during the stop still gets an error if that request was on A and shutdown was immediate.

Prometheus on the my-island project is not running on this VPS (profile `local-jenkins-only`). Leftover `server-prometheus-1`, if present, is restarted by the deploy script for the alert mute. It is not a drain signal unless a later observe ticket scrapes both slots. This packet does not assume that scrape exists.
