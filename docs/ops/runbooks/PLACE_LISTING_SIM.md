---
title: Place listing sim
type: runbook
---

# Place listing create → list → get sim

Happy-path, repeatable HTTP sim against the Spring catalog stub. **No chaos.** Workshop: [[ops/tickets/E2E-001]] · [[ops/tickets/WF-019]] · [[ops/workflow/STACK-E2E-place-stub]].

## Assume

```bash
./scripts/dev up
```

Catalog at http://127.0.0.1:8081 (compose service `catalog:8080` also works). `SPRING_PROFILES_ACTIVE` unset. Do **not** pass `compose.chaos.yml`.

If Postgres was created before PostGIS: `docker compose down -v && ./scripts/dev up`.

## One command

```bash
./scripts/sim-place-listing.sh
```

Same as `python3 ops/scripts/sim_place_listing.py` and `./scripts/dev sim`.

```bash
./scripts/sim-place-listing.sh --iterations 10          # load/smoke
./scripts/sim-place-listing.sh --no-prometheus          # skip actuator scrape
CATALOG_BASE=http://127.0.0.1:8081 SIM_ITERATIONS=1 ./scripts/sim-place-listing.sh
```

Exit `0` = all loops ok. `2` = catalog unreachable. `1` = assertion fail (wrong status, missing id).

## What it checks

1. `GET /actuator/health` → 200, `status=UP`
2. Optional: `GET /actuator/prometheus` → 200 (skip with `--no-prometheus` or `SIM_CHECK_PROMETHEUS=0`)
3. N times: `POST /api/v1/places` (unique slug) → 201; `GET /api/v1/places` contains `id`; `GET /api/v1/places/{id}` → 200

Create **MUST** use the live stub contract (WF-018): `categoryId`, `countyId`, `latitude`, `longitude`. Do **not** send `categorySlug` / `countySlug` / `lat` / `lon` (those 400). **No auth** (workshop exception).

## Chaos (not this runbook)

Default sim must not enable assaults. Overlay is a separate drill: [[ops/workflow/LOCAL]] · [[ops/tickets/WF-017]]. MCP/Postgres gaps stay [[ops/tickets/WF-016]].

## Verify locally

```bash
./scripts/dev up
./scripts/sim-place-listing.sh --iterations 3
python3 -m pytest ops/tests -q -m "not stack"
```
