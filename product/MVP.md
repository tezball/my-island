---
title: MVP — Release 1
type: product
status: active
owner: Product
created: 2026-09-01
---

# MVP — Release 1

> **Ship:** a mobile web app where you browse a curated directory of Irish places and tick off the
> ones you have been to.
>
> **Tests:** will people bother to record where they have been?

## 1. Scope in one paragraph

Four categories of place — **points of interest, experiences, campsites, B&Bs** — browsable on a
phone as a list and a map, filterable by category and county, each with a detail page. Any place can
be ticked off in one tap. Ticked places accumulate into a personal list, map and count. Curators
create and maintain the directory through an admin tool. Nothing is bookable. Nothing is paid for.

## 2. The user journey

```
open on phone
  → see places near me, or browse the map
  → tap a place, read it
  → tap ✓  "been here"                    ← works before signing up
  → prompted to create an account to keep it
  → My Places: list, map, count
  → come back next trip
```

Three screens carry the whole product: **Explore**, **Place**, **My Places**.

## 3. Mobile-first, concretely

"Mobile first" is a design constraint with specific consequences. These are requirements, not
aspirations.

| Requirement | Detail |
|---|---|
| **One-handed** | All primary actions in the bottom third of the screen. Bottom tab bar. Bottom sheets, not top modals |
| **The tick is always reachable** | A check-off control on the list card, the map pin sheet, and the detail page. Never more than one tap from seeing a place to recording it |
| **Map is a first-class surface** | Not a tab you visit. Explore opens to a map/list toggle with the map as an equal peer |
| **Works on bad signal** | Rural 3G is the design target. Directory data cached; a check-off made offline is queued and syncs on reconnect |
| **Installable** | Installs to the phone home screen with its own icon and splash, and launches without browser chrome. No app-store gate on the MVP release cycle |
| **Location-aware** | "Near me now" is the default first-run view when permission is granted, with a graceful non-permission fallback |
| **Light payloads** | Responsive images, modern formats, lazy-loaded below the fold. Explore is interactive in under 2.5s on mid-range Android over 4G |
| **Legible outdoors** | High contrast, large tap targets (44px minimum), no hover-dependent interaction |
| **Desktop** | Responsive and correct, but not the design target. A wider Explore layout, same components |

## 4. User stories

Priority: **M** = in MVP. **D** = deferred, listed so it is not re-proposed.

### DIR — Directory & browse

- **DIR-01** — As a Visitor, I want to browse all places as a scrollable list on my phone, so that I can see what exists. **M**
  - **AC** Card shows photo, name, category, county, distance from me (when location is granted), and a check-off control
- **DIR-02** — As a Visitor, I want to filter by category — point of interest, experience, campsite, B&B — so that I see the kind of place I want. **M**
  - **AC** Multi-select; category filter is reachable without scrolling
- **DIR-03** — As a Visitor, I want to filter by county, so that I can plan around a region. **M**
- **DIR-04** — As a Visitor, I want to search by name or place, so that I can find something specific. **M**
- **DIR-05** — As a Visitor, I want to sort by distance from me, so that the nearest things come first. **M**
- **DIR-06** — As a Visitor, I want to see how many results match and clear my filters in one tap. **M**
- **DIR-07** — As a Visitor, I want to filter to places I have not been yet, so that I can find something new. **M**
  - **AC** The single most valuable filter in the product. Requires an account
- **DIR-08** — As a Visitor, I want to filter to places I have been, so that I can revisit my record from the directory. **M**
- **DIR-09** — As a Visitor, I want to return to the list at the same scroll position after viewing a place. **M**
- **DIR-10** — As a Visitor, I want a useful empty state when nothing matches, suggesting how to widen my search. **M**
- **DIR-11** — As a Visitor, I want the directory to load from cache when I have no signal. **M**
- **DIR-12** — As a Visitor, I want to filter by trail difficulty and length. **D** → Chunk 3
- **DIR-13** — As a Visitor, I want to filter by facilities (parking, toilets, dog-friendly, accessible). **M**
  - **AC** A small, fixed facility set for MVP. Do not build a taxonomy editor yet

### MAP — Map

- **MAP-01** — As a Visitor, I want to see places as pins on a map, so that I can explore geographically. **M**
- **MAP-02** — As a Visitor, I want pins coloured and iconed by category. **M**
- **MAP-03** — As a Visitor, I want pins to cluster when zoomed out, so that the map stays readable. **M**
- **MAP-04** — As a Visitor, I want to tap a pin for a bottom sheet with photo, name, category and a check-off control. **M**
  - **AC** Check off directly from the sheet without opening the detail page
- **MAP-05** — As a Visitor, I want the map to centre on my location when I allow it. **M**
- **MAP-06** — As a Visitor, I want a "search this area" action after panning, rather than the map refetching constantly. **M**
- **MAP-07** — As a Visitor, I want to toggle between map and list without losing my filters. **M**
- **MAP-08** — As a Visitor, I want pins for places I have already been to look different, so that I can see my coverage as I browse. **M**
- **MAP-09** — As a Visitor, I want the map usable one-handed with standard gestures. **M**
- **MAP-10** — As a Visitor, I want offline map tiles for a downloaded region. **D** → Chunk 8

### PLC — Place detail

- **PLC-01** — As a Visitor, I want a place page with photos, description, category, location map, county and town. **M**
- **PLC-02** — As a Visitor, I want practical information — parking, facilities, access notes, best season, dog policy. **M**
- **PLC-03** — As a Visitor, I want directions to open in my phone's map app. **M**
- **PLC-04** — As a Visitor, I want the operator's website and phone where one exists. **M**
- **PLC-05** — As a Visitor, I want an indicative price band (free, €, €€, €€€) rather than a bookable price. **M**
  - **AC** Never a live rate. This is a directory, not an inventory system
- **PLC-06** — As a Visitor, I want to see nearby places, so that I can build a day out. **M**
- **PLC-07** — As a Visitor, I want to share a place by link or my phone's share sheet. **M**
- **PLC-08** — As a Visitor, I want shared links to preview properly in messaging apps. **M**
- **PLC-09** — As a Visitor, I want to report an error on a place. **M**
- **PLC-10** — As a Visitor, I want to see when the information was last checked. **M**
  - **AC** A directory that nobody can date is a directory nobody can trust
- **PLC-11** — As a Visitor, I want to see opening season and whether it is currently open. **M**
- **PLC-12** — As a Visitor, I want a trail route drawn on the map with a GPX download. **D** → Chunk 3

### CHK — Check off

> The core interaction. Everything else exists to serve it.

- **CHK-01** — As an Explorer, I want to tick a place off in one tap from the list, map sheet or detail page. **M**
  - **AC** One tap. No modal, no required fields, no confirmation step
  - **AC** Immediate visible state change; optimistic, with rollback on failure
- **CHK-02** — As a Visitor, I want to tick places off before I have an account, so that I can try it immediately. **M**
  - **AC** Stored locally; a persistent, non-blocking prompt offers to save it to an account
  - **AC** On signup, local check-offs migrate to the account without loss or duplication
- **CHK-03** — As an Explorer, I want to untick something I ticked by mistake. **M**
- **CHK-04** — As an Explorer, I want to record roughly when I was there — a date, a month, or just a year. **M**
  - **AC** Optional; never blocks the tick. Date precision is stored explicitly so "2019 sometime" is not recorded as 1 January 2019
- **CHK-05** — As an Explorer staying at a campsite or B&B, I want to mark it as *stayed* rather than just *visited*. **M**
  - **AC** Offered only for campsite and B&B categories; defaults to visited elsewhere
  - **AC** `visitType` exists in the schema for every visit from the first commit
- **CHK-06** — As an Explorer, I want to add a short private note to a visit. **M**
- **CHK-07** — As an Explorer, I want my check-offs private by default. **M**
- **CHK-08** — As an Explorer, I want a check-off made with no signal to be queued and sync later. **M**
  - **AC** Queued state visible to the user; sync is idempotent — no duplicates on retry
- **CHK-09** — As an Explorer, I want to attach my own photos to a visit. **D** → Chunk 2
- **CHK-10** — As an Explorer, I want to tick off several places at once. **D** → Chunk 2
- **CHK-11** — As an Explorer, I want to log a place not in the directory. **D** → Chunk 2

### ME — My Places

- **ME-01** — As an Explorer, I want a list of everywhere I have been, newest first. **M**
- **ME-02** — As an Explorer, I want a personal map of everywhere I have been. **M**
- **ME-03** — As an Explorer, I want counts — total places, and a breakdown by category. **M**
- **ME-04** — As an Explorer, I want to see how many of Ireland's 32 counties I have set foot in. **M**
  - **AC** The single most motivating number in the product. Make it prominent
- **ME-05** — As an Explorer, I want to filter my own record by category and county. **M**
- **ME-06** — As an Explorer, I want to tap through from my record to the place page. **M**
- **ME-07** — As an Explorer, I want my record to survive a place being unpublished from the directory. **M**
- **ME-08** — As an Explorer, I want to export my record. **M**
  - **AC** CSV or JSON. Cheap to build, and it signals the record is genuinely mine
- **ME-09** — As an Explorer, I want streaks, badges and milestones. **D** → Chunk 2
- **ME-10** — As an Explorer, I want a shareable public version of my map. **D** → Chunk 4
- **ME-11** — As an Explorer, I want a year-in-review summary. **D** → Chunk 4

### ACC — Account

- **ACC-01** — As a Visitor, I want to sign up with email and password. **M**
- **ACC-02** — As a Visitor, I want to sign up with Google or Apple, so that I can skip a password on a phone. **M**
  - **AC** Typing a password on mobile is the biggest signup drop-off. This is not optional
- **ACC-03** — As an Explorer, I want to verify my email. **M**
- **ACC-04** — As an Explorer, I want to stay signed in on my phone. **M**
- **ACC-05** — As an Explorer, I want to reset a forgotten password. **M**
- **ACC-06** — As an Explorer, I want to set my display name. **M**
- **ACC-07** — As an Explorer, I want to export all my data. **M**
- **ACC-08** — As an Explorer, I want to delete my account and everything in it. **M**
- **ACC-09** — As an Explorer, I want to control what email I receive, and unsubscribe in one tap. **M**

### CUR — Curator tooling

> Unglamorous, and the most likely thing to be under-resourced. **An empty directory is not a
> product.** Budget for content acquisition, not just for the tool.

- **CUR-01** — As a Curator, I want to create a place with name, category, description, location, photos and facilities. **M**
- **CUR-02** — As a Curator, I want to set a place's county, town and coordinates by map pin or address search. **M**
- **CUR-03** — As a Curator, I want to upload and reorder photos, with automatic resizing. **M**
- **CUR-04** — As a Curator, I want to bulk-import places from a spreadsheet. **M**
- **CUR-05** — As a Curator, I want imports deduplicated by name and proximity. **M**
- **CUR-06** — As a Curator, I want to record each place's data source and licence. **M**
- **CUR-07** — As a Curator, I want to set and see a last-verified date on every place. **M**
- **CUR-08** — As a Curator, I want a queue of places not verified in N months. **M**
- **CUR-09** — As a Curator, I want to publish, unpublish or mark a place permanently closed. **M**
- **CUR-10** — As a Curator, I want to preview a place as users will see it on a phone. **M**
- **CUR-11** — As a Curator, I want a queue of user-reported errors. **M**
- **CUR-12** — As a Curator, I want to see check-off counts per place, so that I know where to invest effort. **M**
- **CUR-13** — As a Curator, I want coverage reporting by county and category, so that I can see where the directory is thin. **M**
- **CUR-14** — As a Curator, I want to merge duplicates without losing anyone's check-offs. **M**

### ADM — Admin

- **ADM-01** — As an Admin, I want to search users and view an account. **M**
- **ADM-02** — As an Admin, I want to deactivate an account. **M**
- **ADM-03** — As an Admin, I want to grant and revoke curator and admin access. **M**
- **ADM-04** — As an Admin, I want to action a GDPR export or erasure request. **M**
- **ADM-05** — As an Admin, I want an audit log of privileged actions. **M**
- **ADM-06** — As an Admin, I want feature flags I can toggle without a deploy. **M**
- **ADM-07** — As an Admin, I want to see platform totals — users, places, check-offs, active users. **M**

### NFR — Non-functional

- **NFR-01** — Explore is interactive within 2.5s on a mid-range Android phone on 4G. **M**
- **NFR-02** — The app is usable on rural 3G and degrades gracefully with no signal. **M**
- **NFR-03** — Installs to the home screen on both iOS and Android, with an offline shell that renders before any network call. **M**
- **NFR-04** — WCAG 2.2 AA: contrast, focus, labels, 44px targets, screen-reader map alternative. **M**
- **NFR-05** — GDPR: consent before non-essential cookies, export, erasure, published retention. **M**
- **NFR-06** — A user's home area is never inferable publicly from their record. **M**
  - **AC** Someone who logs their local walks reveals where they live. Nothing is public in MVP; this constraint must survive into Chunk 4
- **NFR-07** — Structured data and link previews on place pages for search and sharing. **M**
- **NFR-08** — Clean, stable, human-readable URLs. **M**
- **NFR-09** — Structured logging, error tracking, uptime and core-path alerting. **M**
  - **AC** Logs, metrics and alerts are queryable through MCP in every environment that runs the app. Human dashboards are not a substitute.
  - **AC** Default is self-hosted OSS: Prometheus, Loki, Grafana Alerting + Alertmanager, accessed by agents via `mcp-grafana` (read-only). Prefer $0. Paid APM is not the system of record.
  - **AC** See `STACK.md`
- **NFR-10** — CI runs build, unit, integration and E2E on every PR; merge blocked on failure. **M**
- **NFR-11** — Automated encrypted backups with a periodically tested restore. **M**
- **NFR-12** — Secrets in a secret manager; rate limiting on auth and write endpoints. **M**
- **NFR-13** — Authorisation enforced server-side on every endpoint, verified by negative tests. **M**
- **NFR-14** — Anonymised seed data for local and staging; no production personal data in lower environments. **M**

**92 stories in the MVP**, plus 9 deferred and listed above so they are not re-proposed.

| Area | In MVP |
|---|---|
| DIR — Directory & browse | 12 |
| MAP — Map | 9 |
| PLC — Place detail | 11 |
| CHK — Check off | 8 |
| ME — My Places | 8 |
| ACC — Account | 9 |
| CUR — Curator tooling | 14 |
| ADM — Admin | 7 |
| NFR — Non-functional | 14 |

## 5. Data model

The minimum that will not need rewriting in Chunk 1.

```
Place
├── id, slug, name, description
├── category          POI | EXPERIENCE | CAMPSITE | BNB
├── county, town, latitude, longitude
├── facilities[]                            small fixed set for MVP
├── priceBand         null | FREE | 1..3    indicative only, never a live rate
├── website, phone
├── openFrom, openTo, permanentlyClosed
├── images[]
├── source            sourceType, sourceRef, licence
├── lastVerifiedAt
├── published
└── partnerId?        null — the Chunk 1 seam, present but unused

Visit
├── id, userId, placeId
├── visitType         VISITED | STAYED     ← from the first commit
├── occurredOn        nullable
├── datePrecision     DAY | MONTH | YEAR | UNKNOWN
├── note?             private
└── createdAt, syncedAt

User
└── id, email, displayName, emailVerified, createdAt, role

Report              user-reported error on a place
Audit               privileged action log
```

**Three things that are expensive to reverse. Get them right in the first commit:**

1. **`category` and `facilities` are data, not enums.** The previous build hard-coded a camping enum
   and could not express a B&B without a migration and a deploy. Do not repeat it.
2. **`visitType` exists for every visit from day one** — even though only campsites and B&Bs surface
   it. Collapsing it into a boolean means later asking every user about every place they logged.
3. **`datePrecision` exists from day one.** Storing "2019 sometime" as a real date is silent data
   loss that surfaces as a wrong timeline years later.

## 6. Out of scope — and why

| Excluded | Why |
|---|---|
| Booking, availability, calendars | Untested demand; the single biggest cost in the whole plan |
| Payments, payouts, refunds | Follows booking |
| Subscriptions, featured placement | Nothing to sell until partners get value |
| Partner accounts and portal | Chunk 1, once there is traffic worth claiming |
| Reviews and ratings | Pulls in the whole moderation stack — Chunk 5 |
| Messaging | Chunk 4 |
| Offers, vouchers, redemption | Chunk 6 |
| Photos on visits, badges, streaks | Chunk 2 — deliberately held back as the first retention lever |
| Public profiles and sharing a map | Chunk 4 |
| Native apps, offline map tiles | Chunk 8 |
| Support ticketing | An email address is enough at this size |

## 7. Success criteria

Set the thresholds before launch, not after the data arrives.

| Signal | Question it answers | Why it matters |
|---|---|---|
| **Activation** — % of new accounts ticking ≥1 place in week one | Is the value obvious? | If low, the first-run experience is wrong |
| **Depth** — median check-offs per active user at 30 days | Is one enough, or do they keep going? | Distinguishes a novelty from a habit |
| **Return** — % who tick something off in a *later session* | **Is this a habit?** | **The one that matters.** Everything else is vanity |
| **Coverage** — % of taps on places we have vs. searches that find nothing | Is our content good enough? | Directs curation spend |
| **Unsolicited claims** — businesses asking to manage their entry | Do partners care unprompted? | The entry gate to Chunk 1 |

**Kill criterion.** If return rate is near zero after a fair launch, do not proceed to any chunk.
Change the concept or stop. That is what the MVP is for.

## 8. Sequencing the build

Roughly, for a small team. Adjust to your capacity — the ordering matters more than the weeks.

| | Focus | Why here |
|---|---|---|
| 0 | **Service skeleton on the house stack** | Java / Spring Boot; Micrometer + structured logs from commit one. See `STACK.md` |
| 1–2 | Data model, service skeleton, auth, CI, environments | Foundations. Get NFR-10..14 in before there is code to retrofit |
| 2–4 | Curator tooling (`CUR-*`) and content import | **Start content acquisition first.** It has the longest lead time and is the usual cause of a slipped launch |
| 3–6 | Explore: list, filters, map (`DIR-*`, `MAP-*`) | The browse surface |
| 5–7 | Place detail (`PLC-*`) | |
| 6–8 | Check-off and My Places (`CHK-*`, `ME-*`) | The core loop. Built last, but designed first |
| 7–9 | Install, offline, performance, accessibility (`NFR-*`) | |
| 9–10 | Admin (`ADM-*`), analytics instrumentation, launch prep | Instrument §7's metrics before launch, not after |

**Content is the critical path, not the code.** A working app over an empty directory tests nothing.
Decide where seed content comes from in week one — see `VISION.md` §10 question 1.

## 9. Definition of done for the MVP

- [ ] 500+ published places with photos and descriptions, spread across all 32 counties
- [ ] Every one of §7's metrics instrumented and visible in a dashboard **before** launch
- [ ] Core loop works end to end on a real mid-range Android phone, outdoors, on mobile data
- [ ] Check off → lose signal → regain signal → the check-off is there, once
- [ ] Installs to the home screen on both iOS and Android, and launches offline
- [ ] WCAG 2.2 AA verified on the three core screens
- [ ] GDPR export and deletion working, not planned
- [ ] Restore from backup tested, not assumed
- [ ] Logs, metrics and core-path alerts queryable through MCP (not only a human dashboard)
- [ ] Success thresholds agreed and written down before launch day
