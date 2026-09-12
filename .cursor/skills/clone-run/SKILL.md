---
name: clone-run
description: >-
  Start, stop, and test the house local stack. Use when compose is down, ports
  are wrong, clone/run is broken, or the engineer says app start / app test.
---

# Clone and run

House CLI: `./scripts/app start` | `stop` | `test` | `help`. Wraps `./scripts/dev`. Chaos stays **off**.

```bash
./scripts/app start
./scripts/app test
```

| Thing | URL |
|---|---|
| Grafana | http://127.0.0.1:3030 (`admin` / `admin`) |
| Prometheus | http://127.0.0.1:9091 |
| Jenkins | http://127.0.0.1:8085 |
| Postgres | `127.0.0.1:5433` · `ops_reader` / `ops_reader` · db `ops` |
| Catalog | http://127.0.0.1:8081 |

Vault is **`docs/`** in Obsidian. Detail: `docs/ops/workflow/LOCAL.md`. Tools map: `docs/ops/workflow/AGENT_DX.md`.

If Grafana MCP is red: compose down or MCP not reloaded — not a frontend ticket.

## Must not

- Enable chaos on required CI or default start.
- Invent Next.js / FastAPI / `compose.prod`.
- Require IntelliJ for start/test.
