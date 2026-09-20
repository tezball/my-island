---
title: Booking-site program
type: product
status: active
owner: Product
created: 2026-09-19
cssclasses:
  - product
---

# Booking-site program (campsites + B&Bs)

Planner locks **2026-09-19** from the CEO brief (plan the rest of a Booking.com-like site). **Not a live consumer app.** Mock-prod is fishing-journals.com. There is **no GitHub production Environment**. House: [`STACK.md`](STACK.md). Epic [[ops/tickets/PRD-004]] is never implement — children [[ops/tickets/PRD-016]]–[[ops/tickets/PRD-029]] are.

This note does **not** rewrite [`SIGNED.md`](SIGNED.md) or [`MVP.md`](MVP.md). Directory + VisitIntent remain the public slice until those children are promoted. [`EXPANSION.md`](EXPANSION.md) gates (return rate, unsolicited claims, enquiry-before-booking) are **waived for mock-prod planning only**.

## What already exists

| Surface | Status | Tickets |
|---|---|---|
| Spring catalog + PostGIS + Flyway | done | [[ops/tickets/PRD-001]] |
| 101 published **POI** Places, 32 counties, OSM map, Place detail | done | [[ops/tickets/PRD-002]] · [[ops/tickets/PRD-003]] · [[ops/tickets/PRD-011]] |
| Guest auth (password **and** Google SSO) | implement | [[ops/tickets/PRD-010]] |
| **VisitIntent** `been` / `want` / `never` (private lists; public **been** count only) | **done** (#97 on `main`; `/lists` is list-only) | [[ops/tickets/PRD-015]] |
| Been/want on **map or list** | implement | [[ops/tickets/PRD-030]] |
| One-tap CHK / My Places | **blocked** — wrong shape; leave them | [[ops/tickets/PRD-012]] · [[ops/tickets/PRD-013]] |
| Public Place writes | closed (seed/import only) | [[ops/tickets/WF-046]] |
| Stream-1 mock-prod / MCP / chaos / ZAP / Gatling | in flight P0 | [[ops/tickets/WF-040]]–[[ops/tickets/WF-046]] |

Kind already exists on Place: `poi`, `experience`, `campsite`, `bnb`. Explore shows **`poi` only**. Booking work publishes `campsite` / `bnb` as **Stays**, not by turning POI Explore into a hotel site.

## Sequence (do not starve WF-*)

Children stay **`inbox`** (Upcoming) with **approved plans**. `next_ticket.py --role auto` prefers any `ready` story over in-flight `implement` P0s — so these must **not** be `ready` or `implement` until VisitIntent/auth/stream-1 are no longer the pick.

**Promote only [[ops/tickets/PRD-016]] first** (`inbox` → `ready` → `implement`). Later tickets wait on the deps in the table.

| # | Ticket | Lane | Depends on | Status now |
|---|---|---|---|---|
| 1 | [[ops/tickets/PRD-016]] Stay inventory + mock seed | Data | Soft: PRD-015 on `main`; WF-046 lock | inbox |
| 2 | [[ops/tickets/PRD-017]] Guest search + listing | Guest | PRD-016 | inbox |
| 3 | [[ops/tickets/PRD-028]] Help + policies | Support | PRD-016 (parallel with 017) | inbox |
| 4 | [[ops/tickets/PRD-018]] Book + mock pay | Guest | PRD-017, PRD-010 | inbox |
| 5 | [[ops/tickets/PRD-019]] Trips + cancel/refund | Guest | PRD-018 | inbox |
| 6 | [[ops/tickets/PRD-020]] Host identity + onboard | Host | PRD-016, PRD-010 | inbox |
| 7 | [[ops/tickets/PRD-021]] Calendar / availability / pricing | Host | PRD-020 | inbox |
| 8 | [[ops/tickets/PRD-022]] Host reservations | Host | PRD-018, PRD-021 | inbox |
| 9 | [[ops/tickets/PRD-023]] Guest–host messages | Guest/Host | PRD-018 | inbox |
| 10 | [[ops/tickets/PRD-024]] Reviews after checkout | Guest | PRD-019 | inbox |
| 11 | [[ops/tickets/PRD-025]] Host payouts (mock) | Host | PRD-018 | inbox |
| 12 | [[ops/tickets/PRD-026]] Admin moderation / users / catalog | Admin | PRD-016, PRD-020 | inbox |
| 13 | [[ops/tickets/PRD-027]] Admin disputes / refunds | Admin | PRD-019, PRD-026 | inbox |
| 14 | [[ops/tickets/PRD-029]] Support inbox | Support | PRD-026, PRD-028 | inbox |

After 016, **guest browse (017)** and **host onboard (020)** and **help (028)** may run in parallel. Checkout (018) should not start without 017. Host calendar (021) should not start without 020.

## Self-closed locks (no `gate: human`)

| Topic | Lock |
|---|---|
| Geography | Ireland only (32 counties). No second country. |
| Bookable kinds | **Campsites and B&Bs only.** POI + experience stay VisitIntent/directory. |
| Seed | ≥1 mock campsite + ≥1 mock B&B **per county**. Looks real to Guests; `mock=true` for admin. **Do not replace 101 POIs.** No Booking.com scrape. |
| Stack | One Spring catalog API. Vite + React TS PWA. Postgres 17 + PostGIS, Flyway. Grafana OSS. Jenkins compose + GHA. **No Next.js BFF, no FastAPI, no Neon, no Datadog SoR.** |
| Identity | Guest = PRD-010 (password + GIS). **Host** and **Admin** are roles on the same account. Seed Host + Admin in env, never `docs/`. |
| Payments | **Mock PSP inside catalog** (authorize / capture / refund). EUR. **10% platform fee** in the breakdown. No live keys on mock-prod. Stripe-shaped port for a later adapter — not a second service. |
| Book mode | Seed Stays **instant-book**. Host-created default **request-to-book**. Skip standalone enquiry chunk; request-to-book is the analogue. |
| Cancel | flexible / moderate / strict (see PRD-019 plan). Refund via mock PSP. |
| Host writes | Authenticated `/api/v1/host/…` drafts only. **Public Place POST stays closed** (WF-046). Admin publishes (PRD-026). |
| Claim flow | **Skipped.** Hosts create Stays; they do not claim POIs. |
| Payouts | Internal ledger + mock weekly batch. No bank / Connect. |
| Reviews | After checkout only; display name; Host one reply; flag to admin. |
| Messages | Thread per Booking (not a feed). Support tickets are a different object. |
| Monetisation | No Host subscription product (Chunk 7). Fee on bookings is enough for mock-prod. |
| Out | iCal, OTA sync, dynamic pricing, staff seats, experience ticketing, native apps, second country, brand lock (StayÉire / Éirelist still OPEN). |
| Photos | Wikimedia / clearly licensed placeholders + attribution. Same bar as POI. |
| Mail | Mailpit locally; mock-prod log/no-op. |
| Deploy | `main` → Jenkins. Agents never SSH. Chat never `gh pr merge`. |

**Not locked (do not block tickets):** public brand name; real Stripe later; OIDC redirect (WF-014).

## Domain language

Keep **Place**, **County**, **Guest**, **VisitIntent**. Add:

| Term | Meaning |
|---|---|
| **Stay** | Bookable Place of kind `campsite` or `bnb` |
| **Unit** | Room or pitch on a Stay |
| **Host** | Role that manages Stays |
| **Booking** | Reservation of a Unit for a date range |
| **Trip** | Guest view of their Bookings |
| **Payout** | Mock transfer of Host net |
| **SupportTicket** | Help request to Admin (not a Host thread) |

## House / safety

Local compose is the runtime. fishing-journals.com is mock-prod. No production Environment. Do not implement product code until a child is `implement`. Do not implement from `docs/leads/` or tag `legacy-platform`.
