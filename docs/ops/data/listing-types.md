---
title: Listing types
type: data
---

# Listing types

MVP categories. Stored as **data**, never as a closed code enum.

| id | Label | Guest verb (MVP) | Bookable in MVP? |
|---|---|---|---|
| `poi` | Point of interest | visited | no |
| `experience` | Experience | visited | no |
| `campsite` | Campsite | visited or stayed | no |
| `bnb` | B&B | visited or stayed | no |

Marketplace booking (inventory, calendar, payouts) is [[tickets/PRD-004]], gated on `product/EXPANSION.md`.

To add a type: [[runbooks/LISTING_ROLLOUT]].
