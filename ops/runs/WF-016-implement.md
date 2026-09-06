---
id: WF-016
ticket: "[[tickets/WF-016]]"
role: implementer
started: 2026-09-06
finished: 2026-09-06
pr: https://github.com/tezball/my-island/pull/46
---

# Run WF-016

Hat: [[agents/roles/automation-expert]] implementer. Did not merge. Did not expand [[tickets/WF-004]] / [[tickets/WF-010]].

## What happened

Scope split: this PR is **docs / Cloud Agent MCP attach** only. Catalog SELECT grants are Engineering on a separate agent. Grants SQL drafted earlier was **dropped**.

- Plan [[plans/WF-016]] (`approved`) — grants out of scope.
- [[workflow/MCP]] documents dashboard **stdio** attach (cursor.com MCP dropdown / team Integrations). `.cursor/environment.json` cannot register MCP. HTTP PromQL is the equivalent until a human attaches stdio. Same in [[workflow/LOCAL]], [[workflow/STACK-E2E-place-stub]], `AGENTS.md`, [[runbooks/STACK_E2E_PLACE_STUB]].
- **TODO Engineering grants:** no PR yet. Pointer on the ticket and in MCP.md.

This Cloud Agent toolbox still has no `grafana` / `postgres` namespaces (GitHub, Gmail, Calendar, Drive, cursor-cloud). Repo cannot attach them.

Cloud VM: PromQL HTTP `up{job="catalog"}` → **1**. Catalog `place` SELECT is not claimed here.

## Result

success — PR #46 (docs/MCP attach). Ticket `review`. Human may merge this slice. Grants wait on Engineering.

## Follow-up

- Reviewer comments only; do not merge
- Human: add stdio `grafana` / `postgres` on cursor.com if Cloud Agents should get MCP tools, not only HTTP
- Engineering: catalog `ops_reader` SELECT grants PR — cross-link on [[tickets/WF-016]]
