---
title: Product Vision
type: product
status: signed
owner: Product
created: 2026-09-01
signed: 2026-09-05
---

# Product Vision

> **Signed** by CEO 2026-09-05 — [`SIGNED.md`](SIGNED.md).
>
> **Working name:** `PLACEHOLDER` — see `NAMING.md`. Not a blocker for MVP build, but must be
> settled before the first public release.

## 1. The product in one sentence

**A mobile directory of places in Ireland worth going to — points of interest, experiences,
campsites and B&Bs — that you tick off as you go.**

## 2. The problem

Two things exist today and neither does this:

| What exists | What it does | What it misses |
|---|---|---|
| Booking sites | Tell you where to sleep | Forget you were ever there. No memory, no record, no reason to return between trips |
| Tourism boards & blogs | Tell you where to go | Static lists. Nothing personal, nothing you can act on or keep |
| Activity trackers | Record what you did | No curated directory of places. They track routes, not destinations |

Nobody joins **a good directory of places** to **a personal record of having been there**. That
join is the product.

## 3. Why this wins

The check-off is not a feature bolted onto a directory. It is the reason the directory gets used
twice.

- A directory alone is consumed once and abandoned.
- A record alone is empty until you fill it, and most people won't.
- **A directory you can tick off** gives you something to do on the first visit and a reason to
  come back on the fiftieth.

The collector instinct is real and durable — 32 counties, the Wild Atlantic Way stops, every
national park, every island. People already keep these lists badly, in notes apps and photo albums.

## 4. Who it is for

**Primary — the MVP audience.** People travelling around Ireland domestically: hikers, campers,
road-trippers, families doing day trips. They already go places; they have no good way to keep track.

**Secondary — from Chunk 1 onward.** The businesses in the directory: campsite owners, B&B owners,
experience operators, local suppliers. They are not the MVP customer and must not be treated as one.

**Explicitly not the first audience.** International inbound tourists. They travel once, so the
retention loop does not apply to them. They become valuable later, once the directory is dense.

## 5. Principles

1. **Mobile first, and we mean phone.** Designed for one thumb, outdoors, in daylight, on bad
   signal. The desktop view is a courtesy, not the target.
2. **The check-off is one tap.** From anywhere a place appears. No modal, no form, no required
   fields. Everything else is optional detail added later.
3. **Private by default.** Your record is yours. Sharing is opt-in, per item, always.
4. **The directory must be good before it is big.** A hundred well-described places beat five
   thousand scraped stubs.
5. **Ship the smallest thing that tests the assumption.** Every phase after the MVP is conditional
   on the one before it working.
6. **Businesses come after users.** A two-sided marketplace with one empty side is a website.

## 6. The one assumption everything rests on

> **Will people bother to record where they have been?**

The MVP exists to answer that and nothing else. If the answer is no, no amount of booking
functionality, partner tooling or monetisation saves the product — and we will have learned it in
weeks instead of a year.

## 7. Roles, over time

| Role | Introduced | Why then |
|---|---|---|
| **Visitor** — browses, unauthenticated | MVP | Must be able to see value before signing up |
| **Explorer** — signed in, checks places off | MVP | The one user we build for first |
| **Curator** — platform staff, authors the directory | MVP | Without them there is no directory |
| **Admin** — platform staff, accounts and config | MVP | Minimum needed to operate |
| **Partner** — a business that claims its entry | Chunk 1 | Only once there is traffic worth claiming |
| **Staff** — delegated partner access | Chunk 6 | Only once partners have work to delegate |
| **Support Agent** | Chunk 4 | An inbox is enough before that |
| **Moderator** | Chunk 5 | Only once there is public user content |

We introduce a role when there is work for it. Not before.

## 8. What we are deliberately not building first

Booking · payments · subscriptions · partner portals · staff permissions · reviews · messaging ·
offers and vouchers · analytics dashboards · social following · native apps.

Every one of these is in the expansion plan. None is in the MVP. Each is gated on evidence from the
phase before it — see `EXPANSION.md`.

## 9. Decisions made, and how to overturn them

I have made these calls to keep the build moving. House/client/data in `STACK.md`
are CEO-locked (2026-09-05). Other product calls are reversible at the stated cost.

| # | Decision | Rationale | Cost to reverse |
|---|---|---|---|
| 1 | **The MVP ships to the phone without an app-store gate** | We need to iterate on the first-run experience daily. A release process gated on store review is the wrong shape for testing an unproven assumption. Whichever technology delivers that is a stack question, not a product one | Low, provided the data layer stays client-agnostic |
| 2 | **Ireland only at launch** | Focus. Density in one country beats thin coverage everywhere. Country/region are still modelled as data | Low |
| 3 | **Curator-seeded directory, not user-generated** | Quality gate. UGC needs moderation we should not build yet | Medium — adds a moderation queue |
| 4 | **Check-off works before signup, stored locally** | Removes the biggest first-run barrier. Prompt to create an account to keep it | Low |
| 5 | **`visitType` (visited / stayed) in the schema from day one, surfaced only for stays** | Costs nothing now; retrofitting means re-asking every user about every entry | High if skipped |
| 6 | **No reviews or ratings in MVP** | Pulls in the entire moderation stack and a permanent partner-relations burden | Low — it is additive |
| 7 | **Java / Spring house** | We already know this stack; a second backend language would split a small team. **Locked CEO 2026-09-05** — Architecture does not overturn. Client is the light Vite+React PWA in `STACK.md`, not Next.js. Product freeze: [`SIGNED.md`](SIGNED.md) | High once services exist |
| 8 | **Logs, metrics and alerts via MCP, OSS first** | Agents cannot operate the platform from a human dashboard. Prometheus + Loki + Grafana Alerting + `mcp-grafana` is $0 and already researched. Paid APM is not the interface | Medium to change backends; not acceptable to drop MCP access |
| 9 | **PostgreSQL 17 + PostGIS, Flyway** | Map/geo is a first-class MVP surface. Signed with the house | High once Place data exists |
| 10 | **Light Vite + React PWA (not Next-heavy)** | Phone-first, installable, Spring owns the API. Heavy full-stack JS needs Architecture + Product | Medium after Explore exists |

## 10. Open questions for the business

These need answers from outside product before the chunks they gate.

| # | Question | Gates |
|---|---|---|
| 1 | Where does the seed content come from — licensed, scraped, open data, or written in-house? | MVP. This is the critical path, not the code |
| 2 | What is the eventual revenue model — partner subscription, commission, or advertising? | Chunk 7 |
| 3 | Do we have, or can we get, a content person? | MVP quality |
| 4 | Is there an existing audience to launch into, or do we start cold? | Launch plan, success thresholds |

Stack is decided: Java / Spring Boot house; light Vite + React PWA (not Next);
PostgreSQL 17 + PostGIS; Flyway; observability via MCP, OSS first. See `STACK.md`.
Host, OIDC provider, and curator-admin depth remain open. Product freeze:
[`SIGNED.md`](SIGNED.md).
