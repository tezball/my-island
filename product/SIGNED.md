---
title: Signed decisions
type: product
status: signed
owner: Product
created: 2026-09-05
signed: 2026-09-05
---

# Signed decisions

> CEO signed **2026-09-05**. Product canon is this folder. House stack is
> Architecture’s [`STACK.md`](STACK.md) (locked in WF-007). Company OS is `ops/`.

The directory MVP and kill list are **approved as drafted** in this folder
([`VISION.md`](VISION.md), [`MVP.md`](MVP.md), [`BRIEFING.md`](BRIEFING.md),
[`EXPANSION.md`](EXPANSION.md)). This note is the Product-owned decision
record. It does not add stories and does **not** rewrite [`STACK.md`](STACK.md).

---

## Directory MVP — one-pager

**Halfdoor** is a **phone-first Ireland directory** of places worth going to:
points of interest, experiences, campsites, and B&Bs. Browse as a **list and a map**.
**One-tap check-off**, including **before signup** (stored locally, migrate on
account). Ticked places become **My Places** (list, map, count). The directory
is **curator-seeded**, not user-generated at launch.

**Suggest** means near-me, not-been-yet, and nearby — discovery from the
directory, **not ads**.

**Out:** booking, payments, partner portals, reviews, messaging, native apps.

Full backlog remains [`MVP.md`](MVP.md). Expansion remains
[`EXPANSION.md`](EXPANSION.md).

---

## Success, kill, Chunk 1

| | |
|---|---|
| **Success** | **Return rate** — share of people who tick something in a *later session*. That is the habit test. |
| **Kill** | Near-zero return after a fair launch → **no marketplace**. Change the concept or stop. |
| **Chunk 1** | Partners claim entries **only after** return hits threshold **and** unsolicited claim requests exist. |

Activation, depth, coverage, and unsolicited claims stay as drafted in
[`MVP.md`](MVP.md) §7. Thresholds are still written down before launch day.

---

## Kill / archive

| What | Rule |
|---|---|
| [`docs/`](../docs/) | Past company. Banner as history. **Do not implement.** |
| Draft PRs [#2](https://github.com/tezball/my-island/pull/2), [#4](https://github.com/tezball/my-island/pull/4), [#5](https://github.com/tezball/my-island/pull/5) | Past-company. Closed by Orchestrator 2026-09-05 (`WF-008`). |
| Git tag `legacy-platform` | Archaeology only. Restore from there; do not port the old domain into the working tree. |
| Consumer app code | **None** until the ops base is in place and a ticket says so (`PRD-*`, status `implement`). |

---

## House calls signed the same day

| # | Decision | Follow-up |
|---|---|---|
| 1 | Directory MVP + kill list **approved as drafted** in `product/` | Product: this folder is canon |
| 2 | Backend = **Java / Spring always** | Locked in [`STACK.md`](STACK.md) (Architecture, WF-007). Do not rewrite from this note. |
| 3 | UI = **light/fast thin Vite/React-style PWA**; no Next / heavy framework until a proven need | Locked in [`STACK.md`](STACK.md) |
| 4 | **Ruthless bar:** a solid app slice + tools + MCP + an automated agent path from idea to value | Engineering loop (`ops/`, [`ENGINEERING.md`](ENGINEERING.md)) |
| 5 | Public / company / product brand = **Halfdoor**. Subtitle: “Halfdoor — places to stay & explore across Ireland.” **Inis** is internal / affectionate only. Do not use **Ireland Stays** as a public brand. Geographic Inis/Inish place names keep full names. Repo stays `my-island`. | [`NAMING.md`](NAMING.md) |

Host and OIDC remain open. Database is PostgreSQL 17 + PostGIS (see [`STACK.md`](STACK.md)). Working public name is **Halfdoor** ([`NAMING.md`](NAMING.md)).

---

## Status

**Signed by CEO 2026-09-05.** Product canon = `product/`. House = [`STACK.md`](STACK.md). Public brand = **Halfdoor** ([`NAMING.md`](NAMING.md)); Inis internal / affectionate only.
