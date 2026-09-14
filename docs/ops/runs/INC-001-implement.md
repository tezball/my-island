---
id: INC-001
ticket: "[[ops/tickets/INC-001]]"
role: implementer
started: 2026-09-14
finished: 2026-09-14
pr:
cssclasses:
  - run
---

# Run INC-001

## What happened

CEO was emailed that fishing-journals.com is down. Leftover FJ Prometheus `ApiDown` (`up{job="api"}` → `api:8081`) has been firing since the WF-032 app teardown. Alertmanager still had an email receiver.

Muted on the VPS: Alertmanager → `keep` (no email), then Prometheus `groups: []`, Prometheus restarted so the bind-mount picked up. Original files under `/opt/backups/fj-alerts-*`. Script + deploy hook so the next mock-prod deploy does not restore email.

## Result

success — emails stopped on the host; PR lands the durable mute.

## Follow-up

Do not add mock-prod on-call until we mean it ([[ops/tickets/WF-009]]).
