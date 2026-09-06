---
title: Listing type / region rollout
type: runbook
---

# New listing type or region

Listing **types** and **counties** are data, not code enums. Canon: `product/MVP.md` §5. Reference tables: [[data/listing-types]], [[data/regions]].

## Listing type (e.g. add “hostel” later)

1. Product: is this in MVP (POI, experience, campsite, B&B) or an expansion? If expansion, do not sneak it into a directory ticket.
2. Update `ops/data/listing-types.md` in the same PR as the ticket that introduces it.
3. Content: seed examples, photos, facilities that apply.
4. Eng-backend: confirm category is stored as data. **If you find an enum, that is a bug.**
5. Eng-frontend: filters and map icons. Reuse the category field; do not fork the Explore page.
6. Host-onboarding: only if partners already claim listings (Chunk 1+).
7. SEO: URL slug rules stay in the plan, not as a one-off note.

## Region (county / island)

1. MVP geography is **Ireland, 32 counties**. Adding a county that already exists is a content ticket, not a schema ticket.
2. Coverage gaps: `PRD-*` for curator import, owned by [[roles/content-seo]]. Research collects unpublished leads in [`data/leads/`](../../data/leads/README.md) ([[tickets/PRD-006]]).
3. Outside Ireland: product must say yes. Default is no (`VISION.md` Ireland-only).
4. Update `ops/data/regions.md` if we add a jurisdiction (e.g. a later country). Do not list every town in the vault.

## Verify

- [ ] `ops/data/` matches the ticket
- [ ] No hardcoded category lists in new code (when code exists)
- [ ] Board ticket is `PRD-*`, not `WF-*`
