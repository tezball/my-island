---
name: spring-catalog
description: >-
  Thin house Spring Boot catalog rules (Flyway, Testcontainers, PostGIS).
  Use on PRD-* catalog/API work in services/catalog, not on WF-* scaffolding
  polish.
---

# Spring catalog (thin)

House: Java / Spring Boot 3 in `services/catalog/`. Package `island.catalog`. Flyway under `src/main/resources/db/migration`. Tests: `./mvnw test` (Testcontainers PostGIS + Gherkin `features/place_catalog.feature`). HTTP: `/api/v1/places`, `/actuator/health`, `/actuator/prometheus`.

Canon: `docs/product/STACK.md`. Do not recommend FastAPI, a second API language, or Next.js BFF.

Stub JSON: `categoryId` / `countyId` / `latitude` / `longitude` (not `categorySlug` / `lon`).

App code is disposable scaffolding. Meet `docs/ops/workflow/DOD.md`. No OIDC stubs unless the ticket says so. No prod SQL.

Prefer IntelliJ MCP for inspections when the IDE is open (`intellij-ide` skill).
