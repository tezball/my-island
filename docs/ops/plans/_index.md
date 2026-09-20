---
title: Plans
type: moc
cssclasses:
  - moc
---

# Plans

[[atlas/work]] · [[ops/tickets/_index]]

One plan per ticket, same id. Copy [[ops/templates/plan]]. Planner sets plan `status: approved` and advances the ticket on `main` by default. Use ticket `gate: human` when a person must act.

```dataview
TABLE ticket, status
FROM "ops/plans"
WHERE file.name != "_index"
SORT file.name DESC
```


| Plan | Notes |
|---|---|
| [[PRD-000]] | Program / e2e waves |
| [[PRD-001]] | Catalog skeleton |
| [[PRD-002]] | **Seed DB from research leads** (not spreadsheet) |
| [[PRD-003]] | Explore PWA list+map |
| [[PRD-006]] | Leads store |
| [[PRD-007]] | Wave 1 leads acceptance |
| [[PRD-008]] | Draft Place import |
| [[PRD-009]] | Counsel gate |
| [[PRD-010]] | Username/password **and** Google SSO (GIS stays; seed Guests) |
| [[PRD-011]] | Place detail |
| [[PRD-012]] | Check-off / visits |
| [[PRD-013]] | My Places |
| [[PRD-014]] | Launch quality |
| [[E2E-001]] | Place-stub workshop close-out |
| [[WF-003]] | Cursor Automations enablement |
| [[WF-016]] | Cloud Agent local MCP |
| [[WF-017]] | STACK-E2E drill |
| [[WF-019]] | Place-listing sim |
| [[WF-023]] | Living markdown under `docs/` |
| [[WF-024]] | Apple Silicon PostGIS |
| [[WF-025]] | No prod / auto-merge |
| [[WF-030]] | Vault OS UX |
| [[WF-036]] | Second brain — atlas, folder colour, engineer notes |
| [[WF-037]] | Mock-prod info probe (version + git hash) |
| [[INC-001]] | Mute leftover fishing-journals down-alert email |
| [[WF-038]] | Git worktrees for multi-session Cursor |
| [[WF-031]] | Jenkins local house CI |
| [[WF-034]] | Agent DX pack (Goal 1 list; Goal 2 after review) |
| [[WF-035]] | Test stack today vs want (shift-left, human+agent) |
| [[WF-040]] | Unattended mock-prod from green `main` |
| [[WF-048]] | Main CI after GITHUB_TOKEN squash-merge (dispatch + PR-head gate) |
| [[WF-041]] | Test-server Prom/Loki + Grafana MCP HTTP/SSE (not compose-only) |
| [[WF-042]] | Agent MCP pack (no secrets in docs) |
| [[WF-043]] | Chaos Monkey in CI (retries/fallbacks; not public host every deploy) |
| [[WF-044]] | ZAP-style DAST in CI vs local compose/Testcontainers every merge |
| [[WF-045]] | Trickle/weekly Gatling fail → Jenkins red + Grafana/AM; leftover FJ email stays muted |
| [[WF-046]] | Close public Place writes; seed/import in CI/deploy; Guests write VisitIntent only |
| [[WF-047]] | Human + agent DX handbook (clone/run, MCP, ticket → test box) |
| [[WF-011]] | Playwright cron vs fishing-journals.com (not a merge gate) |
| [[WF-049]] | Cloud→Jenkins **lock C**: Mac mini self-hosted worker triggers host Jenkins (not B HTTPS, not D GHA SSH) |
| [[WF-050]] | Review-gated automerge (no github-actions auto-APPROVE; valid non-author Approve + green CI) |
| [[PRD-015]] | VisitIntent been / want / never; lists private; Place anonymous been count only |
| [[PRD-030]] | Guest been/want on map or list (reuse VisitIntent; not PRD-013) |
| [[PRD-031]] | Mobile place-detail home/back overlay (plan; implement after WF-050) |
| [[PRD-004]] | Booking-site **program** (epic; never implement) |
| [[PRD-016]] | Stay inventory + mock seed (first booking slice to promote) |
| [[PRD-017]] | Guest stay search + listing |
| [[PRD-018]] | Guest book + mock pay |
| [[PRD-019]] | Trips + cancel/refund |
| [[PRD-020]] | Host identity + onboard |
| [[PRD-021]] | Host calendar / pricing |
| [[PRD-022]] | Host reservations |
| [[PRD-023]] | Guest–host messaging |
| [[PRD-024]] | Stay reviews |
| [[PRD-025]] | Host payouts (mock) |
| [[PRD-026]] | Admin moderation / users / catalog |
| [[PRD-027]] | Admin disputes / refunds |
| [[PRD-028]] | Help center + policies |
| [[PRD-029]] | Support inbox |
