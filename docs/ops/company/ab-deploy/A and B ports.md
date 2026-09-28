---
title: A and B ports
tags:
  - research
  - deploy
status: research
audience: cto
date: 2026-09-28
---

# A and B ports

Two catalog processes, and a matching pair for the PWA, on the one VPS. Caddy stays the switch. Index: [[ops/company/ab-deploy/AB deploy]]. Today: [[ops/company/ab-deploy/Current cutover]].

## How it works on this host

Customer traffic never uses the catalog's host port. `ops/deploy/caddy_apex.py` sends the apex (and `app.`) to Docker DNS:

- `/api/v1*`, `/api/auth*`, `/actuator/health`, `/actuator/info` → `island-catalog:8080`
- everything else → `island-web:80`

`server-caddy-1` is already reloaded by `scripts/deploy-mock-prod.sh`. A reload keeps Caddy up. New requests use the new upstream. That is the flip.

The idle slot must not be named `island-catalog` or `island-web`. Both containers sharing the alias makes Docker DNS answer with either address, and public `/actuator/info` flaps. `ops/scripts/gate_mock_prod_deploy.py` would then `SKIP` or `DEPLOY` against whichever SHA it sampled. One live upstream, changed in one reload, keeps a single public SHA.

Shape that fits the current files:

- One Compose project (`name: my-island`) so both JVMs share the project network and the hostname `postgres`.
- Catalog A and catalog B, same image build args (`GIT_COMMIT` and the rest), same env as today's `catalog` service (`APP_ENV=mock-prod`, guest seed, Google client, secure session cookie).
- Distinct aliases, for example `island-catalog-a` and `island-catalog-b`. Caddy names the live one. Same for `island-web-a` / `island-web-b`, because the PWA and the API have to move together. `VITE_GOOGLE_CLIENT_ID` is baked into the web image at build.
- Host port `18081:8080` can bind once. Today's script curls it for health and for `import_leads.py`. The idle slot is reached with `docker exec` and the `curl` already installed in the catalog image, or with a second loopback port. Do not publish the idle catalog on a public interface as a second copy of 18081.
- Postgres stays the current service. No second database. Do not `--force-recreate` it. Do not take the V7 `docker volume rm my-island_ops_pg` branch.
- Build still happens on the VPS (`docker compose build`) while A is serving, which is already true. Peak RAM is that build plus A plus B until A stops.

Jenkins stays the same job: gate, clean `origin/main`, script, public smoke. The script's order changes from "reload Caddy, then destroy the only container" to "start B, pulse, drain, reload Caddy, stop A, smoke". `disableConcurrentBuilds` and the 90 minute timeout still wrap it. The public smoke stays after the reload, because that is when `app.gitCommit` is allowed to change.

## Pulse and drain

Call [[ops/company/ab-deploy/Startup pulse]] on B before the reload. The pulse hits B's port only: readiness (datasource + `PostGIS_Version()`), then the same places GET the smoke already uses.

Call [[ops/company/ab-deploy/Drain]] on A after the pulse and before `docker stop` of A. Caddy reload moves new requests immediately; the drain is how long A stays alive for requests already inside it. Cap the wait. The cron is `H/5` and the job cannot overlap itself.

`import_leads.py` today targets `:18081` after the public site is up. Under A/B it has to target the slot that is about to be live (or the one Caddy just switched to), or it writes through the process that is about to die.

## Pros

- Uses the reverse proxy, the Docker network, and the `caddy reload` the deploy script already runs.
- One Compose network reaches `postgres:5432`. No second project, no external-network puzzle for the database.
- Public actuator info stays on one SHA, so the existing gate and `ops/scripts/check_deploy_info.py` still mean "what customers hit".
- JDBC sessions (`spring_session`) are in the shared database, so a login cookie works on B after the flip when the serialized attributes still match.
- The old JVM remains the customer path until B's pulse passes. A bad Flyway or a down PostGIS check never becomes the apex.

## Cons

- Two Temurin 21 JREs on the customer VPS for the overlap, on top of a Maven image build that already runs there.
- Two Hikari pools at Boot's default maximum of 10. Nothing in `application.yml` names the connections. Twenty backends against one Postgres is fine at directory size; it is still twenty, plus `import_leads` and the guest upsert.
- `SeedGuestRunner` writes the guest row on B's startup while A is serving. The upsert is idempotent. It is still a write during overlap.
- Web and catalog are separate upstreams. One reload must list both, or phones load new JS against the old API (or the reverse) for one config generation.
- Workbox on the phone (`StaleWhileRevalidate` for places, categories, counties, `autoUpdate`) is outside Caddy. The flip does not clear it.
- Someone has to pick which slot is A next time and persist that on the VPS. The git tree rsyncs with `--delete`; slot state does not belong only in the rsynced working tree unless the script recreates it every run.
- Host port 18081, the seed URL, and the loopback health curl in `deploy-mock-prod.sh` are written for one container. An implement ticket edits that script. This note does not.

## What still breaks

Flyway on the one `catalog` database runs when B starts, while A is serving. See [[ops/company/ab-deploy/Expand contract]]. An expand migration can take `AccessExclusiveLock` long enough to stall A's queries on that table. A contract migration, or a failed UNIQUE add, either breaks A or stops B from ever passing the pulse. The V7 volume wipe removes the database the overlap depends on.

Immediate shutdown is still the Boot default. Without a drain cap and `server.shutdown=graceful` (not set today), stopping A drops its in-flight HTTP. The drain note says what that flag would and would not cover.

There is no scheduled-job table to empty. The next `@Scheduled` added to catalog is invisible to Caddy until someone teaches the drain about it.

A PWA that still has the old shell can call an API B has already expanded. Expand/contract covers that JSON too, not only columns.
