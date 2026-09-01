---
title: Cursor Automations
type: workflow
---

# Cursor Automations

Cloud jobs that run the loop when nobody is in the IDE. They do **not** replace local agents. Enable them in the Cursor Automations editor after this vault is on `main` (prompts may `@` files only once those files are committed).

## 1. PR reviewer

| | |
|---|---|
| When | Pull request opened against `tezball/my-island` (not drafts) |
| Does | Review the diff against the linked ticket/plan. Comment. Request changes if safety is violated. |
| Does not | Merge, push, approve as the sole required review for `main` |
| Tools | Comment on PRs |

## 2. Board runner

| | |
|---|---|
| When | Weekdays 09:00 UTC (adjust in editor) |
| Does | Checkout `main`. If a ticket is `ready` with no plan, write the plan on a branch and open a PR. If a ticket is `implement` with an approved plan and no open PR, implement **that one ticket** and open a PR. Stop after one ticket. |
| Does not | Merge, touch more than one ticket, prod |
| Tools | GitHub (PR create via agent), repo checkout |

## 3. Re-review on push

| | |
|---|---|
| When | New commits on an open PR |
| Does | Same as reviewer, shorter: only the new commits |
| Does not | Merge |

## Enablement

These cannot be fully saved from chat until you confirm the draft in the Automations UI. Local loop works without them: open Cursor and say “work the next ready ticket”.
