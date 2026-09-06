---
title: Expansion Plan
type: product
status: active
owner: Product
created: 2026-09-01
---

# Expansion Plan

> Everything after the MVP, in chunks. Each chunk names the **question it answers** and the
> **evidence required to start it**. If a chunk's entry gate is not met, it does not get built —
> we go back and fix the chunk before it, or we stop.
>
> MVP: `MVP.md`. Vision and principles: `VISION.md`.

## How to read this

A chunk is a shippable increment, not a sprint. Each has:

- **Question** — what we learn by shipping it
- **Entry gate** — the evidence that justifies starting
- **Exit** — how we know it worked
- **Scope** — the stories

Order is by *learning value and dependency*, not by how interesting the work is. Chunks 1–3 are
sequential. From 4 onward, order can flex on evidence.

---

## Chunk 1 — Partners claim their entries

**Question:** will businesses maintain a listing for free?

**Entry gate:** MVP return rate hits its threshold, **and** we have received unsolicited claim
requests. If nobody has asked to manage their entry, there is no demand to serve yet — invest in
content and audience instead.

**Exit:** a majority of claimed entries are updated by their owner without being chased.

### Scope

| Area | Stories |
|---|---|
| Claim | Claim-this-entry action on a place; submit a claim with evidence; claim status visible to the claimant; suggest a correction without claiming; suggest a missing place |
| Admin | Claim queue with approve/reject; approving creates a Partner account linked to the existing place, preserving its check-off history; claims feed a simple lead list |
| Partner | Sign in; edit description, photos, facilities, contact, opening season; preview as a phone user; a partner-confirmed verification badge |
| Guardrails | Partner edits are moderated before publish; audit trail on every partner edit; a partner can never edit another's entry |

**Deliberately not here:** no partner portal beyond editing one entry, no billing, no staff, no
analytics, no inventory. This chunk is a claim form, an edit form and a queue.

**The risk, stated plainly.** Partners get exposure but no transaction. A listing they cannot
monetise may not hold their attention. This chunk exists to find that out cheaply — before we
build booking on the assumption that it will.

---

## Chunk 2 — Depth in the personal record

**Question:** what turns a checker-off into a returning habit?

**Entry gate:** MVP activation and depth thresholds met. Users are ticking things off but we want
more sessions per user.

**Exit:** measurable lift in return rate and check-offs per user against the MVP baseline.

### Scope

| Area | Stories |
|---|---|
| Richer visits | Photos on a visit (private); longer notes; a private personal rating; multiple visits to the same place |
| Faster logging | Bulk check-off from a list; log a place not in the directory by dropping a pin; check off from a photo's location metadata |
| Motivation | Streaks; county-completion progress; category milestones; "you have been to 40% of Kerry" |
| Structure | Personal lists and wishlists; a want-to-go list distinct from a been list; private notes on a wanted place |
| Insight | Personal stats page; timeline by year; first and most recent visit; distance covered |

**Design constraint:** milestones must be earnable by real travel and never by spending. The moment
a badge is purchasable, the record stops being trustworthy and the whole product loses its point.

---

## Chunk 3 — Content depth

**Question:** does better content drive more visits and more check-offs?

**Entry gate:** coverage metric shows users searching for things we do not have, or bouncing off
thin place pages.

**Exit:** places with deep content out-perform thin ones on check-off rate by a clear margin.

### Scope

| Area | Stories |
|---|---|
| Trails | Route lines on the map; distance, ascent, difficulty, estimated time; GPX/KML download; trail closures and diversions; accessibility notes — surface, gates, stiles, gradient |
| Practical depth | Tides, safety notes, best season, parking detail, dog rules, facilities at the place |
| Editorial | Curated collections ("ten coastal walks in Kerry"); long-form guides with embedded maps; seasonal rotation; homepage featuring |
| Discovery | Filter by difficulty and length; "near this trail" cross-links to campsites and B&Bs; themed trails and routes across multiple places |
| Curation ops | Traveller-submitted photos and corrections queued for curator approval; staleness reporting |

---

## Chunk 4 — Sharing and social proof

**Question:** will users bring other users?

**Entry gate:** Chunk 2 shipped and a retention lift demonstrated. Do not build sharing on top of a
record people are not keeping.

**Exit:** organic signups attributable to shared content exceed a set proportion of new accounts.

### Scope

| Area | Stories |
|---|---|
| Sharing | Share a single visit as a card or image; share a public read-only version of my map; year-in-review summary; per-item and global privacy controls |
| Profiles | Optional public profile; display name and avatar; visible counts and coverage |
| Contact | Message a partner about a place; partner replies; notification on reply |
| Growth | Referral links; invite a friend; "X people have been here" counts on place pages |

**Hard constraint, carried from `MVP.md` NFR-06.** Sharing is opt-in, per item, always. A user who
logs their local walks reveals where they live — a public map must never make a home area
inferable. This gets designed before anything ships, not audited after.

---

## Chunk 5 — Reviews and trust

**Question:** can we add public opinion without wrecking the tone or drowning in moderation?

**Entry gate:** Chunk 1 has enough claimed partners that reviews have someone to respond to, and
Chunk 4 has established public identity.

**Exit:** review coverage on popular places, with moderation load inside a sustainable budget.

### Scope

| Area | Stories |
|---|---|
| Reviews | Post a review; category ratings; photos on reviews; edit window; review a place only if it is checked off |
| Partner side | Read reviews; respond once publicly; flag a policy breach without being able to hide criticism |
| Moderation | Automated screening queue with confidence and reason; approve, reject, edit-and-approve; rejection reason to the author; appeals; moderator metrics; per-user moderation history |
| Display | Ratings on place pages; sort and filter reviews; aggregate scores |

**Why this is late.** Reviews pull in an entire moderation service, an appeals process and a
permanent partner-relations burden. The private check-off already gives users a reason to return
without any of it. Add reviews when there is a business reason, not because every product has them.

---

## Chunk 6 — Enquiry, then booking

**Question:** does the directory actually drive business to partners?

**Entry gate:** Chunk 1 proved partners engage. Do this in two steps and measure between them —
do not skip 6a.

**Exit (6a):** enquiry volume and partner response rate justify building inventory.
**Exit (6b):** bookings complete end to end and money reaches partners.

### 6a — Enquiry only

Contact a partner about a stay or experience; structured enquiry with dates and party size; partner
inbox and reply; notification on both sides; enquiry outcome tracking. **No inventory, no money.**

If partners do not answer enquiries, they will not honour bookings. Learn that here, for weeks of
work rather than months.

### 6b — Booking and payment

| Area | Stories |
|---|---|
| Inventory | Bookable units with capacity and price; availability calendar; date blocking; minimum stay |
| Pricing | Base price; seasonal rules; effective-price preview showing which rule applied; platform fee and net take shown clearly |
| Booking | Select dates and party; full price breakdown before paying; instant book and request-to-book; card authorised on request, captured on confirm; SCA handled; retry on failure; confirmation with reference |
| Lifecycle | Trips list; check-in instructions released before arrival; cancel with the refund shown before confirming; refund status |
| Partner | Booking list; confirm or decline; today's arrivals and departures; manual booking for walk-ins; check in and out |
| Money | Payouts to partners; transaction statement; failed-payout alerting |
| Integrity | Double-booking impossible under concurrency; payment-provider outage never leaves a phantom booking |

Only at this point do price filters, fee-inclusive pricing and availability calendars become
meaningful on the browse and place screens.

---

## Chunk 7 — Monetisation

**Question:** what will partners actually pay for?

**Entry gate:** partners are receiving enquiries or bookings and can point to value received.

**Exit:** a paying cohort renews past its second billing period.

### Scope

Plan tiers with a clear comparison; free trial with an explicit end date; subscribe by card in-product;
upgrade and downgrade with prorating; cancel with a clear statement of what is lost and when; grace
period and warnings on failed payment; billing history; featured placement for a fixed period, with
honest reporting of what it delivered.

**Two rules, non-negotiable.**

1. **Gate management leverage, never visibility.** Analytics, automation, staff, integrations and
   bulk tooling go behind the paywall. Being found, and being able to receive an enquiry or booking,
   never do. A partner who cannot be found has no reason to stay.
2. **Confirmed bookings are always honoured**, even when a subscription lapses. The traveller is
   not a hostage in a billing dispute.

---

## Chunk 8 — Running a business

**Question:** what keeps partners subscribed after the first renewal?

**Entry gate:** Chunk 7 has a paying cohort and we can see what they use and where they churn.

**Exit:** churn falls against the Chunk 7 baseline.

### Scope

| Area | Stories |
|---|---|
| Analytics | Views, enquiry and booking conversion, revenue over time, occupancy, guest origin, exports |
| Staff | Invite staff by email; preset roles; permissions enforced server-side; scope to a property; activity log; seat limits by plan |
| Calendar depth | Timeline view; drag to reassign; iCal export and import; arrival-day restrictions; printable arrivals sheet |
| Pricing depth | Weekend and midweek rates; per-person pricing; length-of-stay discounts; early-bird and last-minute; bulk edits |
| Multi-property | Manage several properties under one account with a property switcher |
| Automation | Saved reply templates; triggered guest messages; broadcast to guests in a date range |
| Modifications | Guest-requested date and unit changes; partner approval flow; full modification audit trail |

---

## Chunk 9 — The wider marketplace

**Question:** can local businesses that do not take bookings still get value here?

**Entry gate:** partner density high enough in at least one region to support a local offers market.

### Scope

Supplier profiles and categories; offers with validity windows and claim caps; QR vouchers;
redemption on a phone, idempotent and offline-tolerant; redemption history and reversal; a test mode
for training staff; claim-to-redemption analytics; redeemed vouchers appearing in the traveller's
record.

Experience ticketing: scheduled sessions; recurring schedules; per-session capacity; session
cancellation with automatic refunds and notification; booking cutoffs; minimum-numbers auto-cancel;
weather policy; participant lists offline in the field; digital waivers; guide assignment.

---

## Chunk 10 — Native and offline

**Question:** does going native materially improve the field experience?

**Entry gate:** evidence from real usage that offline and location limits are costing us check-offs —
not because native feels more legitimate.

### Scope

Native iOS and Android; offline map tiles for a downloaded region; background location for
automatic visit suggestions (opt-in, privacy-reviewed); home-screen and lock-screen widgets;
push notifications; camera integration for logging by photo; watch companion.

---

## Deliberately not planned

Recorded so they stop being re-proposed. Revisit only with new evidence.

| | Why not |
|---|---|
| Two-way OTA channel sync | Enormous integration and support cost. Only if partners make it the reason they will not adopt |
| Dynamic pricing suggestions | Needs booking data volume we will not have for years |
| Following other users, feeds, comments | A social network is a different product with different problems. The record is personal by design |
| Multilingual partner-authored content | Translation quality and moderation cost. Revisit with international audience |
| A second country | Not until Ireland is dense and the model is proven |
| AI trip planning | Only once the directory is good enough that recommendations would be worth reading |

---

## The two loops

Every chunk serves one of these. If a proposed piece of work serves neither, question it.

**Explorer loop** — `discover → go → tick off → see your record → discover again`
This is the MVP and Chunks 2, 3, 4. It is the retention engine and, once sharing exists, the
acquisition channel. It is what no booking site has. Under-building it turns this into a worse
Booking.com.

**Partner loop** — `get found → get contacted → get booked → get paid → manage → renew`
This is Chunks 1, 6, 7, 8, 9. It is the revenue engine. It only starts once the Explorer loop is
turning, because a directory with no audience is worth nothing to a business.

**The dependency runs one way.** Explorers first, always.
