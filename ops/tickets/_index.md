# Tickets

One file per ticket. Filename stem **is** the id. Copy a template or run:

```bash
python3 ops/scripts/new_ticket.py --prefix PRD --type story --title "…" --owner eng-backend
```

| Prefix | Use |
|---|---|
| `WF-` | Company OS / agent loop |
| `PRD-` | Product |
| `INC-` | Incidents |

Statuses: `inbox` | `ready` | `plan` | `implement` | `review` | `done` | `blocked`

Types: `epic` | `story` | `bug` | `incident` | `workflow`

Epics stay on [[BOARD]] but `next_ticket.py` skips them. After any status change: `python3 ops/scripts/board_sync.py`. Naming: [[NAMING]].
