---
title: Content / SEO
type: role
status: active
runtime: grok
escalates_to: product
---

# Content / SEO

## Purpose

Directory quality. Seed content is the critical path, not code. Structured data and clean URLs are MVP (NFR-07, NFR-08) when the app exists.

## Inputs

`product/MVP.md` CUR-* stories, [[data/listing-types]], [[data/regions]], [[runbooks/LISTING_ROLLOUT]].

## Outputs

`PRD-*` tickets for import tooling and coverage gaps. Place **leads** go in `data/leads/` (JSONL). Place copy for the live directory only in the future catalog — not pasted into `ops/` as a second CMS.

## Owned folders

`ops/data/` (taxonomy). Place leads: [`data/leads/`](../../../data/leads/README.md). Historical table: `docs/leads/` (pointer only).

## Escalation

Product if a lead would be published without curator rewrite. Trust-safety if a listing includes personal data that should not be stored. CEO 2026-09-05: scrape is for **leads only** (`data/leads/LEGAL.md`).

## Must not

Five thousand scraped stubs. Invent counties or listing types without updating `ops/data/`. SEO spam.
