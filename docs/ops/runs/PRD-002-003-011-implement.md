---
id: PRD-002
ticket: "[[ops/tickets/PRD-002]]"
role: implementer
started: 2026-09-12
finished: 2026-09-12
pr:
cssclasses:
  - run
---

# Run PRD-002 / PRD-003 / PRD-011 implement

## What happened

CEO 2026-09-12: fishing-journals.com/explore/ POC is done; next is a **POI directory MVP**. Hats: product, eng-frontend, content-seo, architecture, eng-qa. Synthesis: [[ops/workshops/poi-directory-mvp]].

Reuse [[ops/tickets/PRD-002]] + [[ops/tickets/PRD-003]] + [[ops/tickets/PRD-011]] (already `implement`). No PRD-015.

Landed:

- ~101 Wikidata POIs with P625 + Commons heroes in `data/leads/places.jsonl` (`status=reviewed`). 114 campsites stay `lead`.
- Flyway `V7__place_image.sql`; `APP_SEED_PUBLISH` local compose publish.
- `import_leads.py --place-type poi --require-coords --publish-local`
- Vite + React PWA in `web/`: Explore list + map (MapLibre + Carto), Place detail, nearby, directions.
- Compose `web` on `:5173`. GHA/Jenkins `web` job. Automerge `needs` web.

Local demo: `SKIP_JENKINS=1 ./scripts/app start` → http://127.0.0.1:5173

fishing-journals.com map stays dead until host CSP + geolocation headers ([[ops/runbooks/MOCK_HOST_CSP]]) and a redeploy of this `web/` + POI seed.

## Result

success — PR open; chat does not merge.

## Follow-up

CEO questions in the workshop note. Playwright is [[ops/tickets/WF-011]] (still blocked until the job is written). Counsel [[ops/tickets/PRD-009]]. Deploy [[ops/tickets/WF-013]] / [[ops/tickets/WF-032]].
