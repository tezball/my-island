---
name: intellij-ide
description: >-
  Use IntelliJ IDEA MCP for Java inspections, build, and symbols. Use when
  the catalog/Spring code needs IDE intelligence, or the engineer has IDEA
  open with MCP Server enabled.
---

# IntelliJ IDEA MCP

Engineers use IntelliJ. Cursor talks to it over MCP (`intellij` in `.cursor/mcp.json` → `./scripts/mcp-intellij`).

**Once (laptop):** IDEA 2025.2+ → Settings → Tools → **MCP Server** → Enable. Open this repo. Reload Cursor MCP. Optional: Cursor plugin inside IDEA (ACP) so the human stays in IDEA.

Prefer IDEA tools for Java call hierarchy, inspections, `build_project`, run configurations. Prefer files/grep for markdown and scripts. Prefer `./scripts/app test` / `services/catalog/mvnw test` when IDEA is **closed** or this is a Cloud Agent (no IDEA in the VM).

Brave mode (run without confirmation) stays **off**. Do not commit SSE URLs with random ports.

If the `intellij` server is red: IDEA is closed or MCP Server is disabled. Continue with Maven/shell. Do not block clone/test.
