---
id: PRD-010
ticket: "[[ops/tickets/PRD-010]]"
role: implementer
started: 2026-09-22
finished: 2026-09-22
pr:
cssclasses:
  - run
---

# Run PRD-010

## What happened

Username/password signup, email verify, and password reset on the catalog session. Local compose sends mail through Mailpit. Mock-prod stays on log mail unless `CATALOG_MAIL_MODE=smtp`. GIS login and the seeded password Guest stay.

## Result

success — contract test `GuestAuthFlowTest` plus PWA signup/forgot/verify/reset screens.
