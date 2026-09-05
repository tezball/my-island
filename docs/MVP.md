---
title: MVP — The Checkable Directory
type: product
status: draft
created: 2026-09-01
tags:
  - product
  - mvp
  - scope
---

# MVP — The Checkable Directory

> **History only (CEO 2026-09-05).** This is the previous-company / parallel
> reboot MVP. **Do not implement from it.** Canonical Release 1 is
> [`product/MVP.md`](../product/MVP.md). House stack is
> [`product/STACK.md`](../product/STACK.md). This folder is archaeology.

> **One sentence:** a browsable directory of places to stay and visit in Ireland, where a signed-in
> user can tick off everywhere they have **been** or **stayed**, and see it all on their own map.
>
> Full backlog: `docs/USER_STORIES.md`. Later phases: §15 of that document.

## 1. Why this is the MVP

The previous slice in `docs/USER_STORIES.md` called itself an MVP and contained roughly 285 Must
stories — full Stripe booking, payouts, subscriptions, partner portals and AI moderation. That is
not an MVP, it is a year of work betting everything on an untested assumption.

This MVP tests the one assumption the whole product rests on:

> **Will people bother to record where they have been?**

If they will, the travel record is a retention engine and an organic acquisition channel that no
generic booking site has, and every later phase has something to attach to. If they will not, then
the product is a worse Booking.com, and it is far better to learn that in six weeks than in a year.

Everything transactional is deferred. Deliberately.

## 2. The loop

```
browse the directory  →  sign up  →  tick "been" / "stayed"  →  see your list & map  →  come back
```

Three screens carry the product: **directory**, **entry**, **my places**.

## 3. In scope

### 3.1 Directory — browse & find

| Story | |
|---|---|
| `VIS-DSC-002` | Browse without dates |
| `VIS-DSC-003` | Filter by category — stay / experience / supplier / place |
| `VIS-DSC-004` | Filter stays by type |
| `VIS-DSC-005` | Filter by county and town |
| `VIS-DSC-011` | Free-text search over names, places, amenities |
| `VIS-DSC-013` | Destination autocomplete |
| `VIS-DSC-014` | Near me |
| `VIS-DSC-015` | Result count and filter chips |
| `VIS-DSC-016` | Clear all filters |
| `VIS-DSC-018` | Paging without losing scroll position |
| `VIS-DSC-020` | Pet friendly filter |
| `VIS-DSC-022` | Filter hikes by difficulty and distance |
| `VIS-DSC-023` | Seasonal/closed entries marked, not hidden |

**Modified for MVP:** `VIS-DSC-009` sort — relevance, name, distance only. No price or rating sort:
there are no prices and no reviews yet.

### 3.2 Map

`VIS-MAP-001` · `VIS-MAP-002` · `VIS-MAP-003` · `VIS-MAP-005` · `VIS-MAP-010`

**Modified:** `VIS-MAP-004` pin card shows photo, name and category — **not** price or rating.

### 3.3 Entry pages

| Story | |
|---|---|
| `VIS-LST-001` | Photos, description, location map, facilities |
| `VIS-LST-015` | Share by link |
| `VIS-LST-016` | Rich link previews and structured data |
| `VIS-LST-017` | Report an inaccurate entry |
| `VIS-LST-018` | Nearby alternatives |
| `VIS-LST-020` | Fast on a poor rural connection |
| `VIS-PLC-001` | Hikes with distance, ascent, difficulty, time |
| `VIS-PLC-004` | Landmarks, beaches, waterfalls, castles, viewpoints |
| `VIS-PLC-006` | Which stays are near a given hike |
| `VIS-PLC-007` | Practical detail — parking, toilets, dogs, season |
| `VIS-PLC-009` | Trail closures and diversions |
| `VIS-PLC-010` | Trail accessibility notes |

**Modified:** `VIS-LST-013` shows a **directory** verification state (curator-checked / partner-confirmed
/ unverified), not a booking trust badge.

Entries display an **indicative price band** (`€`–`€€€€`) or nothing at all — never a bookable rate.

### 3.4 Accounts

`VIS-CNV-001` · `VIS-CNV-002` · `VIS-CNV-003` · `VIS-CNV-005`
`TRV-ACC-001` · `TRV-ACC-002` · `TRV-ACC-003` · `TRV-ACC-004` · `TRV-ACC-007`
`TRV-ACC-015` · `TRV-ACC-016` · `TRV-ACC-017` · `TRV-ACC-018`

Data export and deletion are in from day one — they are far cheaper to build now than to retrofit,
and GDPR does not wait for product-market fit.

### 3.5 Check-off — the core interaction

| Story | |
|---|---|
| `TRV-JRN-002` | Manually mark a place as visited |
| `TRV-JRN-021` | **Distinguish "been there" from "stayed there"** |
| `TRV-JRN-022` | One-tap check-off from list, map pin or entry page |
| `TRV-JRN-023` | Record when — exact date, month, or year only |
| `TRV-JRN-024` | Un-check or edit |
| `TRV-JRN-025` | Bulk check-off from a list |
| `TRV-JRN-026` | Check off a place not in the directory by dropping a pin |
| `TRV-JRN-027` | Private by default |
| `TRV-JRN-006` | Private note per visit |
| `TRV-JRN-007` | Upload own photos to a visit |

`TRV-JRN-026` and `TRV-JRN-007` are the two **Should**s worth arguing about. Everything else here is
Must. See §7.

### 3.6 My Places

`TRV-JRN-003` personal map · `TRV-JRN-004` counties shaded · `TRV-JRN-005` timeline ·
`TRV-JRN-009` stats · `TRV-JRN-016` still-to-visit nearby · `TRV-JRN-020` history survives

Stats for MVP: places visited, places stayed, counties covered, first and most recent entry.
No badges, no year-in-review, no sharing — those are Phase 7.

### 3.7 Curator tooling — without this there is no directory

All of `CUR-DIR-001..012`, plus `CUR-PLC-001..007`, `CUR-PLC-009`.

This is the unglamorous half of the MVP and the half most likely to be under-resourced. **An empty
directory is not a product.** Budget for content acquisition, not just for the tool.

### 3.8 Claim & correct — the cheap bridge to Phase 1

`HST-CLM-001..006`

A claim form and an admin queue. No partner portal, no onboarding wizard, no billing. It costs
little and produces a qualified lead list that makes Phase 1 a decision based on evidence rather
than hope.

### 3.9 Admin

`ADM-USR-001..003` · `ADM-USR-006..007` · `ADM-CFG-001` · `ADM-CFG-003` · `ADM-CFG-005`
· `ADM-AUD-001..002`

### 3.10 Cross-cutting

`XCT-A11Y-001..006` · `XCT-A11Y-008` · `XCT-PRV-001` · `XCT-PRV-004..005` · `XCT-PRV-007`
· `XCT-PRF-001..003` · `XCT-SEO-004` · `XCT-NTF-001` · `XCT-NTF-006`
· `VIS-LGL-001..005`
· `OPS-OBS-001..003` · `OPS-CIC-001..002` · `OPS-CIC-005..006` · `OPS-CIC-008`
· `OPS-DAT-001..004` · `OPS-SEC-001..003` · `OPS-SEC-006`

`XCT-PRV-007` matters more than it looks: a user who logs their local walks reveals where they live.
Home-area inference is a real privacy risk in a travel-record product, and it is why check-offs are
private by default.

## 4. Explicitly out of scope

| Excluded | Why |
|---|---|
| Booking, availability, calendars | Untested demand; the single largest cost in the backlog |
| Payments, Stripe, payouts, refunds | Follows booking |
| Subscriptions, plans, featured placement | Nothing to sell until partners get value |
| Partner portal & onboarding wizard | Claim queue covers Phase 0 needs |
| Staff, roles, RBAC | No partner portal to delegate |
| Reviews & ratings | Pulls in the entire moderation service — Phase 5 |
| Messaging | Phase 2a |
| Offers, vouchers, QR redemption | Phase 6 |
| Experiences & sessions | Phase 6 |
| Analytics dashboards | Nothing to analyse |
| Wishlists, itineraries, badges, public maps | Phase 7 |
| Support ticketing | An email address is enough at this size |
| AI moderation service | No user-generated public content |

**`my-island-moderator` is not needed for MVP.** It can stay in the repo, undeployed.

## 5. Data model

The minimum that will not need rewriting in Phase 2.

```
Entry                       (the directory record — replaces Owner-as-campsite)
├── id, slug, name, description
├── category                STAY | EXPERIENCE | SUPPLIER | PLACE
├── type                    FK to taxonomy — data, NOT a Java enum
├── location                county, town, lat, lng
├── priceBand               null | 1..4          ← indicative only
├── contact                 website, phone, email
├── seasonality             openFrom, openTo, permanentlyClosed
├── verification            UNVERIFIED | CURATOR_VERIFIED | PARTNER_CONFIRMED
├── source                  sourceType, sourceRef, lastVerifiedAt
├── facilities[]            FK to taxonomy
├── images[]
├── placeDetail?            distanceKm, ascentM, difficulty, routeType, gpx   (category = PLACE)
└── partnerId?              null until claimed                                ← Phase 1 seam

Visit                       (the check-off)
├── id, userId, entryId
├── visitType               VISITED | STAYED
├── occurredOn              date
├── datePrecision           DAY | MONTH | YEAR
├── note?                   private
├── images[]                private
└── createdAt

UserPlace                   (self-created pin, TRV-JRN-026)
└── userId, name, lat, lng, note      — private; promotable to Entry by a curator

Claim
└── entryId, claimantEmail, evidence, status, createdAt
```

**Three decisions that are expensive to reverse — get them right now:**

1. **`type` and `facilities` are taxonomy tables, not enums.** This is the specific mistake in the
   current codebase: `PropertyType = TENT, TOURING, GLAMPING, CABIN, MOBILE_HOME` cannot express a
   B&B without a migration and a deploy.
2. **`visitType` exists from the first commit.** Collapsing "been" and "stayed" into one boolean
   means later asking every user about every entry they ever logged.
3. **`datePrecision` exists from the first commit.** Storing "2019 sometime" as 1 January 2019 is
   silent data loss that surfaces as a wrong timeline years later.

### Reusable from the existing codebase

| Existing | Use |
|---|---|
| `discovery` module — `PointOfInterest`, `UserPoiVisit`, `PoiRepository` | Direct ancestor of `Entry` (PLACE) and `Visit`. Generalise rather than rewrite |
| `identity` module — `User`, auth, reset, verification | Keep as is |
| `admin` module — audit log, `Lead` CRM | Audit for `ADM-AUD`; `Lead` receives claims |
| `accommodation` — `Amenity`, `EntityImage` | Becomes the facility taxonomy and image handling |
| React app shell, `ExplorePage`, `JournalPage`, map components | `ExplorePage` and `JournalPage` are close to the two MVP screens already |

**Not needed:** `booking`, `marketplace`, `review`, `communication`, `support`, all Stripe wiring,
`my-island-moderator`, Gatling.

## 6. Success criteria

Set the numbers before launch, not after the data arrives.

| Signal | Measures |
|---|---|
| **Activation** — % of new accounts checking off ≥1 place in week one | Is the value obvious? |
| **Depth** — median check-offs per active user at 30 days | Is one enough, or do they keep going? |
| **Return** — % checking off again in a later session | **The one that matters.** Is this a habit or a novelty? |
| **Coverage** — % of check-offs against directory entries vs self-created pins | Is our content good enough? |
| **Partner pull** — unsolicited claims and corrections per week | Do businesses care unprompted? |

**Kill criterion:** if return rate is near zero, do not proceed to Phase 1. Change the concept or stop.

## 7. Open decisions

| # | Question | Recommendation |
|---|---|---|
| 1 | Is `TRV-JRN-026` (self-created pins) in or out? | **In.** Coverage will be patchy at launch; without it early users hit a wall, and the ratio of pins to entries is the clearest signal of where the directory is thin |
| 2 | Photos on visits (`TRV-JRN-007`)? | **In, private only.** Cheap while private; public photos would pull in moderation |
| 3 | Ireland only, or Ireland-first? | Decide before the taxonomy is written — it drives country/region modelling |
| 4 | Curator-only entries, or traveller-submitted too? | **Curator-only at launch.** Submissions arrive via `HST-CLM-005` and are curated in |
| 5 | Do we migrate existing seed data, or start clean? | Existing POI seed data is directly reusable; campsite seed data needs remodelling |
| 6 | Does the rename happen before or after MVP? | **Before.** Doing it with the `Owner` → `Entry` remodel is one migration, not two — see `docs/NAMING_CANDIDATES.md` |

## 8. What this defers, and the risk of that

Deferring booking means partners get **exposure but no transaction**, so Phase 1's "will they
maintain a free listing?" is a genuinely open question — a directory listing they cannot monetise
may not hold their attention. That is the main risk in this plan, and it is the right risk to take:
it costs weeks to test, where building booking first costs months and tests nothing about whether
anyone wants the product.
