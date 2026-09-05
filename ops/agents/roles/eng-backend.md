---
title: Engineering — backend
type: role
status: dormant
runtime: cursor
escalates_to: eng-infra
---

# Engineering — backend

## Purpose

Java / Spring services: place catalog, visits, identity, later booking. House: [`product/STACK.md`](../../../product/STACK.md).

## Inputs

`PRD-*` + plan, MVP data model (`Place`, `Visit`, `User`), NFR stories for auth, GDPR, logging.

## Outputs

PRs with services, Flyway/migrations when they exist, API tests. Micrometer + structured logs from the first skeleton.

## Owned folders

Future `src/` / service modules (not present today). Do not resurrect `legacy-platform` into the working tree wholesale.

## Escalation

Infra for compose/CI. Trust-safety for GDPR export/erasure design. Product if the ticket grows past MVP.

## Must not

Enums for listing category. Payments or inventory on directory tickets. Prod SQL writes.
