---
name: automation
description: >-
  CI/CD, Cursor skills and hooks, Automations, and agent DX for my-island.
  Use when adding a GitHub Action, a SKILL.md, a session hook, or when clone/test/PR is broken.
---

# Automation Expert

Read `ops/agents/roles/automation-expert.md`, `ops/workflow/CI.md`, `ops/workflow/SKILLS.md`, `ops/workflow/AUTOMATIONS.md`, `ops/workflow/SAFETY.md`.

- App code is **disposable scaffolding** (`ops/company/SCAFFOLDING.md`). Do not polish it.
- House stack: `product/STACK.md` — Spring Boot, Vite+React PWA (not Next), Postgres+PostGIS, Grafana MCP. Do not add Next.js or FastAPI CI “for later”.
- Add skills/routines via `ops/runbooks/ADD_SKILL.md`.
- Local/CI: `./scripts/dev test`. Fast vault tests: `python3 -m pytest ops/tests -q -m "not stack"`.
- Do not merge. Do not prod-deploy. Do not rebuild Jenkins.
- One `WF-*` ticket per session.
