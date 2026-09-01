# my-island

Product definition for a mobile directory of places in Ireland worth going to — points of interest,
experiences, campsites and B&Bs — that you tick off as you go.

**Engineering work tracker:** open [`ops/`](ops/) as an Obsidian vault. Start at
[`ops/HOME.md`](ops/HOME.md). The current mandate is the **agent workflow**, not the consumer app.

**Product canon:** [`product/BRIEFING.md`](product/BRIEFING.md), then [`product/`](product/).

## Status

Product definition, awaiting sign-off. **No application code yet.** Backend is a
**Java / Spring house**. Logs, metrics and alerts are queried through MCP, OSS
first. Details: [`product/STACK.md`](product/STACK.md).

The team’s tickets, kanban, plans, and run logs live in `ops/` (markdown in git).
Local MCP substrate: `./ops/scripts/start-local.sh`.

The previous build — a camping and glamping booking platform — has had its code, CI and
infrastructure removed. Its documentation is retained in [`docs/`](docs/) for reference.
Read it as history, not as requirements. Full previous codebase: git tag `legacy-platform`.

## Stack

House decisions are in [`product/STACK.md`](product/STACK.md):

- **Java + Spring Boot** for all backend services
- **Logs, metrics and alerts** via MCP (Prometheus, Loki, Grafana Alerting;
  `mcp-grafana`; self-hosted OSS first)

Client framework, database and host remain open. They still have to meet
[`product/MVP.md`](product/MVP.md) §3 and the `NFR-*` stories — most notably:

- Mobile-first, one-handed, installable to a phone home screen without an app-store gate
- Readable and usable offline; writes made offline queue and sync idempotently
- Interactive within 2.5s on a mid-range Android phone over 4G
- Map-heavy, with clustering and location awareness
- A curator-facing content tool alongside the public app
- WCAG 2.2 AA, GDPR export and erasure from day one
