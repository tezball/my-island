---
title: Blue-green compose
tags:
  - research
  - deploy
status: research
audience: cto
date: 2026-09-28
---

# Blue-green compose

Two Compose projects on the same VPS, one Postgres, Caddy still in front. Index: [[ops/company/ab-deploy/AB deploy]]. The lighter version of this idea is [[ops/company/ab-deploy/A and B ports]].

## How it works on this host

Today there is one project. `compose.mock-prod.yml` sets `name: my-island`. Container names, the volume `my-island_ops_pg`, and the default network all hang off that name. `docker compose up -d --force-recreate catalog web` replaces app containers inside that project and leaves `postgres` running.

A second project (`my-island-b`, or whatever the implement ticket calls it) would build the same compose files with a different project name and start only `catalog` and `web`. Caddy would reload from `island-catalog` on the blue network alias to the green one, same as [[ops/company/ab-deploy/A and B ports]]. The customer switch is still `caddy reload`, not a second load balancer.

What the second project must not do:

- Start its own Postgres. That is a second database (sessions, places, Flyway history). Decision 39 is one machine and this product has one database on it.
- Attach both projects as alias `island-catalog` / `island-web` on `server_default`. Docker DNS would hand Caddy either container. Public `app.gitCommit` would flap and `ops/scripts/gate_mock_prod_deploy.py` would lie.
- Bind `18081` twice. The overlay pins `18081:8080` for the deploy script and `import_leads.py`.
- Run the script's `compose down` + `docker volume rm my-island_ops_pg` path. That deletes the shared data directory.

The idle project has to reach the live Postgres. Postgres is on the project network `my-island_default`, not on `server_default`. A second project gets its own default network and the hostname `postgres` does not resolve there. The idle catalog has to join the existing project network (external) or talk to a stable DNS name / IP published only on that network. `compose.mock-prod.yml` already adds `server_default` for Caddy. It does not export the database network for a sibling project.

`docker compose build` on the VPS while the live project serves is the same CPU hit as today. `--wait` on the idle project can block Jenkins until that project's healthcheck passes. The live project's containers stay up through that wait. That is the actual improvement over today's `--force-recreate`.

## Pulse and drain

[[ops/company/ab-deploy/Startup pulse]] is the idle project's healthcheck plus a places GET to that project's port: `curl` inside the container, or a free loopback port. Compose `--wait` already understands the catalog healthcheck (`/actuator/health/readiness`). It does not run the synthetic places GET, and it does not know about Caddy.

[[ops/company/ab-deploy/Drain]] runs against the live project before `compose stop catalog web` on that project. Stopping the live project first, which is what a naive "green replaces blue" script does, is today's outage with extra steps.

Public smoke stays after the Caddy reload. The gate's info URL must keep reading the live project until then.

## Pros

- Idle and live are separate Compose labels, so `docker compose ps` shows which SHA is which.
- The live project is untouched while the idle one builds, migrates, and waits. That matches `--wait` the script already passes (`--wait-timeout 900`).
- Rollback is a Caddy reload back to the previous alias, until the previous project is removed. JDBC sessions survive because the volume was not swapped.
- Jenkins can still be one unattended job. No new host, no new key.

## Cons

- `name: my-island` is in the overlay the script always passes. A second project means an extra `-p` (and a check that Compose actually honors it over the file's `name`) on every command, including the V7 probe that `docker exec`s `my-island-postgres-1`.
- Two projects, two default networks, one database hostname. Getting that wrong fails the pulse with a connection error, or, worse, starts a second Postgres if the idle project is allowed to `up` the `postgres` service.
- Aliases, host port 18081, and the rsync of a single `/opt/my-island` tree are all one-project assumptions. Two directories or two checkouts on a small VPS duplicate the build context the rsync just copied.
- Image build and two JREs still share the customer machine. Compose does not add isolation.
- The job must remember the live project name between timer ticks. A clean `reset --hard` of the Jenkins deploy clone does not remember it. State lives on the VPS, outside the rsync `--delete` tree, or the script reconstructs it from which alias Caddy currently names.
- `disableConcurrentBuilds` still serializes deploys. A stuck green project holds the 90 minute timeout like a stuck single project does.

## What still breaks

Same Flyway, same `catalog` database, same [[ops/company/ab-deploy/Expand contract]] rule. The idle project migrates on startup. The live JVM keeps serving the new schema. Expand-only is the overlap. The volume-wipe branch is fatal here because both colors share `my-island_ops_pg`.

`pg_isready` on the Postgres container checks database `ops`, not `catalog`, and does not run `PostGIS_Version()`. Only the catalog readiness check does. A green project's "postgres healthy" is not the pulse.

Rollback via Caddy assumes the previous JVM is still running and its schema expectations still match. After an expand migration, the old JVM is the one that must tolerate new columns. After anything that dropped or renamed a column, rollback is a second migration problem, not a reload.
