---
cursor:
  subagentId: "bc-ffb4280d-5a23-5813-b416-438bd275b97b"
---

Setup guide: [slack-setup-guide.md](slack-setup-guide.md)

# Slack integration plan

Date: 2026-09-27. Author: draft for Terry (CEO) and the CTO hat. Status: proposal. Nothing in Slack has been created, installed, or messaged. House Alertmanager already targets `#alert` via `SLACK_ALERTS_WEBHOOK` and `ops/observability/alertmanager.slack.yml`.

Company: my-island, a free Ireland listings directory. Public host: https://fishing-journals.com. Owner: Terry (`tezball`). System of record: the vault at `docs/` (tickets, decisions, engineer notes) on `main`. Delivery pipe: GitHub pull requests, GitHub Actions, and local Jenkins. Roster: `docs/ops/agents/_index.md`. People: `docs/ops/company/PEOPLE.md`.

Slack is a set of pipes between hats. It is not a second board, a second decision log, or a status room.

This note does not resume the paused merge and deploy queue. Jenkins deploy posts and Actions pull-request failure posts are a later `WF-*` after Terry accepts this plan. House Alertmanager already posts firing alerts to `#alert` when `SLACK_ALERTS_WEBHOOK` is set.

## 1. Principle

Decisions, tickets, and the board stay in the vault, and the diff stays on the pull request; Slack may carry only a one-line handoff for direction, a feature, architecture, a deploy, a firing alert, or a pull-request failure, with a link back to that record.

A message with no link is not done. A direction is done when the same sentence is in `docs/ops/company/DECISIONS.md`. A feature is done when a `PRD-*` ticket exists. An architecture point is done when a plan, ticket, or pull request exists. A deploy, a firing alert, and a pull-request failure may live only as the Slack line, because Jenkins, Grafana, and the GitHub check are already the record.

## 2. Channels

Six channels. No `#general`, no `#status`, no per-hat rooms, no channel for dormant roles.

Seat map used below: CEO is Terry. PO is the `product` hat. CTO is the `architecture` hat. Engineer agents are `eng-frontend`, `eng-backend`, `eng-qa`, `eng-infra`, `eng-security`, `automation-expert`, and `ops-incidents`. The orchestrator reads every channel and posts in none; the board is that hat’s pipe. `business`, `content-seo`, `trust-safety`, `guest-support`, and `host-onboarding` are not members.

Everyone in the seat map may read all six. Customers are not in the workspace. The CI bot is not a member; it posts through webhooks.

| Channel | Purpose | May post | Pipes to | Must not be posted |
|---|---|---|---|---|
| `#direction` | CEO sets company direction | CEO | `#product` when the direction changes what we build, and `docs/ops/company/DECISIONS.md` for the sentence itself | Feature specs, architecture debate, deploy lines, alerts, CI noise, secrets |
| `#product` | PO on current and new features | PO | `#architecture` when the feature needs a shape, and a `PRD-*` ticket for the work | Direction locks, stack arguments, ticket-status chatter, secrets |
| `#architecture` | CTO with engineers across the org | CTO, engineer agents | A vault plan, ticket, or pull request (`to: record` ends the chat) | A feature wishlist with no ticket, deploy logs, guest data, secrets |
| `#deploy` | One line each time `deploy-mock-prod` finishes | CI/deploy bot | The Jenkins build and https://fishing-journals.com/actuator/info. On failure, one extra line in `#alert` | Green CI for pull requests, log paste, smoke JSON, SSH output, secrets |
| `#alert` | House alerts that are firing | CI/deploy bot. `ops-incidents` may post one follow-up once an `INC-*` exists | The Grafana alert. An `INC-*` only if ops-incidents files one in the vault | Resolved noise, leftover fishing-journals email, log dumps, silences, secrets |
| `#pr-failures` | A required check went red | CI/deploy bot | The pull request, or the Actions run when `main` is red | Green checks, “waiting for review”, merge instructions, full logs, secrets |

`#direction` does not discuss the feature. `#product` does not redesign the stack. `#architecture` does not become the backlog. The three bot channels do not take replies except the single `#alert` follow-up that adds the incident link.

## 3. Message shape

One message is one handoff. The first line is the whole route. The second line is the link. The body is at most three lines. No thread is required. The next hat does not read the channel history.

```
from: <ceo|po|cto|eng|ci>  to: <po|cto|eng|record>  kind: <kind>
<one link>
<optional body, three lines max>
```

| Kind | from | to | Link |
|---|---|---|---|
| `direction` | `ceo` | `po` | The decision note in `docs/ops/company/DECISIONS.md`, or the ticket that will hold it |
| `feature` | `po` | `cto` | `docs/ops/tickets/PRD-*.md` |
| `architecture` | `cto` or `eng` | `eng`, `cto`, or `record` | Ticket, plan, or pull request |
| `deploy` | `ci` | `record` | Jenkins `deploy-mock-prod` build URL |
| `alert` | `ci` or `eng` | `eng` or `record` | Grafana alert, or the `INC-*` once it exists |
| `pull-request failure` | `ci` | `eng` | The pull request, or the Actions run on `main` |

`to: record` means stop. The link is the company record. Do not continue in Slack.

Kinds in use are only those six. There is no `status`, `fyi`, or `question` kind. A product question is `feature`. An architecture question is `architecture`.

Examples:

```
from: ceo  to: po  kind: direction
docs/ops/company/DECISIONS.md
Next public surface is the free Ireland directory on fishing-journals.com.
```

```
from: po  to: cto  kind: feature
docs/ops/tickets/PRD-032.md
Campsite, B&B, experience, and supplier kinds on the map. Need a shape.
```

```
from: ci  to: eng  kind: pull-request failure
https://github.com/tezball/my-island/pull/117
compose stack red. Jenkins status of the same name is not a second Slack post.
```

File the vault note first, then post the link. The PO does not specify a feature in Slack and leave the ticket for later. The CEO’s direction line is incomplete until that sentence is in the decision note.

## 4. How deploy, alerts, and pull-request failures enter

Three incoming webhooks. No second CI system. No GitHub Environment named production. No PagerDuty, Datadog, or Sentry. No restored fishing-journals email (`INC-001`).

### Deploy → `#deploy`

House path, unchanged: green `main` → Jenkins job `deploy-mock-prod` (cron `H/5`, `gate_mock_prod_deploy.py`) → `scripts/deploy-mock-prod.sh` → `ops/scripts/check_deploy_info.py` and `ops/scripts/smoke_mock_prod.py`. The job runs on the Mac mini Jenkins (loopback trigger, `WF-049`). Agents never SSH.

After that job finishes, one webhook post:

- `kind: deploy`
- result `pass` or `fail`
- git SHA
- link to the Jenkins build
- link to https://fishing-journals.com/actuator/info

GitHub Actions `mock-prod-signal` stays the visible “main is green” check. The Slack line cites it. Actions does not deploy and does not post a second deploy message. A failed smoke also posts one `kind: alert` line into `#alert`.

### Firing alerts → `#alert`

House path: Grafana Alerting + Alertmanager. Agents read firing alerts with `mcp-grafana` (`--disable-write`). Gatling trickle and weekly failures already mark Jenkins red and fire the house Alertmanager through `ops/scripts/notify_house_alertmanager.py` (`WF-045`). Leftover fishing-journals Alertmanager stays `keep` and does not email.

`alertmanager.yml` stays receiver `keep` so CI boots with no secret. When `SLACK_ALERTS_WEBHOOK` is set, compose writes the URL inside the container and loads `ops/observability/alertmanager.slack.yml` (`channel: "#alert"`, `send_resolved: false`, `api_url_file`). Do not add a second Slack receiver or a second channel. Do not point the leftover fishing-journals Alertmanager at Slack. `WF-009` (Alertmanager webhook spawns a Cloud Agent) stays inbox. This webhook notifies. It does not spawn.

### Pull-request failure → `#pr-failures`

House CI is Jenkins (local compose, JCasC, multibranch statuses `unit tests`, `catalog tests`, `web tests`, `compose stack`) plus GitHub Actions workflow `CI` with those same four job names.

Slack posts from GitHub Actions only, and only when one of those four jobs fails on a pull request or on `main`. One message per failed workflow run, naming the red job, the SHA, and the link. Jenkins keeps writing the commit status and does not post to Slack, so the dual-run does not double-ping.

Do not post when `Automerge` ends `waiting for review`. That job is green on purpose when the four tests passed and a valid non-author `APPROVED` is still missing. Do not post Chaos, ZAP, Playwright, or Gatling into `#pr-failures`. Gatling failures already enter through Alertmanager.

## 5. What we will not automate into Slack

- Merges. Squash-merge stays the GitHub Actions `Automerge` workflow. Chat agents do not merge. Slack does not approve.
- Ticket edits. No `new_ticket.py`, no status flips, no `board_sync.py` from a message.
- The board. `docs/ops/BOARD.md` stays a vault render.
- Decision text. A Slack line does not write `DECISIONS.md`.
- Secret values, tokens, webhook URLs, SSH keys, `.env`, guest PII, VisitIntent lists.
- Log dumps, smoke JSON, Loki extracts, stack traces. Logs stay in Loki. Agents read them with `mcp-grafana`.
- Green checks, review-wait notices, weekly digests, runbooks. Routines stay in `docs/ops/runbooks/`.
- Agent spawn from an alert (`WF-009`).
- Channel create, invites, and app install from an agent session.

## 6. Setup sequence

Terry does this once, by hand. Agents do not run it.

1. Pick one Slack workspace for my-island. Private channels. No Slack Connect. No guests.
2. Create channels in this order, so each pipe’s destination exists first: `#architecture`, `#product`, `#direction`, `#alert`, `#deploy`, `#pr-failures`.
3. Create one Slack app, incoming webhooks only. Suggested name: `my-island-notify`. Three webhooks, one each for `#deploy`, `#alert`, and `#pr-failures`. No bot user, no `chat:write`, no history scope, no slash commands, no event subscriptions. The full Slack GitHub app and a Jenkins Slack plugin are more than this needs.
4. Store the deploy webhook in the Mac mini Jenkins credential store and the pull-request webhook in a GitHub Actions secret. Store the alerts webhook in `SLACK_ALERTS_WEBHOOK` on the host that runs compose (documented in `.env.example`). Never commit a real value. Never in git, never in `docs/`, never in this note.
5. The `#alert` receiver is already in the repo. Leave the deploy and pull-request webhooks unused until a later `WF-*` adds the Jenkins post step and the Actions failure step. Do not add a second Alertmanager Slack receiver.

How an agent may post: Cursor already has a Slack connection available to agents. That connection is the only poster for `#direction`, `#product`, and `#architecture`.

Use it to post one shaped handoff into the channel that hat may post in, and to read a handoff whose first line names that hat.

Do not use it to create channels, install apps, invite members, rename channels, post into `#deploy`, `#alert`, or `#pr-failures`, send direct messages, search Slack as memory, paste secrets or logs, merge, edit tickets, or touch the paused merge and deploy work. Bot notices stay on the webhooks so they fire when no agent session is awake.

Until the six channels exist, agents do not create them and do not send.

## 7. Open decisions

These are undecided. Sections 1–6 are the proposal.

1. Which Slack workspace, and its name.
2. Accept the remaining channel names, or replace them before anyone creates channels. `#alert` matches the shipped Alertmanager receiver and is not a rename.
3. Accept the seat map: PO = `product`, CTO = `architecture`, engineer agents as listed, orchestrator read-only.
4. Post every `deploy-mock-prod` result, or failures only. Proposal: every result, one line.
5. Include a red `main` run in `#pr-failures`, or pull requests only. Proposal: include `main`.
6. Private channels, or public inside the workspace. Proposal: private.
7. Whether to promote `WF-009` later so a firing alert spawns an agent. Proposal: not this plan.
