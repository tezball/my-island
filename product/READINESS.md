---
title: Implementation readiness
type: product
status: draft
owner: Engineering
created: 2026-09-01
---

# Implementation readiness

Question: a DX-expert engineering team has been hired. Is there enough in
the MVP, the docs, and the CTO review to **define features and implement**?

**Short answer:** enough to freeze a backlog and start the **platform** (skeleton,
CI, MCP, curator API). Not enough to implement the **product** to MVP done
without a spec freeze. Do not treat `docs/` as requirements.

Canonical product: [`MVP.md`](MVP.md), [`VISION.md`](VISION.md).
Canonical house: [`STACK.md`](STACK.md).
CTO proposal (unsigned): [`ENGINEERING.md`](ENGINEERING.md).
`docs/` is the previous company plus a parallel reboot backlog that **conflicts**
with `product/MVP.md`.

---

## 1. Verdict by workstream

| Workstream | Ready? | Why |
|---|---|---|
| Define the feature backlog | **Yes, with a freeze** | `product/MVP.md` has 92 Must stories, a journey, a data sketch, explicit out-of-scope, and a build order. That is enough to slice epics. |
| Implement DX / platform | **Yes, start now** | Java/Spring, Grafana MCP, NFR-09..14, and `ENGINEERING.md` are enough to stand up compose, Dev Container, Actions, Playwright harness, and a Place/Visit schema. Use CTO calls as working assumptions; write them down. |
| Implement user-facing MVP | **Not yet, ~1 week of freeze** | No canonical UI, no facility list, no map/auth/sync contracts, two conflicting MVPs, unsigned client/DB/host, no content. A strong team will invent these; they will invent them twice if `docs/MVP.md` is in the mix. |
| Hit MVP definition of done | **No** | 500 places, success thresholds, content owner, brand, legal pages, Google/Apple apps, staging, backups — none are in the repo. |

---

## 2. What is already enough

A DX team does not need more product prose to do the following.

- **Scope fence.** Four categories, three screens, check-off as the core loop, nothing bookable. Chunk 1+ is forbidden in Release 1 (`VISION.md` §8, `MVP.md` §6).
- **Stories with ACs** on the load-bearing interactions: one-tap tick, pre-signup local store + migrate, `visitType`, `datePrecision`, offline queue idempotency, 32-county count, GDPR export/erasure.
- **Schema landmines** called out: facilities/categories as data not enums; `visitType` and `datePrecision` from commit one; `partnerId` present and unused.
- **Mobile constraints** that are implementable: 44px targets, bottom tab/sheets, 2.5s on 4G, PWA, cache directory, queue writes.
- **Roles for MVP:** Visitor, Explorer, Curator, Admin.
- **Observability constraint:** MCP, OSS Grafana pack.
- **Build order:** skeleton → curator/import → Explore → Place → check-off/My Places → PWA/a11y → admin.

That is a real backlog, not a vision deck.

---

## 3. Spec holes that will fork the implementation

These are not “nice to have in grooming”. Two engineers will ship two products.

| Hole | Stories it hits | What to freeze |
|---|---|---|
| **Two MVPs** | All of them | `product/MVP.md` is canonical. `docs/MVP.md` + `docs/USER_STORIES.md` use different IDs, different categories (STAY/SUPPLIER vs POI/CAMPSITE/BNB), put **claims** and **hike difficulty** and **visit photos / bulk check-off / drop-a-pin** in or next to MVP. Stamp `docs/` as history or the team will implement the wrong app. |
| **Facilities set** | DIR-13, PLC-02, CUR-01 | DIR-13 names parking, toilets, dog-friendly, accessible. That is a hint, not a closed list. Write 8–12 keys as seed data. |
| **Map provider + tiles** | MAP-*, CUR-02, NFR-04 | OSM/Leaflet vs Mapbox vs Google. Cost, ToS, clustering, screen-reader alternative, Ireland default bbox. Offline tiles are explicitly **out**. |
| **Offline sync protocol** | CHK-08, DIR-11, NFR-02/03 | “Idempotent queue” is not a spec. Need: client ids, conflict rule (server wins vs last-write), retry, what “queued” looks like, cache invalidation for directory. |
| **Nearby** | PLC-06 | Radius? Count cap? Same category only? |
| **“Currently open”** | PLC-11 | `openFrom`/`openTo` as month-day? Timezone? What if only a season string? |
| **Import contract** | CUR-04, CUR-05 | Spreadsheet columns, required fields, photo URLs vs files, dedup: name similarity + metres. |
| **Verification SLA** | CUR-08 | “N months” is unset. Pick 6 or 12. |
| **Report taxonomy** | PLC-09, CUR-11 | Wrong hours / closed / duplicate / other — or free text only? |
| **Email types** | ACC-09 | Verify, reset, and what else in MVP? Marketing off by default? |
| **URL scheme** | NFR-08 | `/places/{county}/{slug}` vs `/p/{slug}` |
| **Image pipeline** | CUR-03, NFR-01 | Max size, variants (card/hero), formats, moderation (none in MVP?), EXIF stripping. |
| **Auth providers** | ACC-02 | Google and Apple **are** in MVP. Need Apple Developer + Google Cloud apps, redirect URLs, and a name. Cannot finish signup without them. |
| **PWA chrome** | NFR-03 | Name, icon, splash, theme colour — blocked on `NAMING.md`. Working name is `PLACEHOLDER`. |
| **Legal copy** | NFR-05 | Privacy, terms, cookie categories, retention periods. Not drafted for this product. |
| **Seed data for NFR-14** | All E2E | Anonymised places across 32 counties. No fixture exists. |
| **Instrumentation** | MVP §7, ADM-07 | Event names for activation/depth/return/coverage. Thresholds explicitly **not** set. |
| **UI** | DIR/MAP/PLC/ME | Constraints exist (one thumb, bottom bar). No wireframes for *this* product. `docs/Designs/` is the old campsite booking UI — do not reuse as IA. |
| **a11y for maps** | NFR-04 | “Screen-reader map alternative” has no proposed UX (list fallback is the obvious one; write it). |
| **County set** | ME-04, DIR-03 | “32 counties” includes NI. Confirm ROI vs Ireland+NI. Model as data. |
| **Curator vs admin IA** | CUR-*, ADM-* | Same SPA with roles, or separate host? CTO says same SPA. Unsigned. |
| **Merge duplicates** | CUR-14 | Winning record rules, redirect slugs, visit rewrite. |

CTO review does **not** fill these. It fills how the team operates, not what a Place card contains.

---

## 4. Unsigned engineering calls (safe to assume for a spike)

`ENGINEERING.md` is draft. A DX team should treat these as **working assumptions** and implement behind them, unless CEO overrides in week 0:

| Call | If you wait for a meeting |
|---|---|
| PostgreSQL 17 + PostGIS | Geo work cannot start |
| Vite + React PWA | Two client stacks will appear |
| GitHub Actions + Playwright required | CI will be a science project |
| Dev Container + compose Grafana pack | Agent loop will be laptop folklore |
| No Jenkins, no auto-merge, no agent prod deploy | Someone will port `docs/automation/JENKINS.md` |
| MinIO local / R2 later | Image upload will hit a disk |

Still **blocked on the business**, not assumable by DX:

- Seed content source and a content person (VISION §10 Q1, Q3)
- Cursor as mandated runtime / Cloud Agent budget / always-on staging
- GitHub org + bot user
- EU log residency
- Brand name (blocks PWA, Apple/Google consent screens, emails)
- Success thresholds (blocks “launch”, not “code”)
- Auto-merge / agent-prod policy (CTO already recommended no)

---

## 5. What a DX team should do in week 1

Not “build Explore”. Not “port the old API”.

1. **Spec freeze (product + CTO, one sitting).** Canonical = `product/`. Add a banner to `docs/README.md` and `docs/MVP.md`: historical / superseded. Close the facilities list, URL scheme, nearby rule, verification N, import columns.
2. **Sign or amend `ENGINEERING.md` calls** (DB, client, CI, host class).
3. **Stand up the skeleton:** Dev Container, compose (API, web, Postgres+PostGIS, Grafana, Mailpit, MinIO), `AGENTS.md`, MCP pack (grafana + postgres-RO + GitHub), GitHub Actions with a trivial Playwright health test.
4. **Implement Place + Curator CRUD + CSV import** against the frozen facility list, with 20 fake places in all four categories. That unblocks both content work and Explore.
5. **Do not** start Google/Apple, PWA branding, or 500-place import until name + content source exist.

Code can move in parallel with content. **Launch cannot.**

---

## 6. Direct answer

| Question | Answer |
|---|---|
| Can they define features? | **Yes.** Slice `product/MVP.md` into epics DIR, MAP, PLC, CHK, ME, ACC, CUR, ADM, NFR. Ignore `docs/USER_STORIES.md` for Release 1. |
| Can they implement the platform / DX loop? | **Yes, immediately**, using CTO calls as defaults. |
| Can they implement the product end-to-end without further product work? | **No.** They would be forced to invent facilities, map, sync, import, URLs, and UI — and they would collide with the second MVP in `docs/`. |
| Is the CTO review sufficient as an engineering spec? | **Sufficient for how we work.** Not sufficient as an API, schema, or UX spec. |
| Biggest risk if they start tomorrow with no freeze | Building the `docs/USER_STORIES.md` marketplace-shaped directory (claims, suppliers, hike filters) instead of the 92-story checkable directory. |

Hire value: this team is correctly aimed at the skeleton and the agent loop, which `MVP.md` §8 week 0–2 already said was first. They are **not** unblocked to “implement the MVP” as a black box.
