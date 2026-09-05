---
title: Safety
type: workflow
---

# Safety

Copied from the CTO review. Non-negotiable for agents.

1. **No merge.** Humans merge. Reviewer agents comment only.
2. **No prod deploy.** No SSH, no docker sock against prod, no `compose.prod`.
3. **No prod SQL writes.** Local `ops_reader` is SELECT-only. Prod SQL MCP is off.
4. **Grafana `--disable-write`.** Silences and datasource edits are human.
5. **One ticket per agent session.**
6. **Secrets stay in env / Cursor MCP settings.** Not in `ops/` notes.
7. **Do not rebuild Jenkins** from `docs/automation/`. GitHub PRs + Cursor Automations are the path.
8. **Do not implement product MVP** unless the ticket id starts with `PRD-` and status is `implement`.
9. **Do not polish application code** on `WF-*` tickets. App trees are disposable scaffolding ([[company/SCAFFOLDING]]).
