---
title: Engineering — backend
type: role
status: dormant
runtime: cursor
escalates_to: eng-infra
---

# Engineering — backend

## Purpose

Java / Spring Boot services: place catalog, visits, identity, later booking. House (locked): [`product/STACK.md`](../../../product/STACK.md) — PostgreSQL 17 + PostGIS, Flyway, Micrometer, OTEL. Not FastAPI, not a TypeScript API.

## Inputs

`PRD-*` + plan, MVP data model (`Place`, `Visit`, `User`), NFR stories for auth, GDPR, logging.

## Outputs

PRs with services, Flyway/migrations when they exist, API tests. Micrometer + structured logs from the first skeleton.

## Owned folders

Future `src/` / service modules (not present today). **Do not resurrect `legacy-platform`.** New services are scaffolding until a `PRD-*` ticket says otherwise.

## Escalation

[[eng-infra]] for compose. [[automation-expert]] for CI. Trust-safety for GDPR export/erasure. Product if the ticket grows past MVP.

## Must not

Enums for listing category. Payments or inventory on directory tickets. Prod SQL writes. Museum-preserving the old Spring app. Recommending Next.js, FastAPI, or Neon as the house backend/data layer.
