---
name: automation
description: >-
  CI/CD, Cursor skills and hooks, Automations, and agent DX for my-island.
  Use when adding a GitHub Action, a SKILL.md, a session hook, or when clone/test/PR is broken.
---

# Automation Expert

Read `docs/ops/agents/roles/automation-expert.md`, `docs/ops/workflow/CI.md`, `docs/ops/workflow/SKILLS.md`, `docs/ops/workflow/AUTOMATIONS.md`, `docs/ops/workflow/SAFETY.md`.

- App code is **disposable scaffolding** (`docs/ops/company/SCAFFOLDING.md`). Do not polish it.
- House stack: `docs/product/STACK.md` — Spring Boot, Vite+React PWA (not Next), Postgres+PostGIS, Grafana MCP. Do not add Next.js or FastAPI CI “for later”.
- Add skills/routines via `docs/ops/runbooks/ADD_SKILL.md`.
- Local/CI: `./scripts/dev test`. Fast vault tests: `python3 -m pytest ops/tests -q -m "not stack"`.
- Do not merge from chat (CI does). Do not invent a prod deploy. Do not rebuild Jenkins.
- One `WF-*` ticket per session.
