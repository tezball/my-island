---
name: new-ticket
description: >-
  Create the next WF/PRD/INC ticket file from the template. Slash-only
  (/new-ticket).
disable-model-invocation: true
---

# /new-ticket

Search `docs/ops/tickets/` first. Then:

```bash
python3 ops/scripts/new_ticket.py --prefix WF --type workflow --title "…" --owner automation-expert --area ops --priority P1
```

Product → `--prefix PRD`. Incident → `--prefix INC --type incident`. Then fill Outcome / Verify, `board_sync.py`, land on `main`. Naming: `docs/ops/NAMING.md`.
