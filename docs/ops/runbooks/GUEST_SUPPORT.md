---
title: Guest support escalation
type: runbook
---

# Guest support escalation

There is no production guest app yet. Use this when a message arrives anyway (email, social, “I used the old camping site”).

## Triage

| Signal | Do |
|---|---|
| Question about the **old** booking product | Say the booking app is not live. Do not restore `legacy-platform` for them. File `PRD-*` only if canon should change |
| Feature request | [[roles/product]] — `PRD-*` `inbox`, do not promise a date |
| Account / data / “delete my data” | [[roles/trust-safety]] — `INC-*` P0. Do not dump personal data into the vault |
| Abuse, scam, unsafe listing | Trust-safety. Stop public replies that argue the facts |
| “Site down” / payment | [[roles/ops-incidents]] — `INC-*`. There is no prod: say so, still log it |
| Host wants to list | [[roles/host-onboarding]] + [[LISTING_ROLLOUT]] |

## Reply rules

1. Be short. No legal advice.
2. Never ask for passwords or card numbers.
3. Put the ticket id in the reply when one exists (`PRD-003`, `INC-001`).
4. Log a line in today’s [[daily/_index|daily note]].

## Escalate immediately (human)

- Suspected data breach
- Law-enforcement or press
- Child safety
- Anything that needs prod credentials (none should be in this repo)
