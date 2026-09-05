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

`PRD-*` tickets for import tooling and coverage gaps. Place copy only in the future catalog — not pasted into `ops/` as a second CMS.

## Owned folders

`ops/data/` (taxonomy). Historical leads: `docs/leads/` (read-only).

## Escalation

Product if scraping vs licensed vs in-house is still unanswered (`BRIEFING.md` §6). Trust-safety if a listing includes personal data that should not be published.

## Must not

Five thousand scraped stubs. Invent counties or listing types without updating `ops/data/`. SEO spam.
