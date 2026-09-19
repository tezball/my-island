---
id: PRD-015
ticket: "[[ops/tickets/PRD-015]]"
role: implementer
started: 2026-09-19
finished: 2026-09-19
pr:
cssclasses:
  - run
---

# Run PRD-015 implement

## What happened

Implementer hat from `origin/main` (`9bf0cac`, #94). VisitIntent on existing catalog + Explore PWA. Did not ship PRD-012/013 one-tap.

- Flyway `V9__visit_intent.sql`: unique Guest+Place, marks `been`/`want`/`never`, audit rows
- Session: password login `POST /api/auth/login` plus existing GIS; seed password Guest from compose env
- Private `GET/PUT/DELETE /api/v1/me/…` VisitIntent; public Place JSON `beenCount` only
- Place POST needs import key (`X-Catalog-Import-Key`); guests cannot write Places; import_leads sends the env header
- PWA ticks + private Lists; Vitest list helper; Gherkin + CatalogTest; Playwright not a merge gate

## Result

success — PR open, not merged (Actions automerges ready PRs).

## Follow-up

Reviewer comments only. Seed Guest username/password live in compose env, not in notes.
