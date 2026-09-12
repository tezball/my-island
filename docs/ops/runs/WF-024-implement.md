---
id: WF-024
ticket: "[[ops/tickets/WF-024]]"
role: implementer
started: 2026-09-12
finished: 2026-09-12
pr: https://github.com/tezball/my-island/pull/63
---

# Run WF-024

## What happened

Implementer hat (eng-infra). CEO laptop: `./app start` failed to pull `postgis/postgis:17-3.5-alpine` (`no matching manifest for linux/arm64/v8`).

- Branched `cursor/wf-024-postgis-arm64-0095` from latest `main`.
- Filed [[ops/tickets/WF-024]] + [[ops/plans/WF-024]] (small plan; shipped with the implement PR).
- Compose + Testcontainers now use `ghcr.io/baosystems/postgis:17-3.5` (PostgreSQL 17 + PostGIS 3.5, linux/amd64 + linux/arm64). Official Hub tags stay amd64-only.
- Documented in [[ops/workflow/LOCAL]]. Recreate volumes if a Hub alpine volume already exists.

Repro on this amd64 Cloud Agent (cannot boot Apple Silicon, can pull the arm64 blob):

- `docker pull --platform linux/arm64 postgis/postgis:17-3.5-alpine` → same missing-manifest error.
- `docker pull --platform linux/arm64 ghcr.io/baosystems/postgis:17-3.5` → success.

## Result

success — PR #63. Vault unit 79 passed (`not stack`); stack pytest 83 passed; catalog `mvnw test` 17 tests BUILD SUCCESS; `./scripts/app test` OVERALL PASS. Postgres healthy on `ghcr.io/baosystems/postgis:17-3.5`; catalog health `postgis` 3.5.

## Follow-up

Human may merge. Reviewer comments only. If a laptop already ran Hub alpine PostGIS: `docker compose down -v && ./scripts/app start`.
