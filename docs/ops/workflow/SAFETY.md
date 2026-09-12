---
title: Safety
type: workflow
---

# Safety

Copied from the CTO review, then relaxed by CEO 2026-09-12 ([[ops/company/DECISIONS]]). Non-negotiable for agents.

1. **Ready PRs merge themselves.** Non-draft, same-repo PRs are auto-reviewed, approved, and squash-merged when CI `unit` + `catalog` + `stack` are green ([[ops/tickets/WF-025]]). Drafts and forks never auto-merge. Chat agents (planner / implementer / reviewer hats) still do not `gh pr merge` — GitHub Actions does.
2. **There is no production.** CEO lock: this company has no prod and probably never will. Do not invent `compose.prod`, prod SSH, or a GitHub Environment prod gate. Local compose is the runtime.
3. **No prod SQL writes** (vacuous). Local `ops_reader` is SELECT-only. There is no prod SQL MCP to turn on.
4. **Grafana `--disable-write`.** Silences and datasource edits stay off the agent path.
5. **One ticket per agent session.**
6. **Secrets stay in env / Cursor MCP settings.** Not in `ops/` notes.
7. **Do not rebuild Jenkins** from `docs/automation/`. GitHub PRs + Cursor Automations are the path.
8. **Do not implement product MVP** unless the ticket id starts with `PRD-` and status is `implement`.
9. **Do not polish application code** on `WF-*` tickets. App trees are disposable scaffolding ([[ops/company/SCAFFOLDING]]).
10. **House stack is [`product/STACK.md`](../../product/STACK.md).** Java / Spring Boot; light Vite+React PWA (not Next); Postgres+PostGIS; Grafana MCP. Do not recommend FastAPI, Neon, or Vercel as defaults.
