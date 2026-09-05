---
title: CEO Briefing
type: product
status: signed
owner: Product
created: 2026-09-01
signed: 2026-09-05
---

# CEO Briefing

What this repository contains, what the company is building, and what remains
open for the business. Source: this folder and `docs/` as of 1 September 2026.
Sign-off: [`SIGNED.md`](SIGNED.md) (CEO, 2026-09-05).

> **This is not a running platform.** The working tree is a **signed** product
> definition (CEO 2026-09-05 — [`SIGNED.md`](SIGNED.md)). There is no application
> code. The house is **Java / Spring Boot** with a **light Vite + React PWA**
> (not Next.js), **PostgreSQL 17 + PostGIS**, Flyway, and Grafana OSS MCP — see
> [`STACK.md`](STACK.md). The previous camping booking product was deleted on
> purpose. Its full codebase is still in git at tag `legacy-platform`. The
> `docs/` folder is history, not the build spec.

| | |
|---|---|
| Current state | Product signed 2026-09-05 ([`SIGNED.md`](SIGNED.md)). No consumer app in tree |
| House | Java / Spring Boot — not open for overturn |
| Client | Light Vite + React PWA (not Next.js) |
| Data | PostgreSQL 17 + PostGIS, Flyway |
| Observability | MCP — Prometheus, Loki, Grafana Alerting, OSS first |
| MVP | 92 stories — signed as Product drafted |
| After MVP | 10 evidence-gated chunks |
| Launch geography | Ireland only |

---

## 1. What you inherited

Two products live in this repo, stacked in time.

**Working tree (current).** Product signed 2026-09-05 ([`SIGNED.md`](SIGNED.md)):
vision, 92-story MVP, 10-chunk expansion, **Halfdoor** public brand
([`NAMING.md`](NAMING.md); Inis internal / affectionate only), **signed house
stack**. Start at [`README.md`](README.md). Backend is Java / Spring Boot.
Client is a light Vite + React PWA (not Next). Database is PostgreSQL 17 +
PostGIS. Host and OIDC provider are still open.

**Previous build (history).** A near-complete camping and glamping booking
platform: guests, campsite owners, local suppliers, admin, Stripe payments,
subscriptions, reviews, messaging. Feature docs from February 2026 called it
launch-ready. Code was removed in a clean-slate commit. Full tree still at tag
`legacy-platform`. Documentation retained in [`../docs/`](../docs/).

### Why the reboot

The old backlog called itself an MVP and contained roughly 285 must-have
stories: full Stripe booking, payouts, partner portals, AI review moderation.
That is a year of work on an untested assumption. The new plan ships the
smallest thing that answers one question: **will people bother to record where
they have been?** If no, later booking work cannot save it. If yes, booking,
partners and marketplace come back — gated on evidence, not on a feature
checklist.

---

## 2. The product

**Halfdoor — places to stay & explore across Ireland.** A mobile directory of
places worth going to — points of interest, experiences, campsites and B&Bs —
that you tick off as you go.

Booking sites forget you were there. Tourism lists are static. Activity
trackers record routes, not destinations. Nobody joins a good directory of
places to a personal record of having been. That join is the product.

The check-off is not a feature bolted onto a directory. It is the reason the
directory gets used twice. Full argument: [`VISION.md`](VISION.md).

### Who it is for

| Audience | When | Why |
|---|---|---|
| Domestic travellers | MVP | Hikers, campers, road-trippers, families. They already go places; they have no good way to keep track. |
| Businesses in the directory | Chunk 1+ | Campsite, B&B, experience and supplier operators. Not the first customer. A two-sided marketplace with one empty side is a website. |
| International tourists | Later | They travel once, so the retention loop does not apply. Valuable once the directory is dense. |

### Principles that constrain the build

| Principle | Consequence |
|---|---|
| Phone first, outdoors, bad signal | One thumb. Bottom tab bar. Rural 3G is the design target. Desktop is a courtesy. |
| The check-off is one tap | No modal, no form, no required fields. Optional detail later. |
| Private by default | Sharing is opt-in, per item. A public map must never reveal where someone lives. |
| Directory quality before scale | A hundred well-described places beat five thousand scraped stubs. Curator-seeded, not user-generated, at launch. |
| Businesses after users | Partners claim listings only once there is traffic worth claiming. |

**The one assumption everything rests on:** will people bother to record where
they have been? The MVP exists to answer that and nothing else. Kill criterion:
if return rate is near zero after a fair launch, do not proceed to any later
chunk.

---

## 3. Release 1 — the checkable directory

Four categories of place, browsable as a list and a map, filterable by category
and county. Any place ticked off in one tap. Ticked places become a personal
list, map and count. Curators author the directory in an admin tool. Nothing is
bookable. Nothing is paid for.

Full backlog: [`MVP.md`](MVP.md).

### The user journey

Open on phone → places near me or the map → tap a place → tap been here (works
before signup, stored on the device) → prompted to create an account to keep
it → My Places: list, map, count → come back next trip.

Three screens carry the whole product: **Explore**, **Place**, **My Places**.

### Story count

| Area | Stories | What it covers |
|---|---|---|
| Directory and browse | 12 | List, category/county/facility filters, search, near me, not-been-yet, cache on no signal |
| Map | 9 | Pins by category, clustering, bottom sheet with check-off, search this area |
| Place detail | 11 | Photos, practical info, directions, price band (not a live rate), nearby, report error |
| Check off | 8 | One tap, pre-signup, stayed vs visited, optional date/note, offline queue |
| My Places | 8 | List, personal map, category counts, 32-county progress, CSV/JSON export |
| Account | 9 | Email + Google/Apple, verify, reset, GDPR export and delete |
| Curator tooling | 14 | Create, bulk import, verify queue, publish, merge duplicates, coverage report |
| Admin | 7 | Users, roles, GDPR actions, audit log, feature flags, platform totals |
| Non-functional | 14 | 2.5s on 4G Android, PWA install, WCAG 2.2 AA, GDPR, backups, CI |

**92 stories in the MVP.** Nine more are listed and deferred so they are not
re-proposed.

### Hard requirements, not aspirations

| Constraint | Bar |
|---|---|
| Installable | Home-screen install on iOS and Android. No app-store gate on the MVP release cycle. |
| Offline | Directory cached. A check-off made with no signal queues and syncs once, with no duplicates. |
| Performance | Explore interactive in under 2.5s on mid-range Android over 4G. |
| Launch content | 500+ published places with photos and descriptions, all 32 counties. Content is the critical path, not code. |

### Explicitly not in Release 1

Booking, payments, subscriptions, partner portals, reviews, messaging, offers,
analytics dashboards, social following, native apps. Every one of these is in
the expansion plan. None is in the MVP.

---

## 4. Everything after, gated on evidence

Chunks 1–3 are sequential. From 4 onward, order can flex. If a chunk's entry
gate is not met, it does not get built. Explorers first, always: a directory
with no audience is worth nothing to a business.

Full plan: [`EXPANSION.md`](EXPANSION.md).

**Explorer loop** — discover → go → tick off → see your record → discover
again. MVP plus chunks 2, 3, 4. Retention engine, and later the acquisition
channel. This is what no booking site has.

**Partner loop** — get found → get contacted → get booked → get paid → manage
→ renew. Chunks 1, 6, 7, 8, 9. Revenue engine. Starts only once the explorer
loop is turning.

| Chunk | Question it answers | Starts when |
|---|---|---|
| 1. Partners claim entries | Will businesses maintain a listing for free? | MVP return rate hits threshold, **and** unsolicited claim requests exist |
| 2. Depth in the record | What turns a checker-off into a habit? | Activation and depth thresholds met |
| 3. Content depth | Does better content drive more check-offs? | Users search for things we do not have, or bounce off thin pages |
| 4. Sharing and social proof | Will users bring other users? | Chunk 2 shipped and retention lifted. Do not share a record people are not keeping. |
| 5. Reviews and trust | Can we add public opinion without drowning in moderation? | Enough claimed partners, and public identity from chunk 4 |
| 6a. Enquiry only | Does the directory drive business to partners? | Chunk 1 proved partners engage. No inventory, no money. |
| 6b. Booking and payment | Do bookings complete and money reach partners? | Enquiry volume and response rate justify inventory |
| 7. Monetisation | What will partners actually pay for? | Partners can point to enquiries or bookings received |
| 8. Running a business | What keeps them subscribed after first renewal? | Paying cohort exists; we can see usage and churn |
| 9. Wider marketplace | Can non-bookable local businesses get value? | Partner density high enough in at least one region |
| 10. Native and offline | Does going native improve the field experience? | Evidence that offline/location limits are costing check-offs |

The old platform maps onto chunks 6–9. Booking, Stripe, owner portals,
subscriptions, staff, supplier vouchers and reviews were already built once.
They are not discarded ideas — they are deferred until the directory has an
audience. Do not rebuild them into Release 1.

---

## 5. The previous platform — still an asset

From January–February 2026 the company built a camping and glamping booking
product for Ireland with an integrated local-supplier marketplace. Roadmap
docs from 12 February 2026 called it launch-ready on features. That is the
product in `docs/` and in git tag `legacy-platform`. It is not what you are
building now.

### Who it served

| Role | What they could do |
|---|---|
| Guests | Browse campsites, book with Stripe, save favourites, message the host, claim local offers, leave reviews, keep a POI travel journal |
| Owners | 14-page portal: lots, calendar, Gantt timeline, check-in, modifications, staff, reviews, billing, Stripe Connect payouts |
| Suppliers | 7-page portal: offers, QR voucher redemption, claims, reviews, staff, subscriptions |
| Admins | 15-page portal: users, bookings, financials, lead CRM, audit log, review moderation, feature flags |

### Stack that was in production-shape locally

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 7, Tailwind 4, React Router 7, Leaflet maps |
| Backend | Spring Boot 3.4, Java 25, Spring Security, JWT |
| Data | PostgreSQL 17, Flyway |
| Payments | Stripe Payment Intents, Subscriptions, Connect Express |
| Ops | Docker, Jenkins CI/CD, Playwright E2E (146 tests), Prometheus/Loki |

### What was still missing then

Transactional email beyond a couple of scheduled templates. Social login.
Account deletion. Staff permissions enforced per section (roles existed;
everyone saw everything). Booking extras as a real entity. Production Stripe
keys, domain and SSL.

The product docs argue those gaps were not the real problem — the real problem
was shipping a booking marketplace before anyone had a reason to come back
between trips.

---

## 6. Decisions that sit with you

Product has already made ten reversible calls (Ireland only, curator content,
check-off before signup, PWA not app stores, `visitType` in the schema from
day one, no reviews in MVP, **Java / Spring house**, **observability via MCP**,
**Postgres+PostGIS**, **light Vite+React PWA not Next**).
See [`VISION.md`](VISION.md) §9 and [`STACK.md`](STACK.md).

These remaining questions are outside product and they gate the build.

- [ ] **Seed content.** Where does it come from — licensed, scraped, open data,
      or written in-house? This is the critical path, not the code. Gates the
      MVP.
- [ ] **Content person.** Do we have, or can we hire, one? A working app over
      an empty directory tests nothing.
- [ ] **Audience.** Is there an existing audience to launch into, or do we
      start cold? Sets launch plan and success thresholds.
- [x] **Stack.** Java / Spring Boot house (locked). Light Vite + React PWA,
      not Next.js. PostgreSQL 17 + PostGIS, Flyway. Logs, metrics and alerts
      via MCP, OSS first. Host and OIDC provider still open. See
      [`STACK.md`](STACK.md). Product freeze: [`SIGNED.md`](SIGNED.md). Log:
      `ops/company/DECISIONS.md`.
- [x] **Public name.** **Halfdoor** is the working / public / company / product
      brand (CEO via Personal PA, 2026-09-05). Subtitle: “Halfdoor — places to
      stay & explore across Ireland.” **Inis** is internal / affectionate only —
      not public marketing. Do not use **Ireland Stays** as a public brand.
      Geographic Inis/Inish place names keep full names. Repo stays
      `my-island`. Marketing solicitor / domain park still recommended later;
      the working public name is locked. Canon: [`NAMING.md`](NAMING.md).
- [ ] **Revenue model** — partner subscription, commission, or advertising.
      Gates chunk 7, not the MVP. Rule already written: never paywall visibility
      or the ability to receive an enquiry.
- [x] **Sign off** [`VISION.md`](VISION.md) and [`MVP.md`](MVP.md).
      Signed 2026-09-05 — [`SIGNED.md`](SIGNED.md). House locked in
      [`STACK.md`](STACK.md). Implementation still requires a `PRD-*`
      ticket in `implement`. Success = return tick rate; kill if near-zero
      after a fair launch.
- [ ] **Engineering loop.** Incoming CTO review: [`ENGINEERING.md`](ENGINEERING.md).
      House is signed in [`STACK.md`](STACK.md). Policy questions (auto-merge,
      prod deploy, Cursor as mandated runtime, staging budget) still sit with you.

### How you will know Release 1 worked

Thresholds must be written down before launch day, not after the data arrives.

| Signal | Question |
|---|---|
| Activation | Share of new accounts that tick at least one place in week one |
| Depth | Median check-offs per active user at 30 days |
| Return | Share who tick something in a later session — **the one that matters** |
| Coverage | Taps on places we have vs searches that find nothing |
| Unsolicited claims | Businesses asking to manage their entry — the gate to chunk 1 |

---

Read this folder first. Treat `docs/` as the previous company. Restore the old
app only from git tag `legacy-platform`.
