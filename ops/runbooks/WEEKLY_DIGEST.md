---
title: Weekly company health digest
type: runbook
---

# Weekly company health digest

**Who:** [[roles/ops-incidents]] (Grok drafts; Cursor commits if needed).
**When:** Monday 09:00 UTC, or the first agent session that week.
**Where:** `ops/daily/YYYY-MM-DD.md` using [[templates/daily]], plus a `ops/runs/digest-YYYY-MM-DD.md` if the daily is too small.

## Collect

1. `python3 ops/scripts/board_sync.py` then read [[BOARD]].
2. Open PRs (review column + GitHub).
3. Blocked tickets — `blocked_reason` must be a sentence, not empty.
4. Grafana MCP if compose is up: anything firing? If Grafana is down, say “local stack not running”, do not fake green.
5. Product: any `PRD-*` in `implement`? There should be none until sign-off.

## Write (fixed headings)

```markdown
## Health
## Board
## PRs
## Incidents
## Product
## Ask Terry
```

## Rules

- No secrets. No customer personal data.
- Do not close tickets from the digest.
- Do not merge PRs to clean the list.
- One ask for Terry, not a laundry list. If nothing is needed, write “none”.

## Activate

This is one of the first three workflows to turn on. CEO: if no digest appeared in 8 days, file a `WF-*` bug against this runbook, do not skip silently.
