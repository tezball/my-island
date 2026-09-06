---
title: Milestones
type: product
status: signed
owner: Product
created: 2026-09-06
signed: 2026-09-05
---

# Milestones

> Freeze of the **signed** Release 1 map and gated expansion chunks (CEO 2026-09-05).
> Stories: [`MVP.md`](MVP.md). Expansion: [`EXPANSION.md`](EXPANSION.md). Sign-off:
> [`SIGNED.md`](SIGNED.md). This note does **not** add stories.
>
> Engineering tickets live in [`ops/BOARD.md`](../ops/BOARD.md) (generated). Visual
> roadmap for Obsidian: [`ops/MILESTONES.md`](../ops/MILESTONES.md) (hand-maintained).

## Release 1 — Directory MVP

A phone-first Ireland directory: POIs, experiences, campsites, B&Bs. List + map.
One-tap check-off (including before signup). My Places. Curator-seeded.

**Success** = **return rate** — share of people who tick something in a *later
session* ([`MVP.md`](MVP.md) §7, [`SIGNED.md`](SIGNED.md)).

**Kill** = near-zero return after a fair launch → **no marketplace**, no chunks.
Change the concept or stop.

**Out of MVP:** booking, payments, partner portals, reviews, messaging, native
apps.

Ordering matches [`MVP.md`](MVP.md) §8. Content is the critical path, not code.

| | Focus | Why here | Tickets (when filed) |
|---|---|---|---|
| **M0** | House spine | Spring catalog, compose, CI, agent loop. Foundations before product UI. | [`PRD-001`](../ops/tickets/PRD-001.md) catalog stub **done**. Compose/CI [`WF-005`](../ops/tickets/WF-005.md) **done**. Sim [`WF-019`](../ops/tickets/WF-019.md) **done** (#31). Restore [`WF-020`](../ops/tickets/WF-020.md) **done** (#33). Local CLI [`WF-021`](../ops/tickets/WF-021.md) **done** (#35). Remaining: [`WF-018`](../ops/tickets/WF-018.md) field-align; [`WF-016`](../ops/tickets/WF-016.md) / [`WF-017`](../ops/tickets/WF-017.md) Automation MCP drills. Epic [`WF-000`](../ops/tickets/WF-000.md) still open (automations [`WF-003`](../ops/tickets/WF-003.md)). |
| **M1** | Auth + environments | Accounts (`ACC-*`) and shared envs before there is code to retrofit. | Staging [`WF-010`](../ops/tickets/WF-010.md) and remote Grafana MCP [`WF-004`](../ops/tickets/WF-004.md) **blocked**. OIDC console [`WF-014`](../ops/tickets/WF-014.md) inbox. No consumer-auth `PRD-*` yet. |
| **M2** | Content critical path | Empty directory tests nothing. Longest lead time. | [`PRD-006`](../ops/tickets/PRD-006.md) leads store **done** (#14). [`PRD-002`](../ops/tickets/PRD-002.md) / [`PRD-007`](../ops/tickets/PRD-007.md) / [`PRD-008`](../ops/tickets/PRD-008.md) / [`PRD-009`](../ops/tickets/PRD-009.md) **ready**. |
| **M3** | Explore | List, filters, map (`DIR-*`, `MAP-*`). | [`PRD-003`](../ops/tickets/PRD-003.md) **ready** (not `implement`). |
| **M4** | Place detail | `PLC-*`. | Child of Release 1 epic [`PRD-000`](../ops/tickets/PRD-000.md). No separate ticket yet. |
| **M5** | Core loop + My Places | Check-off (`CHK-*`) and My Places (`ME-*`). Built last, designed first. | Same as M3/M4 — [`PRD-003`](../ops/tickets/PRD-003.md) / [`PRD-000`](../ops/tickets/PRD-000.md). |
| **M6** | Launch quality | NFR, GDPR, MCP metrics (`NFR-*`, `ADM-*`). Instrument §7 **before** launch. | Not filed as `PRD-*` yet. Observe path: Grafana OSS MCP ([`STACK.md`](STACK.md)). |
| **M7** | Launch DoD | 500+ published places across 32 counties; every §7 metric on a dashboard; success thresholds written down **before** launch day. Full list: [`MVP.md`](MVP.md) §9. | Epic [`PRD-000`](../ops/tickets/PRD-000.md). |

## After MVP — chunks (gated)

Do not start a chunk unless its **entry gate** in [`EXPANSION.md`](EXPANSION.md)
is met. Chunks 1–3 are sequential. From 4 onward, order can flex on evidence.
Marketplace epic stays [`PRD-004`](../ops/tickets/PRD-004.md) **inbox**.

| Chunk | Name | Entry gate (short) |
|---|---|---|
| **1** | Partners claim entries | Return hits threshold **and** unsolicited claim requests exist |
| **2** | Personal depth | MVP activation and depth thresholds met |
| **3** | Content depth | Coverage metric shows misses or thin pages |
| **4** | Sharing / social | Chunk 2 shipped and a retention lift demonstrated |
| **5** | Reviews / trust | Chunk 1 has claimed partners; Chunk 4 has public identity |
| **6a** | Enquiry | Chunk 1 proved partners engage. Measure before 6b |
| **6b** | Booking | 6a enquiry volume and response rate justify inventory |
| **7** | Monetisation | Partners can point to enquiries or bookings received |
| **8** | Running a business | Chunk 7 has a paying cohort |

Chunks **9** (wider marketplace) and **10** (native / offline) remain in
[`EXPANSION.md`](EXPANSION.md). They are not Release 1 and are not on this freeze
board.

## Links

- [`SIGNED.md`](SIGNED.md) — CEO sign-off, kill list, Chunk 1 rule
- [`MVP.md`](MVP.md) — 92 stories, §7 metrics, §8 sequence, §9 DoD
- [`EXPANSION.md`](EXPANSION.md) — questions, gates, scope per chunk
- [`STACK.md`](STACK.md) — house (Spring, Vite+React PWA, PostGIS, Grafana MCP)
- [`ops/BOARD.md`](../ops/BOARD.md) — live engineering kanban
- [`ops/MILESTONES.md`](../ops/MILESTONES.md) — this map as Obsidian columns
