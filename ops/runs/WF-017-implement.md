---
id: WF-017
ticket: "[[tickets/WF-017]]"
role: implementer
started: 2026-09-06
finished: 2026-09-06
pr: https://github.com/tezball/my-island/pull/36
---

# Run WF-017

Hat: Engineering implementer (Automation owns the ticket; Cloud Agent launches for Automation were blocked). Did not merge. Did not touch [[tickets/WF-015]].

## What happened

Wrote plan [[plans/WF-017]] (`approved` via this implement session). Landed:

- Skill `.cursor/skills/stack-e2e-place-stub/SKILL.md` — description fires on E2E-001 / STACK-E2E / chaos overlay / mcp-grafana catalog scrape
- Runbook [[runbooks/STACK_E2E_PLACE_STUB]] + rows on [[runbooks/_index]] and [[workflow/SKILLS]]
- Pointers from [[workflow/STACK-E2E-place-stub]], [[workflow/LOCAL]], [[workflow/CI]], workshop brief

Copied proven HTTP from [[workflow/LOCAL]] / [[runs/e2e-place-stub-mcp-chaos-2026-09-06]] (stub `categoryId`/`countyId`). Grafana HTTP fallback is Prometheus query + Grafana `/api/ds/query`. Overlay requires `compose.chaos.yml`. Restore is `docker compose -f compose.yml up -d catalog --wait`.

Local prove: pytest 43 passed (`not stack`). Overlay set `SPRING_PROFILES_ACTIVE=chaos,chaos-monkey`; restore unset; health 200. `.github/workflows/ci.yml` still has no chaos profile.

## Result

success — PR #36. Ticket `review`. Human may merge.

## Follow-up

- Reviewer comments only; do not merge
- [[tickets/WF-016]] / [[tickets/WF-018]] stay `ready`
