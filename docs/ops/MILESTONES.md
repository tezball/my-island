---
kanban-plugin: basic
---

> Hand-maintained **product roadmap**. Not generated. Do not run `board_sync.py` on this file.
>
> Live engineering work is [[ops/BOARD]] (ticket frontmatter). Canon freeze:
> [`product/MILESTONES.md`](../product/MILESTONES.md). Stories: [`product/MVP.md`](../product/MVP.md).
> Chunks: [`product/EXPANSION.md`](../product/EXPANSION.md). Sign-off: [`product/SIGNED.md`](../product/SIGNED.md).

## Upcoming

- [ ] **M1** Auth + environments — `ACC-*`; staging [[ops/tickets/WF-010]] and remote Grafana [[ops/tickets/WF-004]] blocked; OIDC [[ops/tickets/WF-014]] inbox
- [ ] **M2** Content critical path — [[ops/tickets/PRD-002]] / [[ops/tickets/PRD-007]] / [[ops/tickets/PRD-008]] / [[ops/tickets/PRD-009]] ready; [[ops/tickets/PRD-006]] already landed
- [ ] **M3** Explore — [[ops/tickets/PRD-003]] (`DIR-*`, `MAP-*`)
- [ ] **M4** Place detail — `PLC-*` (child of [[ops/tickets/PRD-000]]; no separate ticket yet)
- [ ] **M5** Core loop — signed CHK/ME (`PRD-012`/`PRD-013`) stay blocked; VisitIntent [[ops/tickets/PRD-015]] **done**; map/list of been/want is [[ops/tickets/PRD-030]]
- [ ] **M6** Launch quality — NFR, GDPR, MCP metrics (`NFR-*`, `ADM-*`)
- [ ] **M7** Launch DoD — 500+ places / 32 counties, §7 metrics, thresholds before launch ([[ops/tickets/PRD-000]])

## Doing

- [ ] **M0** House spine — Spring catalog / compose / CI. **Partial.** Remaining: [[ops/tickets/WF-018]] field-align; [[ops/tickets/WF-016]] / [[ops/tickets/WF-017]] Automation MCP drills; epic [[ops/tickets/WF-000]] (automations [[ops/tickets/WF-003]])

## Done

- [x] **M0 (landed)** Catalog stub [[ops/tickets/PRD-001]] · compose/CI [[ops/tickets/WF-005]] · sim [[ops/tickets/WF-019]] (#31) · restore [[ops/tickets/WF-020]] (#33) · local CLI [[ops/tickets/WF-021]] (#35) · leads store [[ops/tickets/PRD-006]] (#14)

## After MVP (gated)

- [ ] **Chunk 1** Partners claim — return + unsolicited claims
- [ ] **Chunk 2** Personal depth
- [ ] **Chunk 3** Content depth
- [ ] **Chunk 4** Sharing / social
- [ ] **Chunk 5** Reviews / trust
- [ ] **Chunk 6a → 6b** Enquiry, then booking
- [ ] **Chunk 7** Monetisation
- [ ] **Chunk 8** Running a business

## Free Ireland directory (2026-09-26)

Hand-maintained. Canon: [`product/FREE-DIRECTORY.md`](../product/FREE-DIRECTORY.md). One `implement` ticket at a time.

- [ ] **WF-040** Public `gitCommit` equals `origin/main` — **implement now**
- [ ] **PRD-030** Journey (been / ticked off) — `review`; do not re-implement
- [ ] **PRD-032** Kinds on the map, including supplier — `plan`
- [ ] **PRD-033** Free host and supplier drafts — `plan`
- [ ] **PRD-034** Support self-serve and role homes — `plan`
- [ ] **PRD-035** Phone-first look and feel — `plan`

## Booking-site (parked)

Hand-maintained. Children stay `inbox`. Do not promote. Canon: [`product/BOOKING-SITE.md`](../product/BOOKING-SITE.md).

- [ ] **PRD-016** Stay seed — do not promote
- [ ] **PRD-017** Guest search
- [ ] **PRD-018** Book + mock pay
- [ ] **PRD-019** Trips / cancel
- [ ] **PRD-020–022** Host onboard / calendar / reservations
- [ ] **PRD-023–025** Messages / reviews / payouts
- [ ] **PRD-026–027** Admin + disputes
- [ ] **PRD-028–029** Help + support inbox
- [ ] Epic [[ops/tickets/PRD-004]] — never implement
