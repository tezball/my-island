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
| `supplier` | Local supplier (farm shop or other small business) | visited | no |

`supplier` is in the free directory ([`product/FREE-DIRECTORY.md`](../../product/FREE-DIRECTORY.md), [[ops/tickets/PRD-032]]). Bookable stays no. Checkout is [[ops/tickets/PRD-004]] and stays inbox — do not promote it ahead of the free directory.

To add a type: [[ops/runbooks/LISTING_ROLLOUT]].
