---
name: mcp-health
description: >-
  Check Grafana, Prometheus, catalog HTTP, and optional IntelliJ MCP.
  Slash-only (/mcp-health).
disable-model-invocation: true
---

# /mcp-health

Read `.cursor/skills/mcp-observe/SKILL.md`. Then run:

```bash
curl -sf http://127.0.0.1:3030/api/health
curl -sS -G 'http://127.0.0.1:9091/api/v1/query' --data-urlencode 'query=up{job="catalog"}'
curl -sf http://127.0.0.1:8081/actuator/health
docker compose ps
```

If Grafana MCP is red, start the stack (`/app-start`) and reload MCP. IntelliJ red is OK when IDEA is closed.
