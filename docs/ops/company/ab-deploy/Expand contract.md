---
title: Expand contract
tags:
  - research
  - deploy
status: research
audience: cto
date: 2026-09-28
---

# Expand / contract

Constraint on every option in [[ops/company/ab-deploy/AB deploy]]. Not a deploy product, not a second tool, not a decision row.

[[product/STACK]] already says migrations are Flyway in the API, expand/contract only, and agents do not run ad-hoc DDL against shared environments. This note is what that sentence means on one VPS with one database while two catalog JVMs overlap.

## One database

`compose.yml` runs `ghcr.io/baosystems/postgis:17-3.5`. Init script `ops/observability/postgres-init-catalog.sql` creates database `catalog`. The catalog service uses `jdbc:postgresql://postgres:5432/catalog`. `compose.mock-prod.yml` does not publish Postgres on the host. Volume name on this project is `my-island_ops_pg`.

`spring.flyway.enabled: true`. There is no second datasource, no Flyway "out of order", no baseline property in `application.yml`. Migrations on `main` are `V1`–`V10` in `services/catalog/src/main/resources/db/migration/`. V1 is `CREATE EXTENSION postgis`. V8 creates `spring_session`. The process that starts runs Flyway before it can pass `/actuator/health/readiness`.

[[ops/company/ab-deploy/Startup pulse]] therefore sees a migration that has already committed or a process that will not go ready. It does not see a migration that is "applied only to slot B". Slots share `flyway_schema_history`.

The deploy script's special case — version `7` described like a user table → `compose down` and `docker volume rm my-island_ops_pg` — deletes that shared data. Current V7 is `V7__place_image.sql` (nullable columns on `place`). The wipe is a legacy hammer. Any overlap design treats it as forbidden.

## Overlap

B starts, takes the Flyway lock, migrates, then serves. A is still in Caddy until the reload.

| Migration | What A does while B has migrated |
|---|---|
| Add a nullable column or a new table (V6 provenance, V7 image columns) | Old code keeps working if it does not `SELECT` the new column by name. JDBC `SELECT *` would start returning it; the catalog's queries are explicit in Java, and a review still has to look. |
| Add a column `NOT NULL DEFAULT` (V10 `email_verified`) | PostgreSQL 11+ can store this as a metadata default. The `ALTER` still takes a lock. V10 also `UPDATE`s existing `app_user` rows inside the migration, so the lock is not only metadata. |
| Add a `UNIQUE` (V6 `lead_dedupe_key`) | Fails if existing rows collide. B never passes the pulse. A is unchanged only if the migration rolled back. |
| Drop or rename a column, or tighten a constraint the old code still writes | A throws on the next query. That is a contract step. It belongs in a later deploy, after no running SHA reads the old shape. |
| Change `spring_session` or serialized session attributes | Both JVMs read the same cookie table. A skew bricks logins for the overlap, not just new sign-ins. |

Two pools at the default maximum of 10 means the migration's lock has up to ten waiting backends from A plus B's own startup. Directory tables are small. The lock is still a stall, and the pulse will not attribute it to "deploy" rather than "the site is slow".

`SeedGuestRunner` and post-flip `import_leads.py` write during this window. They are expand-safe only while their SQL matches both the old and the new code, or they run only on B after A has stopped writing.

## What the options inherit

[[ops/company/ab-deploy/A and B ports]], [[ops/company/ab-deploy/Blue green compose]], [[ops/company/ab-deploy/Port redirect]], and a second app host with this same Postgres all migrate in place. [[ops/company/ab-deploy/Second host]] with a copied database forks history instead, which is worse.

[[ops/company/ab-deploy/Drain]] does not shrink the lock. It only stops new work from landing on A after Caddy has moved.

Rollback of the JVM without a matching contract migration is a Caddy reload back to A. That is safe when the migration was expand and A still runs. It is not safe when the migration dropped something A needs, and it is not automatic: Flyway will not undo V10 because the container changed.

The PWA caches `GET /api/v1/places`, `categories`, and `counties` (`StaleWhileRevalidate` in `web/vite.config.ts`). An expand that changes JSON the old shell cannot parse breaks phones the drain cannot see. Contract the JSON in a later SHA, after `autoUpdate` has had time to replace the shell.

No option in this folder removes the need for that discipline. The implement ticket for a flip should refuse a migration that is not expand, the same way the gate refuses a SHA that is not green `main`.
