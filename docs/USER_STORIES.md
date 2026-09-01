---
title: User Stories
type: product
status: draft
created: 2026-09-01
tags:
  - product
  - user-stories
  - backlog
---

# User Stories — Full Backlog

> A ground-up story catalogue for the rebooted platform. Supersedes the campsite-only framing of
> `docs/ROADMAP.md`. Read alongside `docs/domain/DOMAIN_MODEL.md`.

---

## 0. How to read this document

### 0.1 The domain shift this backlog assumes

The existing codebase models **one owner = one campsite**. `Owner` is simultaneously the user's
business profile *and* the property, and `PropertyType` is a closed camping enum. Everything below
assumes that is generalised:

| Old | New | Note |
|---|---|---|
| `Owner` (user + property fused) | `Partner` (the business) + `Listing` (the thing) | One Partner may hold many Listings |
| `Supplier` | `Partner` with a `SUPPLIER` capability | Same onboarding, billing and staff machinery |
| `PropertyType` (5 camping values) | `ListingCategory` + `ListingType` taxonomy | Admin-editable, not a Java enum |
| `Lot` | `Bookable` (pitch, room, pod, table, seat, session) | A unit of inventory with capacity + calendar |
| `Campsite` | `Listing` of category `STAY` | |
| — | `Listing` of category `EXPERIENCE` | New: session-based, ticketed |
| — | `Listing` of category `SUPPLIER` | Existing marketplace, unified |
| `PointOfInterest` | `Place` — editorial, non-bookable | Already exists in `discovery` |

`Listing` categories in scope: **STAY** (campsite, B&B, guesthouse, cabin, glamping, hostel,
self-catering), **EXPERIENCE** (guided walk, kayak, food tour, workshop), **SUPPLIER** (farm shop,
café, bike hire, producer), **PLACE** (curated hike, landmark, beach — editorial, not owned).

### 0.2 Story ID convention

`<ROLE>-<EPIC>-<n>` — e.g. `HST-LST-014` is Host, Listing Management, story 14.
IDs are stable. Never renumber; retire with ~~strikethrough~~ and a note.

### 0.3 Format

Stories are written as `**ID** — As a <role>, I want <capability>, so that <outcome>.`
High-value or ambiguous stories carry **AC** (acceptance criteria) bullets. The long tail is
deliberately terse — write ACs at grooming time, not now.

### 0.4 Priority

| Tag | Meaning |
|---|---|
| **M** | Must — MVP. Product is not launchable without it |
| **S** | Should — first paid release |
| **C** | Could — value-add, schedule when capacity allows |
| **W** | Won't (this cycle) — recorded so it stops being re-proposed |

### 0.5 Monetisation marker

**$** marks a story gated behind a paid subscription tier. The free tier must remain genuinely
usable — gate *management leverage* (analytics, automation, staff, channels), never *the ability to
be found or to receive a booking*. A Partner who cannot receive a booking has no reason to stay.

---

## 1. Roles

| Code | Role | Definition |
|---|---|---|
| `VIS` | **Visitor** | Unauthenticated. Browses, searches, reads. Cannot book or save |
| `TRV` | **Traveller** | Registered end user. Books, saves, reviews, keeps a travel record |
| `HST` | **Host** | Partner offering accommodation (campsite, B&B, cabin, guesthouse) |
| `SPL` | **Supplier** | Partner offering goods/services locally (farm shop, bike hire, café) |
| `EXP` | **Experience Provider** | Partner offering scheduled, ticketed activities |
| `STF` | **Staff Member** | Delegated user acting inside a Partner's account under a role |
| `AGT` | **Support Agent** | Platform-side. Handles tickets, refunds, account issues |
| `MOD` | **Moderator** | Platform-side. Reviews flagged content, listings, images |
| `CUR` | **Curator** | Platform-side. Authors editorial Places, trails, guides, collections |
| `BIZ` | **Partnerships** | Platform-side. Lead CRM, outreach, partner acquisition |
| `ADM` | **Platform Admin** | Superuser. Config, taxonomy, finance, toggles, audit |
| `OPS` | **Platform Engineer** | Runs the platform. Observability, CI/CD, incidents, data |
| `XCT` | *cross-cutting* | Applies to every role — accessibility, i18n, privacy, performance |

**Role composition.** Roles are **capabilities, not types**. One user account may simultaneously be
a Traveller, a Host of two campsites, a Supplier, and a Staff member of someone else's business.
Every screen must resolve "which hat am I wearing right now" explicitly. This is the single most
common source of bugs in two-sided marketplaces — design for it from day one.

---

## 2. VIS — Visitor (anonymous)

### VIS-DSC — Discovery & search

- **VIS-DSC-001** — As a Visitor, I want to search by destination, dates and party size from the homepage, so that I can see what is available without creating an account. **M**
  - **AC** Search runs with any subset of fields; empty destination returns everything, ranked
  - **AC** Party size accepts adults, children, infants, pets separately
  - **AC** Results are shareable via URL — every filter is in the querystring
- **VIS-DSC-002** — As a Visitor, I want to search without dates, so that I can browse before I have committed to a trip. **M**
- **VIS-DSC-003** — As a Visitor, I want to filter by listing category (stay / experience / supplier / place), so that I can narrow to what I actually want. **M**
- **VIS-DSC-004** — As a Visitor, I want to filter stays by type (tent pitch, touring, glamping, cabin, B&B room, hostel bed, self-catering), so that I get the right kind of accommodation. **M**
- **VIS-DSC-005** — As a Visitor, I want to filter by county and by town, so that I can search the way Irish people describe location. **M**
- **VIS-DSC-006** — As a Visitor, I want to filter by price range, so that I stay within budget. **M**
- **VIS-DSC-007** — As a Visitor, I want to filter by amenities (WiFi, showers, EV charging, dog-friendly, accessible pitch, laundry, playground), so that I only see places that meet my needs. **M**
- **VIS-DSC-008** — As a Visitor, I want to filter by guest rating, so that I can skip poorly reviewed places. **S**
- **VIS-DSC-009** — As a Visitor, I want to sort results by relevance, price, rating or distance, so that I can prioritise what matters to me. **M**
- **VIS-DSC-010** — As a Visitor, I want to filter to only instantly bookable listings, so that I avoid waiting on host approval. **S**
- **VIS-DSC-011** — As a Visitor, I want free-text search that understands place names, listing names and amenities, so that I can just type what I am thinking. **S**
- **VIS-DSC-012** — As a Visitor, I want typo-tolerant search, so that "Kilkeny" still finds Kilkenny. **S**
- **VIS-DSC-013** — As a Visitor, I want autocomplete on the destination field with counties, towns and named places, so that I pick a valid location fast. **M**
- **VIS-DSC-014** — As a Visitor, I want to search "near me" using my device location, so that I can find something tonight. **S**
- **VIS-DSC-015** — As a Visitor, I want to see a result count and applied-filter chips, so that I understand why I am seeing these results. **M**
- **VIS-DSC-016** — As a Visitor, I want to clear all filters in one action, so that I can start over. **M**
- **VIS-DSC-017** — As a Visitor, I want an empty-state that suggests nearby or date-adjacent alternatives, so that a zero-result search is not a dead end. **S**
  - **AC** Offers at least one of: widen dates ±3 days, widen radius, drop the most restrictive filter
- **VIS-DSC-018** — As a Visitor, I want results to paginate or infinite-scroll without losing my scroll position on back-navigation, so that browsing is not punishing. **M**
- **VIS-DSC-019** — As a Visitor, I want to filter by accessibility features specifically, so that I can trust a place will work for me. **S**
- **VIS-DSC-020** — As a Visitor, I want to filter by "pet friendly", so that I can travel with my dog. **M**
- **VIS-DSC-021** — As a Visitor, I want to filter experiences by date and duration, so that I can fit one into my trip. **S**
- **VIS-DSC-022** — As a Visitor, I want to filter hikes by difficulty and distance, so that I pick a walk that suits my fitness. **M**
- **VIS-DSC-023** — As a Visitor, I want to see seasonal/closed listings clearly marked rather than hidden, so that I can plan a future trip. **C**
- **VIS-DSC-024** — As a Visitor, I want recently viewed listings surfaced on return, so that I can pick up where I left off. **C**
- **VIS-DSC-025** — As a Visitor, I want search to remember my last query in this browser, so that a refresh does not cost me the setup. **C**

### VIS-MAP — Map exploration

- **VIS-MAP-001** — As a Visitor, I want to see search results on an interactive map, so that I can understand the geography of my options. **M**
  - **AC** Map and list are synchronised — hovering a card highlights the pin and vice versa
  - **AC** Panning/zooming offers a "search this area" action rather than auto-refetching on every frame
- **VIS-MAP-002** — As a Visitor, I want map pins colour-coded and iconed by category, so that I can tell a campsite from a hike at a glance. **M**
- **VIS-MAP-003** — As a Visitor, I want pins to cluster at low zoom, so that the map stays readable nationwide. **M**
- **VIS-MAP-004** — As a Visitor, I want to click a pin for a summary card with photo, price and rating, so that I can triage without leaving the map. **M**
- **VIS-MAP-005** — As a Visitor, I want to toggle map layers (stays, experiences, suppliers, hikes, landmarks), so that I control the density. **S**
- **VIS-MAP-006** — As a Visitor, I want a full-screen map mode, so that I can explore properly on a laptop. **S**
- **VIS-MAP-007** — As a Visitor, I want to draw or select an area on the map to constrain results, so that I can search a peninsula rather than a county. **C**
- **VIS-MAP-008** — As a Visitor, I want to see what is nearby a listing (trails, shops, beaches) on its map, so that I can judge the surroundings. **M**
- **VIS-MAP-009** — As a Visitor, I want a satellite/terrain toggle, so that I can judge terrain before a hike. **C**
- **VIS-MAP-010** — As a Visitor, I want the map to work on mobile with one-handed gestures, so that I can use it in the field. **M**

### VIS-LST — Listing pages

- **VIS-LST-001** — As a Visitor, I want a listing page with photo gallery, description, location map, amenities, policies and reviews, so that I can decide. **M**
- **VIS-LST-002** — As a Visitor, I want to see prices with all mandatory fees included, so that I am not surprised at checkout. **M**
  - **AC** Displayed nightly rate and total both state what is included
  - **AC** Any unavoidable fee (cleaning, booking fee, tourist levy) is in the headline total
- **VIS-LST-003** — As a Visitor, I want an availability calendar showing which dates are open, so that I can plan. **M**
- **VIS-LST-004** — As a Visitor, I want to see minimum-stay rules on the calendar, so that I understand why a date is refused. **M**
- **VIS-LST-005** — As a Visitor, I want to see cancellation and modification policy before booking, so that I know my risk. **M**
- **VIS-LST-006** — As a Visitor, I want to see check-in/check-out times and arrival instructions summary, so that I can plan travel. **M**
- **VIS-LST-007** — As a Visitor, I want to see house rules (noise, campfires, pets, groups, under-18s), so that I do not book somewhere unsuitable. **M**
- **VIS-LST-008** — As a Visitor, I want to see each bookable unit type with its own capacity, price and photos, so that I choose the right one. **M**
- **VIS-LST-009** — As a Visitor, I want to read reviews with ratings broken down by category, so that I can weigh what matters to me. **M**
- **VIS-LST-010** — As a Visitor, I want to see host responses to reviews, so that I can judge how they handle problems. **S**
- **VIS-LST-011** — As a Visitor, I want to filter and sort reviews (most recent, lowest rated, mentions "dog"), so that I can find relevant experience. **C**
- **VIS-LST-012** — As a Visitor, I want a photo gallery with a lightbox, captions and room/pitch grouping, so that I can see what I am booking. **M**
- **VIS-LST-013** — As a Visitor, I want to see whether a listing is verified by the platform, so that I can trust it. **S**
- **VIS-LST-014** — As a Visitor, I want to see how long the host has been on the platform and their response rate, so that I can gauge reliability. **S**
- **VIS-LST-015** — As a Visitor, I want to share a listing by link, native share sheet or messaging app, so that I can consult travel companions. **M**
- **VIS-LST-016** — As a Visitor, I want listing pages to have rich link previews and structured data, so that shared links look good and rank well. **S**
  - **AC** Open Graph + Twitter card tags; `schema.org/LodgingBusiness` or `TouristAttraction` JSON-LD
- **VIS-LST-017** — As a Visitor, I want to report an inaccurate or inappropriate listing, so that quality stays high. **S**
- **VIS-LST-018** — As a Visitor, I want to see similar or nearby alternatives at the bottom of a listing, so that I keep browsing if it is not right. **C**
- **VIS-LST-019** — As a Visitor, I want to see supplier offers attached to a stay's area, so that I discover local value. **S**
- **VIS-LST-020** — As a Visitor, I want listing pages to load fast on a poor rural connection, so that I can browse where I actually am. **M**

### VIS-PLC — Places, hikes & editorial

- **VIS-PLC-001** — As a Visitor, I want to browse curated hikes and walks with distance, ascent, difficulty and estimated time, so that I can pick one. **M**
- **VIS-PLC-002** — As a Visitor, I want a route line drawn on the map for a trail, so that I can see where it goes. **S**
- **VIS-PLC-003** — As a Visitor, I want to download a GPX/KML file for a trail, so that I can use it in my own device. **C**
- **VIS-PLC-004** — As a Visitor, I want to browse landmarks, beaches, waterfalls, castles and viewpoints, so that I can plan days out. **M**
- **VIS-PLC-005** — As a Visitor, I want editorial guides and collections ("Best coastal walks in Kerry"), so that I get inspiration, not just a search box. **S**
- **VIS-PLC-006** — As a Visitor, I want to see which stays are near a given hike, so that I can build a trip around it. **M**
- **VIS-PLC-007** — As a Visitor, I want practical detail on a place — parking, toilets, dog rules, tides, safety notes, best season — so that I turn up prepared. **S**
- **VIS-PLC-008** — As a Visitor, I want to see photos of a place contributed by other travellers, so that I get an honest view. **C**
- **VIS-PLC-009** — As a Visitor, I want to know if a trail is currently closed or diverted, so that I do not waste a journey. **S**
- **VIS-PLC-010** — As a Visitor, I want to see accessibility notes on a trail (surface, gates, stiles, gradient), so that I can judge suitability. **S**

### VIS-CNV — Conversion & account creation

- **VIS-CNV-001** — As a Visitor, I want to be prompted to sign up only when I try to book, save or review, so that browsing stays frictionless. **M**
- **VIS-CNV-002** — As a Visitor, I want my in-progress search or booking preserved through signup, so that I do not have to start again. **M**
  - **AC** Post-auth redirect returns to the exact prior state including selected dates and unit
- **VIS-CNV-003** — As a Visitor, I want to sign up with email and password, so that I can create an account simply. **M**
- **VIS-CNV-004** — As a Visitor, I want to sign in with Google or Apple, so that I can skip password creation. **S**
- **VIS-CNV-005** — As a Visitor, I want to see clearly what an account gets me before I create one, so that the ask feels fair. **S**
- **VIS-CNV-006** — As a Visitor, I want a "list your business" entry point in the main navigation, so that I can become a Partner. **M**
- **VIS-CNV-007** — As a Visitor, I want to subscribe to a newsletter without a full account, so that I can stay in touch cheaply. **C**

### VIS-LGL — Legal, consent & trust

- **VIS-LGL-001** — As a Visitor, I want a GDPR-compliant cookie consent banner with granular categories, so that I control tracking. **M**
  - **AC** Reject-all is exactly as easy as accept-all; no non-essential cookie fires before consent
- **VIS-LGL-002** — As a Visitor, I want to read the privacy policy, terms of service and cancellation policy without an account. **M**
- **VIS-LGL-003** — As a Visitor, I want to withdraw or change cookie consent at any time from the footer. **M**
- **VIS-LGL-004** — As a Visitor, I want to see who operates the platform and how to contact them, so that I know who I am dealing with. **M**
- **VIS-LGL-005** — As a Visitor, I want an accessibility statement, so that I know the platform's commitment and how to report issues. **S**

---

## 3. TRV — Traveller (registered end user)

### TRV-ACC — Account & profile

- **TRV-ACC-001** — As a Traveller, I want to register with email and password and verify my email, so that my account is secure and reachable. **M**
- **TRV-ACC-002** — As a Traveller, I want to sign in and stay signed in on trusted devices, so that I am not re-authenticating constantly. **M**
- **TRV-ACC-003** — As a Traveller, I want to reset a forgotten password by email link, so that I can recover access. **M**
  - **AC** Token single-use, expires in 60 minutes, invalidated on use or on password change
  - **AC** Response is identical whether or not the email exists (no account enumeration)
- **TRV-ACC-004** — As a Traveller, I want to change my password while signed in, requiring my current password. **M**
- **TRV-ACC-005** — As a Traveller, I want to enable two-factor authentication, so that my account and payment methods are protected. **S**
- **TRV-ACC-006** — As a Traveller, I want to see and revoke active sessions/devices, so that I can cut off a lost phone. **S**
- **TRV-ACC-007** — As a Traveller, I want to edit my name, photo, bio, phone and home county, so that hosts know who is arriving. **M**
- **TRV-ACC-008** — As a Traveller, I want to link Google/Apple to an existing email account, so that I have more than one way in. **S**
- **TRV-ACC-009** — As a Traveller, I want to set my language and currency preference, so that the site fits me. **C**
- **TRV-ACC-010** — As a Traveller, I want to set travel preferences (party composition, pets, accessibility needs, interests), so that results are personalised. **S**
- **TRV-ACC-011** — As a Traveller, I want to store dietary or accessibility notes that are shared with hosts on booking, so that I do not re-type them each time. **C**
- **TRV-ACC-012** — As a Traveller, I want to manage saved payment methods, so that repeat booking is fast. **S**
- **TRV-ACC-013** — As a Traveller, I want to become a Host or Supplier from my profile, so that I can list without a separate account. **M**
- **TRV-ACC-014** — As a Traveller, I want to switch between my traveller view and any partner portals I have access to, so that context is never ambiguous. **M**
  - **AC** A persistent, visible account/context switcher; the active context is shown on every page
- **TRV-ACC-015** — As a Traveller, I want to download all my data in a portable format, so that I can exercise my GDPR rights. **M**
- **TRV-ACC-016** — As a Traveller, I want to delete my account, so that I can leave the platform. **M**
  - **AC** Explains what is retained (financial records for statutory period) and what is erased
  - **AC** Reviews are anonymised, not deleted, so listing ratings stay honest
  - **AC** Blocked while a future booking is active, with a clear explanation and a route to cancel first
- **TRV-ACC-017** — As a Traveller, I want granular notification preferences per channel (email, push, SMS, in-app) and per event type. **M**
- **TRV-ACC-018** — As a Traveller, I want to unsubscribe from marketing in one click while keeping transactional mail. **M**

### TRV-SRC — Search, saving & planning

- **TRV-SRC-001** — As a Traveller, I want to save a listing to a wishlist, so that I can come back to it. **M**
- **TRV-SRC-002** — As a Traveller, I want multiple named wishlists ("Kerry October", "Dog-friendly"), so that I can plan several trips. **S**
- **TRV-SRC-003** — As a Traveller, I want to add a private note to a saved listing, so that I remember why I saved it. **C**
- **TRV-SRC-004** — As a Traveller, I want to share a wishlist with travel companions by link. **S**
- **TRV-SRC-005** — As a Traveller, I want a collaborative wishlist where companions can add and vote, so that we decide together. **C**
- **TRV-SRC-006** — As a Traveller, I want to save a search and be alerted when new matching listings appear. **C**
- **TRV-SRC-007** — As a Traveller, I want a price-drop or availability alert on a saved listing for my dates. **C**
- **TRV-SRC-008** — As a Traveller, I want to compare two or three listings side by side, so that I can choose on the facts. **C**
- **TRV-SRC-009** — As a Traveller, I want personalised recommendations based on where I have been and saved. **C**
- **TRV-SRC-010** — As a Traveller, I want to build a multi-stop trip itinerary combining stays, experiences and places, so that I plan a route not a night. **C**
- **TRV-SRC-011** — As a Traveller, I want to see my wishlist pins on the map alongside search results. **S**

### TRV-BKG — Booking

- **TRV-BKG-001** — As a Traveller, I want to select dates, unit type and party size, and see a full price breakdown before paying, so that there are no surprises. **M**
  - **AC** Breakdown itemises: nightly rate × nights, extras, fees, taxes, discounts, total
  - **AC** Price is re-validated server-side at submission; a changed price blocks and re-confirms
- **TRV-BKG-002** — As a Traveller, I want the system to prevent double-booking a unit, so that my reservation is real. **M**
  - **AC** Availability is checked under a transaction/lock at creation, not only at page render
- **TRV-BKG-003** — As a Traveller, I want to book instantly where the host allows it, so that I get immediate certainty. **M**
- **TRV-BKG-004** — As a Traveller, I want to send a booking request where the host requires approval, and see it pending. **M**
- **TRV-BKG-005** — As a Traveller, I want my card authorised at request and only charged when the host confirms, so that I am not out of pocket for a rejected request. **M**
- **TRV-BKG-006** — As a Traveller, I want to add extras (firewood, breakfast, bike hire, early check-in) during booking. **S**
- **TRV-BKG-007** — As a Traveller, I want to add a message to the host with my booking, so that I can flag arrival time or needs. **M**
- **TRV-BKG-008** — As a Traveller, I want to apply a promo or voucher code at checkout. **C**
- **TRV-BKG-009** — As a Traveller, I want to book more than one unit in one transaction, so that a group can travel together. **S**
- **TRV-BKG-010** — As a Traveller, I want to retry payment on a failed authorisation without rebuilding the booking. **M**
- **TRV-BKG-011** — As a Traveller, I want an immediate confirmation screen and email with a reference number. **M**
- **TRV-BKG-012** — As a Traveller, I want to add the booking to my calendar (ICS), so that it is in my diary. **S**
- **TRV-BKG-013** — As a Traveller, I want to pay a deposit now and the balance before arrival, where the host offers it. **C** **$**
- **TRV-BKG-014** — As a Traveller, I want to book an experience for a specific session and number of tickets. **S**
- **TRV-BKG-015** — As a Traveller, I want to see remaining spaces on an experience session, so that I feel the urgency honestly. **S**
- **TRV-BKG-016** — As a Traveller, I want to join a waitlist for a sold-out date or session. **C**
- **TRV-BKG-017** — As a Traveller, I want to check out as a guest with just an email, so that account creation is not a booking blocker. **C**
- **TRV-BKG-018** — As a Traveller, I want SCA/3-D Secure handled smoothly, so that a bank challenge does not lose my booking. **M**
- **TRV-BKG-019** — As a Traveller, I want a clear, recoverable error if payment fails at any step, so that I know what to do next. **M**
- **TRV-BKG-020** — As a Traveller, I want to see the cancellation deadline and refund amount on the confirmation, so that my rights are explicit. **M**

### TRV-TRP — Trips & lifecycle

- **TRV-TRP-001** — As a Traveller, I want a Trips page split into upcoming, current, past and cancelled. **M**
- **TRV-TRP-002** — As a Traveller, I want a booking detail view with reference, dates, unit, price paid, host contact and directions. **M**
- **TRV-TRP-003** — As a Traveller, I want check-in instructions to become visible a set time before arrival, so that I get them when I need them. **M**
- **TRV-TRP-004** — As a Traveller, I want to request a date or unit change, so that plans can shift. **S**
- **TRV-TRP-005** — As a Traveller, I want to see the price impact of a requested change before I submit it. **S**
- **TRV-TRP-006** — As a Traveller, I want changes within the host's policy applied instantly, and others sent for approval, with the difference made obvious. **S**
- **TRV-TRP-007** — As a Traveller, I want to cancel a booking and see exactly what I will be refunded before confirming. **M**
- **TRV-TRP-008** — As a Traveller, I want to track my refund status, so that I am not left wondering. **M**
- **TRV-TRP-009** — As a Traveller, I want to download a receipt or VAT invoice. **S**
- **TRV-TRP-010** — As a Traveller, I want a reminder before check-in with directions, arrival window and what to bring. **S**
- **TRV-TRP-011** — As a Traveller, I want an offline-accessible booking pass (QR + key details), so that it works with no rural signal. **S**
- **TRV-TRP-012** — As a Traveller, I want to check in from my phone on arrival where the host supports it. **C**
- **TRV-TRP-013** — As a Traveller, I want to extend my stay from the Trips page if the unit is free. **C**
- **TRV-TRP-014** — As a Traveller, I want to see and pay any outstanding balance from the Trips page. **C**
- **TRV-TRP-015** — As a Traveller, I want to add companions to a booking so that they can see it too. **C**
- **TRV-TRP-016** — As a Traveller, I want to rebook a past stay in two taps. **C**

### TRV-MSG — Messaging

- **TRV-MSG-001** — As a Traveller, I want to message a host about a booking in a threaded conversation. **M**
- **TRV-MSG-002** — As a Traveller, I want unread counts and a notification when the host replies. **M**
- **TRV-MSG-003** — As a Traveller, I want to message a host with a pre-booking question. **S**
- **TRV-MSG-004** — As a Traveller, I want to attach a photo to a message, so that I can show a problem. **C**
- **TRV-MSG-005** — As a Traveller, I want to see whether the host has read my message. **C**
- **TRV-MSG-006** — As a Traveller, I want messages to remain accessible after checkout for a defined window, so that I can resolve issues afterwards. **S**
- **TRV-MSG-007** — As a Traveller, I want to report an abusive message. **S**
- **TRV-MSG-008** — As a Traveller, I want to be warned against moving payment off-platform, so that I am protected from fraud. **S**

### TRV-RVW — Reviews

- **TRV-RVW-001** — As a Traveller, I want to review a listing only after a completed stay, so that reviews are trustworthy. **M**
- **TRV-RVW-002** — As a Traveller, I want to rate by category (cleanliness, location, facilities, value, host communication) plus an overall score. **M**
- **TRV-RVW-003** — As a Traveller, I want to add photos to my review. **S**
- **TRV-RVW-004** — As a Traveller, I want a review window that closes after a defined period, so that reviews stay current. **S**
- **TRV-RVW-005** — As a Traveller, I want to edit my review for a short period after posting. **C**
- **TRV-RVW-006** — As a Traveller, I want to see the host's response to my review. **S**
- **TRV-RVW-007** — As a Traveller, I want to review a supplier offer I redeemed. **S**
- **TRV-RVW-008** — As a Traveller, I want to review an experience I attended. **S**
- **TRV-RVW-009** — As a Traveller, I want a reminder to review after checkout, once, not repeatedly. **S**
- **TRV-RVW-010** — As a Traveller, I want to know my review is held for moderation and why, if it is. **S**
- **TRV-RVW-011** — As a Traveller, I want to leave private feedback to the host separately from the public review. **C**

### TRV-JRN — Travel record: journal, passport & map

> This is the retention loop and the clearest differentiator against generic booking sites. It should
> be built on the existing `discovery` module (`PointOfInterest`, `UserPoiVisit`), generalised so a
> "visit" can be a stay, an experience, a supplier redemption **or** a self-logged place.

- **TRV-JRN-001** — As a Traveller, I want every completed booking to automatically appear in my travel record, so that it builds itself. **M**
  - **AC** Auto-logged on booking `COMPLETED`; no manual step required
- **TRV-JRN-002** — As a Traveller, I want to manually mark a place, hike or landmark as visited, so that I can record things I did not book. **M**
- **TRV-JRN-003** — As a Traveller, I want a personal map showing every place I have been, so that I can see my footprint. **M**
  - **AC** Pins differentiate booked vs self-logged; clicking a pin opens the journal entry
- **TRV-JRN-004** — As a Traveller, I want to see counties or regions I have visited shaded on the map, so that I have a sense of coverage. **S**
- **TRV-JRN-005** — As a Traveller, I want a timeline view of my travels by year and trip. **S**
- **TRV-JRN-006** — As a Traveller, I want to write a private journal entry with notes for each visit. **S**
- **TRV-JRN-007** — As a Traveller, I want to upload my own photos to a journal entry. **S**
- **TRV-JRN-008** — As a Traveller, I want to rate a place privately, separate from the public review system. **C**
- **TRV-JRN-009** — As a Traveller, I want statistics — places visited, counties covered, nights away, kilometres walked, trails completed. **S**
- **TRV-JRN-010** — As a Traveller, I want badges or milestones for meaningful achievements, so that there is a reason to keep going. **C**
  - **AC** Milestones must be earnable by real travel, never by spending — no pay-to-win badges
- **TRV-JRN-011** — As a Traveller, I want to share a single visit publicly as a card or image. **S**
- **TRV-JRN-012** — As a Traveller, I want to share my whole travel map as a public read-only page. **S**
  - **AC** Sharing is off by default; public page never exposes exact dates of *future* travel
- **TRV-JRN-013** — As a Traveller, I want granular control over what a shared map reveals (places only, no notes, no dates). **M**
- **TRV-JRN-014** — As a Traveller, I want to generate a shareable year-in-review summary. **C**
- **TRV-JRN-015** — As a Traveller, I want to export my travel record as GPX, CSV or PDF. **C**
- **TRV-JRN-016** — As a Traveller, I want to see a "still to visit" list of nearby places I have not been. **C**
- **TRV-JRN-017** — As a Traveller, I want to follow another traveller's public map for inspiration. **W**
- **TRV-JRN-018** — As a Traveller, I want to log a visit offline and have it sync when I regain signal, so that remote places still get recorded. **C**
- **TRV-JRN-019** — As a Traveller, I want to bulk-log a completed multi-day trail. **C**
- **TRV-JRN-020** — As a Traveller, I want my journal entries retained if I delete a booking from view, so that history is not lost by accident. **S**

- **TRV-JRN-021** — As a Traveller, I want to distinguish "been there" from "stayed there" when I check a place off, so that a day visit and an overnight are not conflated. **M**
  - **AC** Visit type is a first-class field from day one — `VISITED` | `STAYED`; retrofitting it later means re-asking every user about every entry
  - **AC** A place that cannot be stayed at (a viewpoint, a shop) only offers `VISITED`
- **TRV-JRN-022** — As a Traveller, I want to check a place off in one tap directly from the directory list, map pin or detail page, so that recording is effortless. **M**
  - **AC** No modal, no mandatory fields — one tap records it; detail can be added later
- **TRV-JRN-023** — As a Traveller, I want to record roughly when I was there (exact date, month, or just a year), so that I can log trips from memory. **M**
  - **AC** Date precision is stored explicitly; "2019 sometime" must not become 1 January 2019
- **TRV-JRN-024** — As a Traveller, I want to un-check or edit an entry, so that I can fix a mistake. **M**
- **TRV-JRN-025** — As a Traveller, I want to check off several places at once from a list, so that back-filling years of travel is not a hundred taps. **S**
- **TRV-JRN-026** — As a Traveller, I want to check off a place that is not in the directory by dropping a pin and naming it, so that the record is mine, not limited by our coverage. **S**
  - **AC** User-created places are private by default; promoting one into the public directory is a curator decision
- **TRV-JRN-027** — As a Traveller, I want my check-offs to be private by default, so that recording is not a performance. **M**

### TRV-OFR — Offers, vouchers & marketplace

- **TRV-OFR-001** — As a Traveller, I want to browse local supplier offers filtered by area and category. **M**
- **TRV-OFR-002** — As a Traveller, I want to see offers relevant to my upcoming trip's location and dates. **S**
- **TRV-OFR-003** — As a Traveller, I want to claim an offer and receive a QR voucher. **M**
- **TRV-OFR-004** — As a Traveller, I want all my vouchers in one place with status and expiry. **M**
- **TRV-OFR-005** — As a Traveller, I want a voucher to render offline, so that I can redeem it in a shop with no signal. **S**
- **TRV-OFR-006** — As a Traveller, I want a reminder before a claimed voucher expires. **C**
- **TRV-OFR-007** — As a Traveller, I want to see supplier opening hours, contact and location on the voucher. **M**
- **TRV-OFR-008** — As a Traveller, I want redeemed vouchers to appear in my travel record. **S**
- **TRV-OFR-009** — As a Traveller, I want exclusive offers unlocked by having a confirmed booking nearby. **C**

### TRV-SUP — Support & safety

- **TRV-SUP-001** — As a Traveller, I want to raise a support ticket linked to a booking, so that context is automatic. **M**
- **TRV-SUP-002** — As a Traveller, I want to see my ticket history and thread replies. **M**
- **TRV-SUP-003** — As a Traveller, I want a searchable help centre / FAQ. **M**
- **TRV-SUP-004** — As a Traveller, I want to report a safety concern about a listing or host urgently. **M**
- **TRV-SUP-005** — As a Traveller, I want to dispute a charge through the platform before going to my bank. **S**
- **TRV-SUP-006** — As a Traveller, I want emergency contact details for my host available offline during a stay. **S**
- **TRV-SUP-007** — As a Traveller, I want to block a host or user from contacting me. **C**

---

## 4. HST — Host (accommodation partner)

### HST-CLM — Claiming a directory entry

> The bridge from a curator-seeded directory to a self-service partner platform. Cheap to build,
> and it produces a qualified lead list that de-risks everything in `HST-ONB` below.

- **HST-CLM-001** — As a business owner, I want to see a "this is my business — claim it" action on my directory entry, so that I can take control of it. **M**
- **HST-CLM-002** — As a claimant, I want to submit a claim with my contact details and evidence of ownership. **M**
- **HST-CLM-003** — As a claimant, I want to be told what happens next and roughly when. **M**
- **HST-CLM-004** — As a claimant, I want to suggest a correction without claiming, so that fixing an error is low-commitment. **M**
- **HST-CLM-005** — As a Visitor, I want to suggest a place or business that is missing from the directory. **S**
- **HST-CLM-006** — As an Admin, I want a queue of claims and corrections to approve or reject. **M**
- **HST-CLM-007** — As an Admin, I want approving a claim to create a Partner account linked to the existing entry, preserving its check-off history. **S**
- **HST-CLM-008** — As an Admin, I want claims to flow into the lead CRM, so that partner acquisition starts from real demand. **S**

### HST-ONB — Onboarding

- **HST-ONB-001** — As a prospective Host, I want a marketing page explaining what listing costs, what I earn and how payouts work, so that I can decide before signing up. **M**
- **HST-ONB-002** — As a prospective Host, I want an earnings estimator based on my location and unit count. **C**
- **HST-ONB-003** — As a Host, I want a guided multi-step onboarding wizard, so that I am not staring at an empty form. **M**
  - **AC** Steps: business type → property details → units & capacity → amenities → photos → pricing → policies → payouts → review & publish
- **HST-ONB-004** — As a Host, I want my onboarding progress saved at every step, so that I can finish over several sittings. **M**
- **HST-ONB-005** — As a Host, I want to see percentage completion and what is still missing before I can go live. **M**
- **HST-ONB-006** — As a Host, I want to choose my business type (campsite, B&B, guesthouse, glamping, cabins, hostel, self-catering) and get a form tailored to it. **M**
  - **AC** A B&B is asked about rooms and breakfast; a campsite about pitches and hookups — never both
- **HST-ONB-007** — As a Host, I want to register as a business or a sole trader, capturing the right tax details. **S**
- **HST-ONB-008** — As a Host, I want to enter my location by address search or by dropping a map pin, so that remote properties are still precise. **M**
- **HST-ONB-009** — As a Host, I want to bulk-create identical units ("12 tent pitches"), so that setup is not 12 forms. **M**
- **HST-ONB-010** — As a Host, I want to import my existing listing data from a spreadsheet. **C**
- **HST-ONB-011** — As a Host, I want a preview of my public listing before publishing. **M**
- **HST-ONB-012** — As a Host, I want to save my listing as a draft and publish later. **M**
- **HST-ONB-013** — As a Host, I want to start a free trial without entering card details, so that I can evaluate the product. **S**
- **HST-ONB-014** — As a Host, I want to complete payout onboarding (Stripe Connect) with clear progress and a resumable link. **M**
- **HST-ONB-015** — As a Host, I want to be told exactly which verification documents are outstanding and why payouts are held. **M**
- **HST-ONB-016** — As a Host, I want onboarding help — tooltips, examples, a contact route — at every step. **S**
- **HST-ONB-017** — As a Host, I want to be warned if my listing is likely to underperform (no photos, thin description, no pricing) before I publish. **C**

### HST-LST — Listing & property management

- **HST-LST-001** — As a Host, I want to edit my listing name, description, location and contact details. **M**
- **HST-LST-002** — As a Host, I want to manage multiple properties under one account, so that I do not need several logins. **M**
  - **AC** Explicit property switcher; all portal pages are scoped to the selected property
- **HST-LST-003** — As a Host, I want to select amenities from a structured, searchable list. **M**
- **HST-LST-004** — As a Host, I want to add custom amenities not in the standard list, subject to moderation. **C**
- **HST-LST-005** — As a Host, I want to upload, reorder, caption and delete photos with drag-and-drop. **M**
- **HST-LST-006** — As a Host, I want to set a cover photo. **M**
- **HST-LST-007** — As a Host, I want photos automatically resized and optimised on upload, so that my listing loads fast. **M**
- **HST-LST-008** — As a Host, I want to attach photos to a specific unit as well as to the property. **M**
- **HST-LST-009** — As a Host, I want to record check-in/check-out times and arrival instructions. **M**
- **HST-LST-010** — As a Host, I want to write house rules and see them displayed on my listing. **M**
- **HST-LST-011** — As a Host, I want to set my cancellation policy from platform-defined tiers (flexible, moderate, strict). **M**
- **HST-LST-012** — As a Host, I want to set a modification policy — allowed, deadline in days, approval required. **S**
- **HST-LST-013** — As a Host, I want to temporarily unpublish my listing without deleting it. **M**
- **HST-LST-014** — As a Host, I want to set seasonal opening dates and have my listing marked closed outside them. **S**
- **HST-LST-015** — As a Host, I want to add a video or virtual tour. **C** **$**
- **HST-LST-016** — As a Host, I want to add nearby attractions and travel directions in my own words. **C**
- **HST-LST-017** — As a Host, I want to record accessibility features accurately with a structured checklist. **S**
- **HST-LST-018** — As a Host, I want to record my licence, registration or insurance details where required. **S**
- **HST-LST-019** — As a Host, I want to see a preview of how my listing looks on mobile. **C**
- **HST-LST-020** — As a Host, I want to duplicate an existing property as a starting point for a new one. **C**
- **HST-LST-021** — As a Host, I want to export my full listing configuration, so that I own my data. **S**
- **HST-LST-022** — As a Host, I want to import a listing configuration to restore or clone. **C**
- **HST-LST-023** — As a Host, I want to see when my listing was last updated and be nudged if it has gone stale. **C**

### HST-INV — Units & inventory

- **HST-INV-001** — As a Host, I want to create bookable units with name, type, capacity, base price and description. **M**
- **HST-INV-002** — As a Host, I want to group identical units into a type so guests book "a pitch" and I assign the specific one. **M**
- **HST-INV-003** — As a Host, I want per-unit maximum occupancy including adults, children and pets. **M**
- **HST-INV-004** — As a Host, I want to record unit-level amenities (electric hookup, ensuite, hot tub, sea view). **M**
- **HST-INV-005** — As a Host, I want to set per-unit minimum stay. **M**
- **HST-INV-006** — As a Host, I want to set maximum stay length. **C**
- **HST-INV-007** — As a Host, I want to activate/deactivate a unit without deleting its booking history. **M**
- **HST-INV-008** — As a Host, I want to reorder how unit types appear on my listing. **C**
- **HST-INV-009** — As a Host, I want to define extras (firewood, breakfast, bike hire, late checkout) with price and stock. **S**
- **HST-INV-010** — As a Host, I want extras to be per-night, per-stay or per-person as appropriate. **S**
- **HST-INV-011** — As a Host, I want to see which extras sell, so that I can price them properly. **C** **$**

### HST-CAL — Availability & calendar

- **HST-CAL-001** — As a Host, I want a month calendar showing bookings colour-coded by status. **M**
- **HST-CAL-002** — As a Host, I want a Gantt-style timeline with units as rows and bookings as bars. **M**
- **HST-CAL-003** — As a Host, I want to switch the timeline between 1-week, 2-week and 1-month ranges. **S**
- **HST-CAL-004** — As a Host, I want to block a unit for a date range for maintenance or personal use, with a reason. **M**
- **HST-CAL-005** — As a Host, I want to block the whole property for a date range in one action. **S**
- **HST-CAL-006** — As a Host, I want to drag a booking on the timeline to move or reassign it, with confirmation. **C**
- **HST-CAL-007** — As a Host, I want to see occupancy percentage per day/week on the calendar. **S** **$**
- **HST-CAL-008** — As a Host, I want to export my calendar as iCal so that I can see it in my own diary. **S**
- **HST-CAL-009** — As a Host, I want to import an external iCal feed (Airbnb, Booking.com) to avoid double-booking. **S** **$**
- **HST-CAL-010** — As a Host, I want two-way calendar sync with major OTAs. **W** **$**
- **HST-CAL-011** — As a Host, I want to set arrival-day restrictions (e.g. Saturday-only changeovers). **C**
- **HST-CAL-012** — As a Host, I want to close out arrivals or departures on specific dates. **C**
- **HST-CAL-013** — As a Host, I want a printable arrivals sheet for a date range. **C**

### HST-PRC — Pricing & revenue

- **HST-PRC-001** — As a Host, I want a base nightly price per unit type. **M**
- **HST-PRC-002** — As a Host, I want seasonal pricing rules that override the base price for a date range. **M**
- **HST-PRC-003** — As a Host, I want weekend and midweek pricing to differ. **S**
- **HST-PRC-004** — As a Host, I want a seasonal rule to also override minimum stay for its range. **S**
- **HST-PRC-005** — As a Host, I want per-person pricing above a base occupancy. **S**
- **HST-PRC-006** — As a Host, I want to charge separately for pets, extra vehicles or electric hookup. **S**
- **HST-PRC-007** — As a Host, I want length-of-stay discounts (weekly, monthly). **C**
- **HST-PRC-008** — As a Host, I want early-bird and last-minute discount rules. **C** **$**
- **HST-PRC-009** — As a Host, I want to see a calendar preview of the effective price per night after all rules apply, so that I can catch mistakes. **M**
  - **AC** Shows which rule produced each night's price — rule precedence must be visible, not guessed
- **HST-PRC-010** — As a Host, I want to bulk-edit prices across a date range. **S**
- **HST-PRC-011** — As a Host, I want to set a deposit percentage. **C** **$**
- **HST-PRC-012** — As a Host, I want to create promo codes for my own listing. **C** **$**
- **HST-PRC-013** — As a Host, I want pricing suggestions based on local demand and comparable listings. **W** **$**
- **HST-PRC-014** — As a Host, I want to see the platform fee and my net take clearly on every price. **M**

### HST-BKG — Booking management

- **HST-BKG-001** — As a Host, I want a list of all bookings, filterable by status, date range, unit and guest. **M**
- **HST-BKG-002** — As a Host, I want to confirm or decline a pending request, with the payment captured on confirm. **M**
- **HST-BKG-003** — As a Host, I want to be notified immediately of a new request, so that I do not lose it. **M**
- **HST-BKG-004** — As a Host, I want pending requests to expire automatically after a set window, so that guests are not left hanging. **S**
- **HST-BKG-005** — As a Host, I want to enable instant booking per unit type. **M**
- **HST-BKG-006** — As a Host, I want to create a manual booking for a walk-in or phone enquiry. **M**
- **HST-BKG-007** — As a Host, I want to record an offline payment against a manual booking. **S**
- **HST-BKG-008** — As a Host, I want to modify a booking's dates or reassign its unit, with an audit trail. **S**
- **HST-BKG-009** — As a Host, I want to review, approve or decline guest modification requests. **S**
- **HST-BKG-010** — As a Host, I want to cancel a booking with a reason, and understand the refund and penalty consequences. **M**
- **HST-BKG-011** — As a Host, I want to check a guest in and out. **M**
- **HST-BKG-012** — As a Host, I want a Today view of arrivals, departures and in-house guests. **M**
- **HST-BKG-013** — As a Host, I want to see guest notes, party composition and special requests on the booking. **M**
- **HST-BKG-014** — As a Host, I want to add internal private notes to a booking, invisible to the guest. **S**
- **HST-BKG-015** — As a Host, I want to see a guest's history with me (repeat visitor, prior issues). **C**
- **HST-BKG-016** — As a Host, I want to charge for damage or extras after checkout. **C** **$**
- **HST-BKG-017** — As a Host, I want to issue a partial or full refund from the booking. **S**
- **HST-BKG-018** — As a Host, I want to export bookings to CSV for my accountant. **S**
- **HST-BKG-019** — As a Host, I want to search bookings by guest name, email or reference. **M**
- **HST-BKG-020** — As a Host, I want to see the full status history of a booking with timestamps and actor. **S**

### HST-COM — Guest communication

- **HST-COM-001** — As a Host, I want a conversation inbox with unread counts and latest-message previews. **M**
- **HST-COM-002** — As a Host, I want to reply inline from the inbox without navigating away. **M**
- **HST-COM-003** — As a Host, I want to be notified of new guest messages by email and in-app. **M**
- **HST-COM-004** — As a Host, I want saved reply templates for common questions. **S** **$**
- **HST-COM-005** — As a Host, I want automated messages on triggers (booking confirmed, 2 days before arrival, after checkout). **S** **$**
- **HST-COM-006** — As a Host, I want to broadcast a message to all guests arriving in a date range (e.g. "water outage Saturday"). **C** **$**
- **HST-COM-007** — As a Host, I want to see my response rate and average response time, so that I can improve it. **S**
- **HST-COM-008** — As a Host, I want to attach a file or photo to a message. **C**
- **HST-COM-009** — As a Host, I want to report an abusive guest message. **S**

### HST-RVW — Reviews & reputation

- **HST-RVW-001** — As a Host, I want to see all my reviews with aggregate and per-category ratings. **M**
- **HST-RVW-002** — As a Host, I want to publicly respond to a review once. **M**
- **HST-RVW-003** — As a Host, I want to be notified when a review is posted. **M**
- **HST-RVW-004** — As a Host, I want to flag a review that breaches policy for moderator attention. **M**
  - **AC** Flagging never hides the review pre-decision; a host cannot silence criticism by flagging it
- **HST-RVW-005** — As a Host, I want to see rating trends over time. **S** **$**
- **HST-RVW-006** — As a Host, I want to see which categories drag my score down. **S** **$**
- **HST-RVW-007** — As a Host, I want to review a guest after their stay. **C**
- **HST-RVW-008** — As a Host, I want reviews released simultaneously (double-blind), so that neither side retaliates. **C**

### HST-ANL — Analytics **$**

- **HST-ANL-001** — As a Host, I want a dashboard with KPI cards: bookings, revenue, occupancy, average rating, upcoming arrivals. **M**
- **HST-ANL-002** — As a Host, I want revenue charted over time with period comparison. **S** **$**
- **HST-ANL-003** — As a Host, I want occupancy rate by unit type. **S** **$**
- **HST-ANL-004** — As a Host, I want to see listing views, and the view-to-booking conversion rate. **S** **$**
- **HST-ANL-005** — As a Host, I want to see where my guests come from geographically. **C** **$**
- **HST-ANL-006** — As a Host, I want average lead time (booking to arrival), so that I can plan marketing. **C** **$**
- **HST-ANL-007** — As a Host, I want cancellation rate and reasons. **C** **$**
- **HST-ANL-008** — As a Host, I want to benchmark against anonymised local averages. **W** **$**
- **HST-ANL-009** — As a Host, I want to export any report to CSV or PDF. **S** **$**
- **HST-ANL-010** — As a Host, I want a scheduled monthly performance email. **C** **$**

### HST-FIN — Finance & payouts

- **HST-FIN-001** — As a Host, I want to connect a bank account and receive payouts automatically. **M**
- **HST-FIN-002** — As a Host, I want to see my payout schedule and next payout date. **M**
- **HST-FIN-003** — As a Host, I want a statement of every transaction: booking amount, platform fee, payment fee, net. **M**
- **HST-FIN-004** — As a Host, I want to reconcile a payout to the individual bookings inside it. **S**
- **HST-FIN-005** — As a Host, I want to download invoices for platform fees. **S**
- **HST-FIN-006** — As a Host, I want VAT handled and displayed correctly for my registration status. **S**
- **HST-FIN-007** — As a Host, I want an annual earnings summary for my tax return. **S**
- **HST-FIN-008** — As a Host, I want to be alerted immediately if a payout fails or my account needs re-verification. **M**
- **HST-FIN-009** — As a Host, I want visibility of chargebacks and disputes affecting me. **S**

### HST-SUB — Subscription & plan

- **HST-SUB-001** — As a Host, I want to see plan tiers with a clear feature comparison. **M**
- **HST-SUB-002** — As a Host, I want a free trial with an explicit end date and a reminder before it ends. **M**
- **HST-SUB-003** — As a Host, I want to subscribe by card without leaving the product. **M**
- **HST-SUB-004** — As a Host, I want to upgrade or downgrade with prorating handled correctly. **S**
- **HST-SUB-005** — As a Host, I want to cancel my subscription and understand exactly what I lose and when. **M**
- **HST-SUB-006** — As a Host, I want a grace period and clear warnings on a failed payment, not sudden cutoff. **M**
  - **AC** Existing confirmed bookings are always honoured, even when a subscription lapses
- **HST-SUB-007** — As a Host, I want to update my card and download billing history. **M**
- **HST-SUB-008** — As a Host, I want annual billing at a discount. **C**
- **HST-SUB-009** — As a Host, I want to buy a featured placement for a fixed period. **S** **$**
- **HST-SUB-010** — As a Host, I want to see what the featured placement actually delivered in views and bookings. **C** **$**
- **HST-SUB-011** — As a Host, I want to see clearly which features my current tier locks, and what upgrading would give me. **M**

### HST-STF — Staff & delegation

- **HST-STF-001** — As a Host, I want to invite a staff member by email. **M**
- **HST-STF-002** — As a Host, I want to assign a preset role (Manager, Receptionist, Groundskeeper, Viewer). **M**
- **HST-STF-003** — As a Host, I want each role to map to explicit permissions per functional area. **M**
  - **AC** Permission model is enforced server-side on every endpoint, not only hidden in the UI
- **HST-STF-004** — As a Host, I want to change a staff member's role inline. **M**
- **HST-STF-005** — As a Host, I want to revoke access immediately. **M**
- **HST-STF-006** — As a Host, I want to scope a staff member to specific properties. **S**
- **HST-STF-007** — As a Host, I want to build a custom role from individual permissions. **C** **$**
- **HST-STF-008** — As a Host, I want an activity log of what staff have done in my account. **S** **$**
- **HST-STF-009** — As a Host, I want to see pending invitations and resend or cancel them. **M**
- **HST-STF-010** — As a Host, I want a seat limit tied to my plan, with a clear upgrade path. **S** **$**

---

## 5. SPL — Supplier (local business partner)

> Farm shops, cafés, bike hire, producers, craft makers — businesses that sell to travellers but do
> not take overnight bookings.

### SPL-ONB — Onboarding & profile

- **SPL-ONB-001** — As a prospective Supplier, I want a landing page explaining the value of reaching travellers in my area. **M**
- **SPL-ONB-002** — As a Supplier, I want a guided onboarding wizard (business type → details → location → photos → payment → review). **M**
- **SPL-ONB-003** — As a Supplier, I want to pick my business category from a structured list. **M**
- **SPL-ONB-004** — As a Supplier, I want to set my trading location, service radius or delivery area. **S**
- **SPL-ONB-005** — As a Supplier, I want to record opening hours, including seasonal and holiday variations. **M**
- **SPL-ONB-006** — As a Supplier, I want to upload a logo and gallery photos. **M**
- **SPL-ONB-007** — As a Supplier, I want to add my website, phone and social links. **M**
- **SPL-ONB-008** — As a Supplier, I want a verified badge after platform checks, so that travellers trust me. **S**
- **SPL-ONB-009** — As a Supplier, I want to save progress and finish onboarding later. **M**
- **SPL-ONB-010** — As a Supplier, I want to preview my public profile before publishing. **M**
- **SPL-ONB-011** — As a Supplier, I want to mark my business temporarily closed. **S**

### SPL-OFR — Offers

- **SPL-OFR-001** — As a Supplier, I want to create an offer with title, description, image, discount and terms. **M**
- **SPL-OFR-002** — As a Supplier, I want to set an offer's validity window. **M**
- **SPL-OFR-003** — As a Supplier, I want to cap total claims and claims per traveller. **M**
- **SPL-OFR-004** — As a Supplier, I want to publish, pause and archive offers. **M**
- **SPL-OFR-005** — As a Supplier, I want to duplicate a past offer as a template. **S**
- **SPL-OFR-006** — As a Supplier, I want to restrict an offer to travellers with a confirmed booking nearby. **C** **$**
- **SPL-OFR-007** — As a Supplier, I want to schedule an offer to go live at a future date. **C**
- **SPL-OFR-008** — As a Supplier, I want offers to require an active subscription to publish, with the rule stated up front. **M**
- **SPL-OFR-009** — As a Supplier, I want to set day-of-week or time-of-day restrictions (e.g. midweek only). **C**
- **SPL-OFR-010** — As a Supplier, I want to sell a product or service directly, not just discount it. **C** **$**

### SPL-RDM — Redemption

- **SPL-RDM-001** — As a Supplier, I want to scan a traveller's QR voucher to redeem it. **M**
  - **AC** Redemption is idempotent and single-use; a re-scan shows "already redeemed" with timestamp
- **SPL-RDM-002** — As a Supplier, I want to enter a voucher code manually when scanning fails. **M**
- **SPL-RDM-003** — As a Supplier, I want immediate, unambiguous feedback: valid, expired, already used, wrong business. **M**
- **SPL-RDM-004** — As a Supplier, I want redemption to work on a phone with poor signal and reconcile later. **S**
- **SPL-RDM-005** — As a Supplier, I want a redemption history with timestamps and staff attribution. **M**
- **SPL-RDM-006** — As a Supplier, I want to reverse a redemption made in error, within a short window. **S**
- **SPL-RDM-007** — As a Supplier, I want a test/sandbox claim to train staff without affecting real numbers. **S**

### SPL-ANL — Analytics, billing & operations

- **SPL-ANL-001** — As a Supplier, I want a dashboard of views, claims and redemptions per offer. **M**
- **SPL-ANL-002** — As a Supplier, I want claim-to-redemption conversion rate, so that I know if my offer actually pulls people in. **S** **$**
- **SPL-ANL-003** — As a Supplier, I want redemption trends over time. **S** **$**
- **SPL-ANL-004** — As a Supplier, I want to export redemption data to CSV. **S**
- **SPL-ANL-005** — As a Supplier, I want to see which nearby stays my customers came from. **C** **$**
- **SPL-ANL-006** — As a Supplier, I want to manage my subscription, card and invoices. **M**
- **SPL-ANL-007** — As a Supplier, I want to buy featured placement in the marketplace. **S** **$**
- **SPL-ANL-008** — As a Supplier, I want Stripe Connect payouts where offers involve payment. **S**
- **SPL-ANL-009** — As a Supplier, I want to invite staff with roles (Manager, Associate, Redeemer, Viewer). **M**
- **SPL-ANL-010** — As a Supplier, I want to see and respond to reviews of my business. **S**
- **SPL-ANL-011** — As a Supplier, I want to raise a support ticket. **M**
- **SPL-ANL-012** — As a Supplier, I want to partner with nearby Hosts to cross-promote. **W** **$**

---

## 6. EXP — Experience Provider

> New role. Guided walks, kayaking, food tours, workshops, wildlife trips. Differs from a Host in
> that inventory is **scheduled sessions with seats**, not nights in a unit.

### EXP-LST — Experience listing

- **EXP-LST-001** — As an Experience Provider, I want to create an experience with title, description, photos, meeting point and duration. **M**
- **EXP-LST-002** — As an Experience Provider, I want to set minimum and maximum group size. **M**
- **EXP-LST-003** — As an Experience Provider, I want to state what is included and what guests must bring. **M**
- **EXP-LST-004** — As an Experience Provider, I want to set fitness level, age limits and accessibility notes. **M**
- **EXP-LST-005** — As an Experience Provider, I want to specify languages the experience is delivered in. **S**
- **EXP-LST-006** — As an Experience Provider, I want to set a precise meeting point on the map with arrival instructions and parking. **M**
- **EXP-LST-007** — As an Experience Provider, I want to record my licences, insurance and qualifications. **S**
- **EXP-LST-008** — As an Experience Provider, I want to publish, pause or seasonally close an experience. **M**

### EXP-SCH — Scheduling & capacity

- **EXP-SCH-001** — As an Experience Provider, I want to create sessions on specific dates and times. **M**
- **EXP-SCH-002** — As an Experience Provider, I want a recurring schedule (every Saturday 10am, April–September). **M**
- **EXP-SCH-003** — As an Experience Provider, I want per-session capacity independent of the default. **M**
- **EXP-SCH-004** — As an Experience Provider, I want to cancel a session and automatically notify and refund every booked guest. **M**
  - **AC** Cancellation triggers refunds and notifications in one action; no manual chasing
- **EXP-SCH-005** — As an Experience Provider, I want to set a booking cutoff (e.g. no bookings within 2 hours). **S**
- **EXP-SCH-006** — As an Experience Provider, I want a minimum-numbers rule that auto-cancels an under-subscribed session at a deadline. **S**
- **EXP-SCH-007** — As an Experience Provider, I want to block dates I am unavailable. **M**
- **EXP-SCH-008** — As an Experience Provider, I want a weather-dependent cancellation policy stated to guests up front. **S**
- **EXP-SCH-009** — As an Experience Provider, I want to move guests from a cancelled session to an alternative in one action. **C**
- **EXP-SCH-010** — As an Experience Provider, I want a calendar of all my sessions and their fill levels. **M**
- **EXP-SCH-011** — As an Experience Provider, I want a waitlist that auto-promotes when someone cancels. **C** **$**

### EXP-OPS — Running the experience

- **EXP-OPS-001** — As an Experience Provider, I want a participant list per session with names, party size and notes. **M**
- **EXP-OPS-002** — As an Experience Provider, I want to check participants in on arrival, on my phone. **M**
- **EXP-OPS-003** — As an Experience Provider, I want the participant list available offline in the field. **S**
- **EXP-OPS-004** — As an Experience Provider, I want emergency contact details for each participant. **S**
- **EXP-OPS-005** — As an Experience Provider, I want participants to sign a waiver digitally before attending. **C** **$**
- **EXP-OPS-006** — As an Experience Provider, I want to message all participants of a session at once. **S**
- **EXP-OPS-007** — As an Experience Provider, I want to assign a guide (staff member) to a session. **S**
- **EXP-OPS-008** — As an Experience Provider, I want per-person, per-group and tiered (adult/child) pricing. **M**
- **EXP-OPS-009** — As an Experience Provider, I want to offer private/exclusive bookings of a whole session. **C** **$**
- **EXP-OPS-010** — As an Experience Provider, I want analytics on bookings, fill rate and revenue per experience. **S** **$**
- **EXP-OPS-011** — As an Experience Provider, I want to see and respond to reviews. **S**
- **EXP-OPS-012** — As an Experience Provider, I want payouts, subscription and staff management identical to Hosts, so that I learn one system. **M**

---

## 7. STF — Staff Member

- **STF-ACC-001** — As an invited Staff Member, I want to accept an invitation and set up my account. **M**
- **STF-ACC-002** — As a Staff Member, I want to see which business(es) I have access to and switch between them. **M**
- **STF-ACC-003** — As a Staff Member, I want to see only the areas my role permits, with no dead links to forbidden pages. **M**
- **STF-ACC-004** — As a Staff Member, I want a clear message when I attempt something outside my permissions, naming who to ask. **S**
- **STF-ACC-005** — As a Staff Member, I want to use my own login and never share the owner's credentials. **M**
- **STF-ACC-006** — As a Staff Member, I want my actions attributed to me in logs and guest-facing messages. **M**
- **STF-ACC-007** — As a Staff Member, I want to leave a business I no longer work for. **S**
- **STF-ACC-008** — As a Staff Member, I want to keep my personal traveller account entirely separate from my work access. **M**
- **STF-RCP-001** — As a Receptionist, I want to check guests in and out. **M**
- **STF-RCP-002** — As a Receptionist, I want to view today's arrivals, departures and in-house guests. **M**
- **STF-RCP-003** — As a Receptionist, I want to create a manual booking for a walk-in. **M**
- **STF-RCP-004** — As a Receptionist, I want to reply to guest messages. **M**
- **STF-RCP-005** — As a Receptionist, I want to take a payment or record one, without seeing full financial reports. **S**
- **STF-GRD-001** — As a Groundskeeper, I want to see which units need turnover today. **S**
- **STF-GRD-002** — As a Groundskeeper, I want to mark a unit as cleaned or ready. **S**
- **STF-GRD-003** — As a Groundskeeper, I want to block a unit for maintenance and note the reason. **S**
- **STF-GRD-004** — As a Groundskeeper, I want a mobile-first view usable while walking the site. **S**
- **STF-RDM-001** — As a Redeemer, I want to scan and redeem vouchers without any other portal access. **M**
- **STF-RDM-002** — As a Redeemer, I want a fast, single-purpose scan screen suitable for a busy counter. **M**
- **STF-VWR-001** — As a Viewer, I want read-only access to bookings and reports for oversight. **S**
- **STF-MGR-001** — As a Manager, I want full operational access without billing or subscription control. **M**
- **STF-MGR-002** — As a Manager, I want to invite and manage other staff, if the owner grants it. **S**

---

## 8. AGT — Support Agent

- **AGT-QUE-001** — As a Support Agent, I want a queue of open tickets sortable by age, priority and SLA risk. **M**
- **AGT-QUE-002** — As a Support Agent, I want to filter tickets by category, role, status and assignee. **M**
- **AGT-QUE-003** — As a Support Agent, I want to assign a ticket to myself or a colleague. **M**
- **AGT-QUE-004** — As a Support Agent, I want tickets auto-categorised and prioritised on creation. **C**
- **AGT-QUE-005** — As a Support Agent, I want SLA timers with visible breach warnings. **S**
- **AGT-TKT-001** — As a Support Agent, I want the full threaded conversation on a ticket. **M**
- **AGT-TKT-002** — As a Support Agent, I want the reporter's context beside the ticket: account, bookings, payments, prior tickets. **M**
  - **AC** Agent never has to leave the ticket to answer a routine question
- **AGT-TKT-003** — As a Support Agent, I want internal notes invisible to the reporter. **M**
- **AGT-TKT-004** — As a Support Agent, I want canned responses/macros for common issues. **S**
- **AGT-TKT-005** — As a Support Agent, I want to change status (open, pending, resolved, closed) with a reason. **M**
- **AGT-TKT-006** — As a Support Agent, I want to merge duplicate tickets. **C**
- **AGT-TKT-007** — As a Support Agent, I want to escalate to a senior agent or engineering. **S**
- **AGT-TKT-008** — As a Support Agent, I want to link a ticket to a booking, listing or payment. **M**
- **AGT-TKT-009** — As a Support Agent, I want to attach files to a reply. **S**
- **AGT-ACT-001** — As a Support Agent, I want to issue a full or partial refund within my authority limit. **S**
  - **AC** Every refund is audit-logged with agent, amount, reason and approval chain
- **AGT-ACT-002** — As a Support Agent, I want to cancel a booking on a user's behalf with a recorded reason. **S**
- **AGT-ACT-003** — As a Support Agent, I want to resend a confirmation, verification or password-reset email. **M**
- **AGT-ACT-004** — As a Support Agent, I want to view a user's account as they see it (read-only impersonation), so that I can reproduce their problem. **S**
  - **AC** Requires explicit reason; time-boxed; loudly banner-flagged in the UI; fully audit-logged
  - **AC** Read-only by default — write actions require separate elevated approval
- **AGT-ACT-005** — As a Support Agent, I want to unlock a locked account after identity verification. **S**
- **AGT-ACT-006** — As a Support Agent, I want to correct an email address on an account. **S**
- **AGT-ACT-007** — As a Support Agent, I want to grant a goodwill credit or voucher within a limit. **C**
- **AGT-RPT-001** — As a Support Agent, I want to see my resolution time and volume. **C**
- **AGT-RPT-002** — As a Support Agent, I want to flag recurring issues so that product can fix the root cause. **S**
- **AGT-RPT-003** — As a Support Agent, I want to send a satisfaction survey on resolution. **C**

---

## 9. MOD — Moderator

- **MOD-RVW-001** — As a Moderator, I want a queue of reviews held by AI moderation, with the model's reason and confidence. **M**
- **MOD-RVW-002** — As a Moderator, I want to approve, reject or edit-and-approve a held review. **M**
- **MOD-RVW-003** — As a Moderator, I want to see the AI's classification alongside the raw text, so that I can judge the judgement. **M**
- **MOD-RVW-004** — As a Moderator, I want reviews auto-published when the model is confidently clean, so that the queue stays small. **M**
- **MOD-RVW-005** — As a Moderator, I want host-flagged reviews in a separate queue with the flag reason. **M**
- **MOD-RVW-006** — As a Moderator, I want to record a policy reason on every rejection. **M**
- **MOD-RVW-007** — As a Moderator, I want to notify the author when their review is rejected, with the reason. **S**
- **MOD-RVW-008** — As a Moderator, I want to handle an author's appeal of a rejection. **C**
- **MOD-RVW-009** — As a Moderator, I want to see a user's moderation history, so that I can spot repeat offenders. **S**
- **MOD-LST-001** — As a Moderator, I want a queue of new listings awaiting approval before going live. **S**
- **MOD-LST-002** — As a Moderator, I want to reject a listing with specific, actionable feedback to the Partner. **S**
- **MOD-LST-003** — As a Moderator, I want visitor-reported listings surfaced for review. **S**
- **MOD-LST-004** — As a Moderator, I want to detect duplicate or near-duplicate listings. **C**
- **MOD-IMG-001** — As a Moderator, I want uploaded images auto-screened for inappropriate content. **S**
- **MOD-IMG-002** — As a Moderator, I want to remove an image and notify the uploader. **S**
- **MOD-IMG-003** — As a Moderator, I want to detect stock or stolen photography. **W**
- **MOD-POL-001** — As a Moderator, I want the content policy visible in the tool, so that decisions are consistent. **S**
- **MOD-POL-002** — As a Moderator, I want to suspend a user's ability to post content. **S**
- **MOD-POL-003** — As a Moderator, I want moderation metrics — queue depth, decision time, AI agreement rate — so that we can tune the model. **S**
- **MOD-POL-004** — As a Moderator, I want to tune AI thresholds without a code deploy. **C**
- **MOD-POL-005** — As a Moderator, I want every decision audit-logged with actor and rationale. **M**

---

## 10. CUR — Curator (editorial content)

### CUR-DIR — Directory entries

> `CUR-PLC` below covers editorial Places (trails, landmarks). These cover the rest of the directory —
> campsites, B&Bs, suppliers, experience operators — before any of them have a Partner account.

- **CUR-DIR-001** — As a Curator, I want to create a directory entry for a business that has no account yet, so that the directory can be populated before the partner side exists. **M**
- **CUR-DIR-002** — As a Curator, I want to record category, type, location, description, photos, website, phone and opening season on an entry. **M**
- **CUR-DIR-003** — As a Curator, I want to bulk-import entries from a spreadsheet or an open data source. **M**
- **CUR-DIR-004** — As a Curator, I want imports deduplicated against existing entries by name and proximity. **M**
- **CUR-DIR-005** — As a Curator, I want to mark an entry unverified, verified, or permanently closed. **M**
- **CUR-DIR-006** — As a Curator, I want an entry to record its data source and last-verified date, so that staleness is measurable. **M**
  - **AC** Every entry carries `sourceType`, `sourceRef` and `lastVerifiedAt` — a directory nobody can audit rots silently
- **CUR-DIR-007** — As a Curator, I want a queue of entries not verified within N months, so that the directory stays trustworthy. **S**
- **CUR-DIR-008** — As a Curator, I want to review traveller-suggested corrections and additions. **S**
- **CUR-DIR-009** — As a Curator, I want to merge duplicate entries without losing travellers' check-offs against either. **S**
  - **AC** Merging re-points existing visit records; no user silently loses a logged visit
- **CUR-DIR-010** — As a Curator, I want to see check-off counts per entry, so that I know which entries matter and deserve better data. **S**
- **CUR-DIR-011** — As a Curator, I want to unpublish an entry without deleting the visit history attached to it. **M**
- **CUR-DIR-012** — As a Curator, I want geographic coverage reporting by county and category, so that I know where the directory is thin. **S**

### CUR-PLC — Places & trails

- **CUR-PLC-001** — As a Curator, I want to create a Place with name, description, category, coordinates and photos. **M**
- **CUR-PLC-002** — As a Curator, I want to record trail attributes: distance, ascent, difficulty, estimated time, route type. **M**
- **CUR-PLC-003** — As a Curator, I want to upload a GPX route and have it render on the map. **S**
- **CUR-PLC-004** — As a Curator, I want to record practical information: parking, toilets, dog rules, accessibility, best season, safety notes. **S**
- **CUR-PLC-005** — As a Curator, I want to mark a place temporarily closed or diverted, with a notice shown to Visitors. **S**
- **CUR-PLC-006** — As a Curator, I want to credit photo and data sources properly. **M**
- **CUR-PLC-007** — As a Curator, I want to bulk-import places from an open data source. **S**
- **CUR-PLC-008** — As a Curator, I want to deduplicate imported places against existing ones. **S**
- **CUR-PLC-009** — As a Curator, I want to preview a Place page before publishing. **M**
- **CUR-PLC-010** — As a Curator, I want to schedule content to publish at a future date. **C**
- **CUR-COL-001** — As a Curator, I want to build a collection ("Ten best coastal walks in Kerry") from places and listings. **S**
- **CUR-COL-002** — As a Curator, I want to write long-form guides with images and embedded maps. **S**
- **CUR-COL-003** — As a Curator, I want to feature a collection on the homepage. **S**
- **CUR-COL-004** — As a Curator, I want to set SEO metadata on every editorial page. **S**
- **CUR-COL-005** — As a Curator, I want seasonal content that rotates automatically. **C**
- **CUR-COL-006** — As a Curator, I want to see which content drives traffic and bookings. **S**
- **CUR-COL-007** — As a Curator, I want traveller-submitted photos and corrections queued for my approval. **C**
- **CUR-COL-008** — As a Curator, I want to see which places are most visited/logged, so that I invest effort where it counts. **C**
- **CUR-COL-009** — As a Curator, I want stale content flagged for review after a set period. **C**

---

## 11. BIZ — Partnerships & lead management

- **BIZ-LED-001** — As Partnerships, I want a CRM of prospective Partners with contact details and status. **S**
- **BIZ-LED-002** — As Partnerships, I want a lead score to prioritise outreach. **S**
- **BIZ-LED-003** — As Partnerships, I want to log every interaction (call, email, visit) against a lead. **S**
- **BIZ-LED-004** — As Partnerships, I want follow-up dates with reminders. **S**
- **BIZ-LED-005** — As Partnerships, I want a pipeline view by stage. **S**
- **BIZ-LED-006** — As Partnerships, I want to import leads from a spreadsheet or open business directory. **C**
- **BIZ-LED-007** — As Partnerships, I want a lead to convert into a Partner account with details pre-filled. **S**
- **BIZ-LED-008** — As Partnerships, I want to see geographic coverage gaps, so that I know where to recruit. **C**
- **BIZ-LED-009** — As Partnerships, I want to send a pre-filled onboarding invitation link. **S**
- **BIZ-LED-010** — As Partnerships, I want conversion metrics by source and by rep. **C**
- **BIZ-LED-011** — As Partnerships, I want to offer a promotional/discounted plan to a strategic Partner. **C**
- **BIZ-LED-012** — As Partnerships, I want to track partner churn and the reasons given. **C**

---

## 12. ADM — Platform Administrator

- **ADM-DSH-001** — As an Admin, I want a dashboard with platform KPIs: users, listings, bookings, GMV, active subscriptions. **M**
- **ADM-DSH-002** — As an Admin, I want a live activity feed of significant platform events. **S**
- **ADM-DSH-003** — As an Admin, I want growth trends over selectable periods. **S**
- **ADM-USR-001** — As an Admin, I want to search and filter all users. **M**
- **ADM-USR-002** — As an Admin, I want a user detail view: roles, bookings, payments, reviews, tickets, audit trail. **M**
- **ADM-USR-003** — As an Admin, I want to deactivate or reactivate a user with a recorded reason. **M**
- **ADM-USR-004** — As an Admin, I want to grant or revoke admin, moderator, curator and agent roles. **M**
  - **AC** Privileged role changes require a second admin's approval and are always audit-logged
- **ADM-USR-005** — As an Admin, I want to force a password reset on a compromised account. **S**
- **ADM-USR-006** — As an Admin, I want to action a GDPR erasure request end to end. **M**
- **ADM-USR-007** — As an Admin, I want to export a user's data on a subject access request. **M**
- **ADM-USR-008** — As an Admin, I want to merge duplicate accounts. **C**
- **ADM-PTR-001** — As an Admin, I want to view and manage all Partners and their listings. **M**
- **ADM-PTR-002** — As an Admin, I want to verify or unverify a Partner. **M**
- **ADM-PTR-003** — As an Admin, I want to suspend a listing immediately in a safety incident. **M**
- **ADM-PTR-004** — As an Admin, I want to see a Partner's subscription and payout health in one place. **S**
- **ADM-PTR-005** — As an Admin, I want to override a subscription (comp, extend trial, waive fee) with a reason. **S**
- **ADM-BKG-001** — As an Admin, I want to search all bookings across the platform. **M**
- **ADM-BKG-002** — As an Admin, I want a full booking detail view with payment and status history. **M**
- **ADM-BKG-003** — As an Admin, I want to intervene in a booking (cancel, refund, reassign) with a mandatory reason. **S**
- **ADM-FIN-001** — As an Admin, I want revenue reporting: GMV, platform fees, subscription revenue, refunds. **M**
- **ADM-FIN-002** — As an Admin, I want to reconcile platform records against Stripe. **S**
- **ADM-FIN-003** — As an Admin, I want to see failed payments, disputes and chargebacks. **M**
- **ADM-FIN-004** — As an Admin, I want CSV export of any financial report. **M**
- **ADM-FIN-005** — As an Admin, I want to configure platform commission rates. **S**
- **ADM-FIN-006** — As an Admin, I want VAT/tax reporting appropriate to Irish and EU obligations. **S**
- **ADM-CFG-001** — As an Admin, I want to manage feature toggles without a deploy. **M**
- **ADM-CFG-002** — As an Admin, I want to roll a feature out to a percentage of users or a named cohort. **C**
- **ADM-CFG-003** — As an Admin, I want to edit the listing category and amenity taxonomy. **S**
  - **AC** Taxonomy is data, not a Java enum — this is the lesson of the current `PropertyType`
- **ADM-CFG-004** — As an Admin, I want to manage subscription plans, prices and entitlements. **S**
- **ADM-CFG-005** — As an Admin, I want to edit legal pages and FAQs without engineering. **S**
- **ADM-CFG-006** — As an Admin, I want to put the platform in maintenance mode with a message. **S**
- **ADM-CFG-007** — As an Admin, I want to configure email and notification templates. **S**
- **ADM-CFG-008** — As an Admin, I want to manage the list of supported counties/regions. **S**
- **ADM-AUD-001** — As an Admin, I want every privileged action audit-logged with actor, timestamp, target and before/after state. **M**
- **ADM-AUD-002** — As an Admin, I want to search and filter the audit log. **M**
- **ADM-AUD-003** — As an Admin, I want audit logs immutable and retained to policy. **M**
- **ADM-AUD-004** — As an Admin, I want to export audit records for compliance. **S**
- **ADM-CMS-001** — As an Admin, I want to broadcast an announcement to a segment of users. **C**
- **ADM-CMS-002** — As an Admin, I want to place a site-wide banner for incidents or campaigns. **S**

---

## 13. OPS — Platform Engineer

- **OPS-OBS-001** — As an Engineer, I want structured logs with correlation IDs across services, so that I can trace a request end to end. **M**
- **OPS-OBS-002** — As an Engineer, I want RED/USE metrics per service in Grafana. **M**
- **OPS-OBS-003** — As an Engineer, I want alerts on error rate, latency, queue depth and payment failure rate. **M**
- **OPS-OBS-004** — As an Engineer, I want business-metric dashboards (bookings/hour, payment success rate), so that an outage is visible in product terms. **S**
- **OPS-OBS-005** — As an Engineer, I want distributed tracing across web, API and moderator. **S**
- **OPS-OBS-006** — As an Engineer, I want uptime and synthetic checks on the critical booking path. **S**
- **OPS-OBS-007** — As an Engineer, I want alert routing and on-call escalation via Alertmanager. **S**
- **OPS-CIC-001** — As an Engineer, I want every PR to run build, unit, integration and E2E tests automatically. **M**
- **OPS-CIC-002** — As an Engineer, I want a merge blocked on failing tests or coverage regression. **M**
- **OPS-CIC-003** — As an Engineer, I want automated security and dependency scanning on every PR. **S**
- **OPS-CIC-004** — As an Engineer, I want an ephemeral preview environment per PR. **C**
- **OPS-CIC-005** — As an Engineer, I want one-command deploy to staging and production. **M**
- **OPS-CIC-006** — As an Engineer, I want a one-command rollback. **M**
- **OPS-CIC-007** — As an Engineer, I want zero-downtime deploys. **S**
- **OPS-CIC-008** — As an Engineer, I want database migrations versioned and applied automatically, with a tested rollback path. **M**
- **OPS-DAT-001** — As an Engineer, I want automated, encrypted, off-site database backups. **M**
- **OPS-DAT-002** — As an Engineer, I want restore tested on a schedule, so that the backup is known to work. **M**
- **OPS-DAT-003** — As an Engineer, I want a realistic anonymised seed dataset for local and staging. **M**
- **OPS-DAT-004** — As an Engineer, I want no production personal data in any lower environment. **M**
- **OPS-DAT-005** — As an Engineer, I want a documented data retention and purge job. **S**
- **OPS-SEC-001** — As an Engineer, I want all secrets in a secret manager, never in the repo or images. **M**
- **OPS-SEC-002** — As an Engineer, I want rate limiting on auth, booking and upload endpoints. **M**
- **OPS-SEC-003** — As an Engineer, I want authorisation enforced server-side on every endpoint and verified by tests. **M**
  - **AC** An automated test suite asserts that each role is *denied* every endpoint outside its scope
- **OPS-SEC-004** — As an Engineer, I want dependency vulnerabilities triaged on a schedule. **S**
- **OPS-SEC-005** — As an Engineer, I want webhook signatures verified and replays rejected. **M**
- **OPS-SEC-006** — As an Engineer, I want uploaded files virus-scanned and content-type validated. **S**
- **OPS-SEC-007** — As an Engineer, I want a documented, rehearsed incident response runbook. **S**
- **OPS-PRF-001** — As an Engineer, I want load tests (Gatling) on search, listing and booking paths in CI. **S**
- **OPS-PRF-002** — As an Engineer, I want a performance budget enforced on the frontend bundle. **S**
- **OPS-PRF-003** — As an Engineer, I want N+1 queries detected in tests, not in production. **S**
- **OPS-PRF-004** — As an Engineer, I want caching on search and listing reads with correct invalidation. **S**
- **OPS-PRF-005** — As an Engineer, I want images served in modern formats at responsive sizes from a CDN. **S**

---

## 14. XCT — Cross-cutting

### XCT-A11Y — Accessibility

- **XCT-A11Y-001** — As a user relying on a screen reader, I want every interactive element correctly labelled and announced. **M**
- **XCT-A11Y-002** — As a keyboard-only user, I want to complete search, booking and partner onboarding without a mouse. **M**
- **XCT-A11Y-003** — As a user with low vision, I want text and UI to meet WCAG 2.2 AA contrast. **M**
- **XCT-A11Y-004** — As a user who zooms, I want the layout to work at 200% without horizontal scrolling. **M**
- **XCT-A11Y-005** — As a keyboard user, I want a visible focus indicator on every focusable element. **M**
- **XCT-A11Y-006** — As a screen-reader user, I want the map to have an equivalent accessible list view. **M**
- **XCT-A11Y-007** — As a user with motion sensitivity, I want animation reduced when I set that OS preference. **S**
- **XCT-A11Y-008** — As a user, I want form errors announced, tied to their field, and written in plain language. **M**
- **XCT-A11Y-009** — As a user, I want images to carry meaningful alt text, including host-uploaded photos. **S**
- **XCT-A11Y-010** — As a team, we want automated accessibility checks in CI so that regressions are caught. **S**

### XCT-I18N — Internationalisation

- **XCT-I18N-001** — As a Visitor, I want the interface in English by default, with the codebase ready for more languages. **M**
- **XCT-I18N-002** — As a Visitor, I want Irish (Gaeilge) as a language option. **C**
- **XCT-I18N-003** — As an international Visitor, I want prices in my currency with the conversion basis stated. **C**
- **XCT-I18N-004** — As a Visitor, I want dates, times and numbers in my locale's format. **S**
- **XCT-I18N-005** — As a Visitor, I want distances in km or miles per my preference. **C**
- **XCT-I18N-006** — As a Partner, I want to provide descriptions in multiple languages. **W**

### XCT-PRF — Performance & resilience

- **XCT-PRF-001** — As a Visitor, I want a listing or search page interactive within 2.5s on a mid-range phone on 4G. **M**
- **XCT-PRF-002** — As a Visitor on rural mobile data, I want the site usable on a slow, flaky connection. **M**
- **XCT-PRF-003** — As a user, I want a clear, actionable error page when something fails, never a blank screen or a stack trace. **M**
- **XCT-PRF-004** — As a user, I want a failed request to be retryable without losing my form input. **S**
- **XCT-PRF-005** — As a user, I want a payment provider outage to fail safely without creating a phantom booking. **M**
  - **AC** Booking creation and payment authorisation are reconciled; orphaned records are swept and reported
- **XCT-PRF-006** — As a user, I want optimistic UI with correct rollback on failure. **C**
- **XCT-PRF-007** — As a user, I want core booking data available as a PWA offline. **C**

### XCT-PRV — Privacy & data protection

- **XCT-PRV-001** — As a user, I want personal data encrypted in transit and at rest. **M**
- **XCT-PRV-002** — As a user, I want to be told exactly what data is shared with a Partner when I book. **M**
- **XCT-PRV-003** — As a user, I want my contact details hidden from a Partner until a booking is confirmed. **S**
- **XCT-PRV-004** — As a user, I want analytics and marketing cookies to fire only after consent. **M**
- **XCT-PRV-005** — As a user, I want my data retained only as long as necessary, with the policy published. **M**
- **XCT-PRV-006** — As a user, I want to be notified promptly in a breach affecting my data. **M**
- **XCT-PRV-007** — As a user, I want my exact home address never exposed publicly through my travel record. **M**
- **XCT-PRV-008** — As a Partner, I want a Data Processing Agreement available. **S**

### XCT-NTF — Notifications

- **XCT-NTF-001** — As a user, I want transactional email for every significant event (booking, payment, cancellation, message). **M**
- **XCT-NTF-002** — As a user, I want in-app notifications with a read/unread state. **M**
- **XCT-NTF-003** — As a user, I want push notifications on mobile, opt-in. **C**
- **XCT-NTF-004** — As a user, I want SMS for time-critical events only, opt-in. **C**
- **XCT-NTF-005** — As a user, I want notifications deduplicated across channels, so that one event does not arrive four times. **S**
- **XCT-NTF-006** — As a user, I want emails to render correctly in every major client, including plain text. **M**
- **XCT-NTF-007** — As the platform, we want email delivery, bounces and complaints tracked, so that deliverability is protected. **S**
- **XCT-NTF-008** — As a user, I want quiet hours respected for non-urgent notifications. **C**

### XCT-SEO — Discoverability

- **XCT-SEO-001** — As the business, we want server-rendered or pre-rendered listing and place pages, so that search engines index them. **S**
- **XCT-SEO-002** — As the business, we want structured data on listings, places and reviews. **S**
- **XCT-SEO-003** — As the business, we want a generated sitemap and correct canonical URLs. **S**
- **XCT-SEO-004** — As the business, we want clean, human-readable, stable URLs. **M**
- **XCT-SEO-005** — As the business, we want 301 redirects preserved through the rename and any URL restructure. **M**

---

## 15. Delivery phases

> **The MVP is defined in `docs/MVP.md`.** It is deliberately much smaller than the sections below:
> a directory of places you can check off. No booking, no payments, no partner portal.
>
> Everything else is sequenced here. Each phase names the question it answers — if a phase's question
> is already answered "no" by the previous phase, do not build it.

### Phase 0 — MVP: the checkable directory

**Question:** will people bother recording where they have been?

See `docs/MVP.md`. Directory browsing, map, entry pages, accounts, check-off, personal list and map,
curator authoring, claim/correction capture. **Nothing transactional.**

**Exit:** a defined proportion of registered users have checked off more than one place, and come
back to do it again. If that fails, no later phase is worth building.

### Phase 1 — Partners own their entries

**Question:** will businesses maintain their own listing for free?

| Epic | Stories |
|---|---|
| Claim → account | `HST-CLM-006..008`, `TRV-ACC-013`, `TRV-ACC-014` |
| Self-service listing | `HST-ONB-003..006`, `HST-ONB-008`, `HST-ONB-011..012`, `HST-LST-001`, `HST-LST-003`, `HST-LST-005..010`, `HST-LST-013..014`, `HST-LST-017` |
| Photos & media | `HST-LST-005..008` |
| Moderation of partner edits | `MOD-LST-001..003`, `MOD-IMG-001..002` |
| Partner support | `SPL-ANL-011`, `AGT-QUE-001..003`, `AGT-TKT-001..005` |

**Exit:** partners keep entries current without being chased. If they will not maintain a free
listing, they will not pay for one — stop and rethink before Phase 3.

### Phase 2 — Enquiry, then booking

**Question:** does the directory actually drive business to partners?

Do this in two steps and measure between them.

**2a — Enquiry only.** A traveller can contact a partner through the platform; the partner replies.
No inventory, no money.
`TRV-MSG-001..003`, `TRV-MSG-006..008`, `HST-COM-001..003`, `HST-COM-007`, `XCT-NTF-001..002`.

**2b — Booking and payment.** Only if 2a proves demand.
`HST-INV-001..007`, `HST-CAL-001..005`, `HST-PRC-001..002`, `HST-PRC-009`, `HST-PRC-014`,
`TRV-BKG-001..005`, `TRV-BKG-007`, `TRV-BKG-010..011`, `TRV-BKG-018..020`,
`TRV-TRP-001..003`, `TRV-TRP-007..008`, `HST-BKG-001..003`, `HST-BKG-005..006`,
`HST-BKG-010..013`, `HST-FIN-001..003`, `HST-FIN-008`, `XCT-PRF-005`.
Plus `VIS-LST-002..008` and `VIS-DSC-006`, which only become meaningful once inventory exists.

**Exit:** bookings complete end to end, money reaches partners, refunds work.

### Phase 3 — Monetisation

**Question:** what will partners pay for?

`HST-SUB-001..008`, `HST-SUB-011`, `SPL-ANL-006`, `ADM-CFG-004`, `ADM-FIN-001..005`.
Then featured placement: `HST-SUB-009..010`, `SPL-ANL-007`.

Gate **management leverage**, never visibility or the ability to receive a booking — see §0.5.

**Exit:** a paying cohort renews past its second billing period.

### Phase 4 — Running a business

**Question:** what keeps them subscribed?

| Epic | Stories |
|---|---|
| Analytics | `HST-ANL-001..010`, `SPL-ANL-001..005` |
| Staff & RBAC | `HST-STF-001..010`, all of `STF` |
| Calendar depth | `HST-CAL-006..013` |
| Pricing depth | `HST-PRC-003..013` |
| Extras | `HST-INV-009..011`, `TRV-BKG-006` |
| Multi-property | `HST-LST-002`, `HST-LST-020..023` |
| Automation | `HST-COM-004..006` |
| Modifications | `TRV-TRP-004..006`, `HST-BKG-008..009` |

### Phase 5 — Reviews & trust

**Question:** can we add public opinion without wrecking the tone?

`TRV-RVW-001..011`, `HST-RVW-001..008`, `VIS-LST-009..011`, `VIS-LST-013..014`,
all of `MOD-RVW`, `MOD-POL-001..005`.

Deliberately late. Reviews pull in the whole moderation service, appeals, and a permanent
partner-relations burden. The private check-off in Phase 0 gives travellers a reason to return
without any of that.

### Phase 6 — The wider marketplace

Suppliers and offers: `SPL-OFR-*`, `SPL-RDM-*`, `TRV-OFR-*`.
Experiences: all of `EXP`.

### Phase 7 — Community & sharing

`TRV-JRN-010..019`, `TRV-SRC-001..011`, `VIS-PLC-005`, `VIS-PLC-008`, `CUR-COL-*`.
Badges, year-in-review, public maps, wishlists, itineraries, editorial collections.

### Ongoing — not a phase

These run from Phase 0 and never stop: `XCT-A11Y`, `XCT-PRV`, `XCT-PRF`, `XCT-SEO`,
`ADM-AUD`, `OPS-*`. Accessibility and privacy in particular are cheaper built in than retrofitted.

### Explicitly deferred

`HST-CAL-010` (OTA two-way sync) · `HST-PRC-013` (dynamic pricing) · `TRV-JRN-017` (following other
travellers) · `MOD-IMG-003` (stolen-photo detection) · `SPL-ANL-012` (host/supplier cross-promotion)
· `XCT-I18N-006` (multilingual partner content) · native apps · a second country.

---

## 16. Story map — the two loops

Everything above serves one of two loops. If a story serves neither, question it.

**Traveller loop:** discover → decide → book → stay → remember → share → discover again.
The *remember* and *share* steps are what generic booking sites do not have. They are the retention
engine and the organic acquisition channel. Under-building them turns the product into a worse
Booking.com.

**Partner loop:** get found → get booked → get paid → manage → improve → renew.
The subscription only renews if *manage* and *improve* deliver ongoing value. This is why analytics,
automation and staff tooling are the correct things to put behind the paywall, and why search
visibility and booking capability must never be.

---

## 17. Open questions

| # | Question | Blocks |
|---|---|---|
| 1 | Commission on bookings, subscription only, or both? | Pricing model, `HST-FIN`, `HST-SUB` |
| 2 | Does the platform take payment for Experiences and Supplier goods, or only for stays? | `EXP-*`, `SPL-OFR-010` |
| 3 | Is a Partner ever allowed more than one Listing on the free tier? | Plan entitlements, `HST-LST-002` |
| 4 | Are Places crowd-sourced from Travellers, or curator-only? | `CUR-*`, moderation load |
| 5 | Ireland-only at launch, or Ireland-first with a design that generalises? | Name choice, taxonomy, i18n, currency |
| 6 | Do we honour bookings taken while a subscription later lapses? (Proposed: yes, always) | `HST-SUB-006` |
| 7 | Who bears refunds on a Partner-initiated cancellation? | `EXP-SCH-004`, `AGT-ACT-001` |
| 8 | Is the public travel map opt-in per visit, or opt-in once globally? | `TRV-JRN-012`, `TRV-JRN-013` |
| 9 | Double-blind reviews or immediate publication? | `HST-RVW-008`, `TRV-RVW-*` |
| 10 | Do we migrate the existing seed/demo data, or truly start clean? | Migration effort, `OPS-DAT-003` |

---

## 18. Counts

| Role | Stories |
|---|---|
| VIS — Visitor | 77 |
| TRV — Traveller | 127 |
| HST — Host | 163 |
| SPL — Supplier | 40 |
| EXP — Experience Provider | 31 |
| STF — Staff | 22 |
| AGT — Support Agent | 24 |
| MOD — Moderator | 21 |
| CUR — Curator | 31 |
| BIZ — Partnerships | 12 |
| ADM — Admin | 39 |
| OPS — Engineer | 32 |
| XCT — Cross-cutting | 44 |
| **Total** | **663** |

Of these, **48** carry explicit acceptance criteria — the ones where getting it wrong is expensive
or where the requirement is genuinely ambiguous. Write the rest at grooming time.

| Priority | Count |
|---|---|
| **M** — Must | 302 |
| **S** — Should | 239 |
| **C** — Could | 115 |
| **W** — Won't this cycle | 7 |

**$** stories (subscription-gated): **41**

> **M** here means "must exist in the finished product", not "must be in the MVP". The MVP is a
> strict subset defined in `docs/MVP.md` — roughly 136 referenced stories, not 302.
