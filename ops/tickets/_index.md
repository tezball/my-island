# Tickets

One file per ticket. Copy [[templates/ticket]]. Id prefix `WF-` (this workflow) or `PRD-` (product, later).

Statuses: `inbox` | `ready` | `plan` | `implement` | `review` | `done` | `blocked`

After any status change: `python3 ops/scripts/board_sync.py`
