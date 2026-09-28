# Slack setup guide

Follow these steps in order. Every name you type is in a copy-paste block. You do not choose names, channels, or app settings.

You can finish Part 1 in Slack today. The alerts webhook already has a paste spot: `SLACK_ALERTS_WEBHOOK` in `.env.example`, which loads `ops/observability/alertmanager.slack.yml` into `#alert`. Deploy (G) and pull-request failure (I) still stop before CI wiring. Those two paste spots are not in the repo yet.

Use a computer. Open the Slack desktop app, or open https://app.slack.com in a browser. The app settings later use https://api.slack.com/apps in the same browser.

Send nothing. Create no second workspace. Create no extra channel. Post no test message.

## Locked choices

| Item | Exact value |
|---|---|
| Workspace | The workspace this Cursor Slack connection already uses. Sidebar already shows `#all-my-island`, `#social`, and `#new-channel`. Organization name: `My-Island`. |
| Channels, in this order | `#architecture`, `#product`, `#direction`, `#alert`, `#deploy`, `#pr-failures` |
| Channel type | Private |
| App name | `my-island-notify` |
| App features | Incoming webhooks only |
| Webhooks, in this order | one for `#deploy`, one for `#alert`, one for `#pr-failures` |
| Deploy messages | Every result, pass or fail, one line |
| `#pr-failures` | A red run on a pull request, and a red run on `main` |
| Alert messages | A firing alert only. Nothing in this guide starts an agent. |

Leave `#all-my-island`, `#social`, and `#new-channel` as they are.

---

# Part 1 — Finish this in Slack today

## A. Confirm the workspace

### A1. Open Slack

Open the Slack desktop app. If you are using a browser, go to https://app.slack.com and sign in.

**Worked:** The left sidebar is on screen.

**Button missing:** You are on a Slack marketing page. Click the button labeled **Sign in**, then **Launch Slack**. If you still see no sidebar, install the Slack desktop app from https://slack.com/downloads and open it.

### A2. Read the workspace name

Look at the top of the left sidebar. That word is the workspace name.

**Worked:** You see `My-Island`, and the sidebar lists `#all-my-island`, `#social`, and `#new-channel`.

**Name is different:** Stay on this screen if those three channels are in the sidebar. That is the workspace. If those three channels are not in the sidebar, click the workspace name at the top of the sidebar, then click the row that shows `My-Island`.

**My-Island is missing from that list:** Stop. Those three channels are the proof of the right workspace. Creating a workspace is not a step in this guide. There is no **Create a workspace** click here.

### A3. Stay signed in as the owner

The account that continues must be the owner of this workspace. The Cursor Slack connection is already this workspace.

**Worked:** You can see `#all-my-island`, `#social`, and `#new-channel` in the sidebar.

**You cannot see them:** Click your picture in the top corner, then **Sign in to another workspace**, and sign in as the owner of the workspace that contains those three channels. Then repeat A2.

---

## B. Create the six private channels

Do these six in order. Finish one, see the lock, then start the next.

The clicks are the same each time. The only text you type is the channel name.

### Clicks for one channel

1. In the left sidebar, click the **plus** sign beside **Channels**.
2. Click **Channel**.
3. If a page titled with templates appears, click **Blank channel**. A template adds canvases and lists. This guide uses a blank channel.
4. Click the name box. Paste the name from the copy block for this channel. Paste the word only. The `#` is added by Slack.
5. If you see a **Description** box, leave it empty.
6. Click **Private**. It is the choice with a lock. On some screens the control is a switch labeled **Make private**. Turn that switch on.
7. Click **Create**.
8. If Slack asks who to add, click **Skip for now**. Leave the people box empty.

**Worked:** The channel opens. The header shows a lock and the name with a `#`. The same name is in the sidebar under **Channels**.

**Plus is missing:** Click **Home** in the left rail, then look again beside the word **Channels**. If the plus opens a menu that says **Create**, click **Create**, then **Channel**.

**Channel is missing:** You are on a template list. Click **Blank channel**, or click **Back** until you see **Channel**.

**Private is missing:** You are still on the template list. Click **Blank channel**, then look again for **Private**.

**Create is missing:** The name box is empty, or **Private** is not selected. Paste the name, click **Private**, then click **Create**. If **Create** stays off until **Description** has text, paste the description from that channel’s step, then click **Create**.

**Skip for now is missing:** The people box must stay empty. Click the **X** on the invite window. Type no email. There is no Slack Connect click in this guide.

**The header has no lock:** The channel was created public. Click the channel name in the header. Click the **Settings** tab. Click **Change to a private channel**. Click **Change to Private**.

**Change to a private channel is missing:** Stop. You are not the owner of this channel, or you are looking at a different channel. Do not keep going with a public channel.

**Slack changed the name you pasted:** Stop. Use the exact name in the copy block. Do not accept a shortened or different name.

### B1. `#architecture`

Paste this into the name box:

```
architecture
```

If **Create** will not press until **Description** has text, paste this, then click **Create**:

```
CTO with engineers across the org
```

**Worked:** Header shows a lock and `#architecture`.

### B2. `#product`

Same clicks. Paste this into the name box:

```
product
```

Description, only if **Create** will not press:

```
PO on current and new features
```

**Worked:** Header shows a lock and `#product`.

### B3. `#direction`

Same clicks. Paste this into the name box:

```
direction
```

Description, only if **Create** will not press:

```
CEO sets company direction
```

**Worked:** Header shows a lock and `#direction`.

### B4. `#alert`

Same clicks. Paste this into the name box:

```
alert
```

Description, only if **Create** will not press:

```
House alerts that are firing
```

**Worked:** Header shows a lock and `#alert`.

### B5. `#deploy`

Same clicks. Paste this into the name box:

```
deploy
```

Description, only if **Create** will not press:

```
One line each time deploy-mock-prod finishes
```

**Worked:** Header shows a lock and `#deploy`.

### B6. `#pr-failures`

Same clicks. Paste this into the name box:

```
pr-failures
```

Description, only if **Create** will not press:

```
A required check went red
```

**Worked:** Header shows a lock and `#pr-failures`. The sidebar now has all six, each with a lock: `#architecture`, `#product`, `#direction`, `#alert`, `#deploy`, `#pr-failures`.

**A name in that list is missing:** Create only the missing one, using its step above. Keep the order if you still have more than one left.

---

## C. Message shape

Read this section. Leave every message box empty. You send nothing in this session.

One message is one handoff. Line 1 is the route. Line 2 is the link. The body is at most three more lines. Kinds in use are only the six below.

```
from: <ceo|po|cto|eng|ci>  to: <po|cto|eng|record>  kind: <kind>
<one link>
<optional body, three lines max>
```

| Kind | from | to | Channel | Link |
|---|---|---|---|---|
| `direction` | `ceo` | `po` | `#direction` | The decision note in `docs/ops/company/DECISIONS.md`, or the ticket that will hold it |
| `feature` | `po` | `cto` | `#product` | `docs/ops/tickets/PRD-*.md` |
| `architecture` | `cto` or `eng` | `eng`, `cto`, or `record` | `#architecture` | Ticket, plan, or pull request |
| `deploy` | `ci` | `record` | `#deploy` | Jenkins `deploy-mock-prod` build URL |
| `alert` | `ci` or `eng` | `eng` or `record` | `#alert` | Grafana alert, or the `INC-*` once it exists |
| `pull-request failure` | `ci` | `eng` | `#pr-failures` | The pull request, or the Actions run on `main` |

`to: record` means stop. The link is the company record.

`#direction`, `#product`, and `#architecture` get these lines from a person, through the Cursor Slack connection, after the vault note exists. `#alert` posts from house Alertmanager when `SLACK_ALERTS_WEBHOOK` is set. `#deploy` and `#pr-failures` get these lines from webhooks after an engineer wires CI. You do not paste a webhook message by hand today.

A deploy line is posted for every result, pass or fail, one line. A failed smoke also gets one `kind: alert` line in `#alert`. A `#pr-failures` line is posted when one required check is red on a pull request or on `main`.

Copy-paste examples:

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
from: cto  to: record  kind: architecture
https://github.com/tezball/my-island/pull/117
```

```
from: ci  to: record  kind: deploy
http://127.0.0.1:8085/job/deploy-mock-prod/<build number>/
pass <git sha>
https://fishing-journals.com/actuator/info
```

On a failed deploy, the third line is `fail` plus the git SHA. The second line is still the Jenkins build. The info link stays on its own line. That is still one message.

```
from: ci  to: eng  kind: alert
http://127.0.0.1:3030/alerting/list
GatlingJobFailed is firing.
```

```
from: ci  to: eng  kind: pull-request failure
https://github.com/tezball/my-island/pull/117
compose stack red. Jenkins status of the same name is not a second Slack post.
```

A red `main` run uses the same kind. The second line is the Actions run, not a pull request:

```
from: ci  to: eng  kind: pull-request failure
https://github.com/tezball/my-island/actions/runs/<run id>
unit tests red on main.
```

`<build number>`, `<git sha>`, and `<run id>` are filled when that run exists. You do not invent them today.

---

## D. Create the app

### D1. Open the app list

In the browser, open https://api.slack.com/apps.

**Worked:** A page titled **Your Apps**.

**Your Apps is missing:** Click **Sign in to Slack** at the top of that page. Sign in as the owner from step A3. Then open https://api.slack.com/apps again.

### D2. Start a new app

Click **Create New App**.

**Worked:** A window with two choices: **From scratch** and **From a manifest**.

**Create New App is missing:** You are not signed in. Repeat D1. If you are signed in and the button is still absent, refresh the page once.

### D3. Choose a blank app

Click **From scratch**.

**Worked:** A form with **App Name** and a workspace menu.

**From scratch is missing:** You are on a manifest form. Click **Back** or **Cancel**, then click **Create New App** again, then **From scratch**. Do not paste a manifest.

### D4. Name the app

Click the **App Name** box. Paste:

```
my-island-notify
```

**Worked:** The box shows `my-island-notify`.

### D5. Pick the workspace

Open the workspace menu. Click the workspace from Part A. It is the one whose sidebar has `#all-my-island`, `#social`, and `#new-channel`. The organization name is `My-Island`.

**Worked:** The menu shows that workspace.

**That workspace is missing from the menu:** Stop. Do not pick a different workspace. Sign in at https://api.slack.com/apps as the owner from step A3, then repeat D2.

### D6. Create it

Click **Create App**.

**Worked:** The app settings page opens. The title is `my-island-notify`. The left sidebar lists **Basic Information**, **Incoming Webhooks**, and **OAuth & Permissions**.

**Create App is missing:** The name box is empty, or no workspace is selected. Repeat D4 and D5.

---

## E. Incoming webhooks only

Do these checks before you create a webhook. Leave every other feature off.

### E1. Open Incoming Webhooks

In the left sidebar, under **Features**, click **Incoming Webhooks**.

**Worked:** A page with a switch **Activate Incoming Webhooks**.

**Incoming Webhooks is missing:** You are on the wrong app. Click the Slack logo or **Your Apps**, open `my-island-notify`, then click **Incoming Webhooks**.

### E2. Turn webhooks on

Click the **Activate Incoming Webhooks** switch so it reads **On**.

**Worked:** The page reloads. A button labeled **Add New Webhook to Workspace** is on the page.

**The switch is missing:** You are not on **Incoming Webhooks**. Click that item in the left sidebar.

**Add New Webhook to Workspace is missing after the switch is On:** Reload the page. The button is below the switch.

### E3. Confirm there is no bot user

In the left sidebar, click **OAuth & Permissions**.

**Worked:** Under **Scopes**, **Bot Token Scopes** has no rows. **User Token Scopes** has no rows. You may see `incoming-webhook` after the first webhook in Part F. That single scope stays.

**chat:write is listed:** Click the **X** or trash control on that row so the row goes away. Do the same for any scope whose name contains `history`. Then return to **Incoming Webhooks**.

**Add an OAuth Scope is the only button you see:** Do not click it.

**A page offers Add a Bot User, or Review Scopes to Add a Bot:** Click **Back**. Do not add a bot.

### E4. Confirm events are off

In the left sidebar, click **Event Subscriptions**.

**Worked:** **Enable Events** is **Off**.

**Enable Events is On:** Click the switch so it reads **Off**. Save if Slack shows **Save Changes**.

**Event Subscriptions is missing:** Stay on this app’s left sidebar and scroll. If it is truly absent, continue to E5. Do not hunt through a different app.

### E5. Confirm there are no slash commands

In the left sidebar, click **Slash Commands**.

**Worked:** The page lists no commands.

**Create New Command is showing:** Do not click it. No command is created in this guide.

### E6. Leave the other feature pages alone

Do not click **Interactivity & Shortcuts** to turn a switch on. If you open it and **Interactivity** is **On**, click it to **Off**.

On **Basic Information**, do not click **Install to Workspace** and do not click **Manage Distribution**. The webhook button in Part F is the only permission click.

**Worked:** App name is still `my-island-notify`. Events off. No slash commands. No bot scopes.

---

## F. Create the three webhooks

Create them in this order: `#deploy`, then `#alert`, then `#pr-failures`.

You must already be a member of the channel. You are, because you created it.

Each webhook posts only to the channel you pick. There is no webhook for `#architecture`, `#product`, or `#direction`.

### F1. Webhook for `#deploy`

1. Click **Incoming Webhooks** in the left sidebar.
2. Click **Add New Webhook to Workspace**.
3. On the permission page, open the channel menu. Type:

```
deploy
```

4. Click the row `#deploy` that shows a lock.
5. Click **Authorize**. If the button says **Allow**, click **Allow**. That is the same step.

**Worked:** You are back on **Incoming Webhooks**. Under **Webhook URLs for Your Workspace** there is one row. The channel on that row is `#deploy`. The URL starts with `https://hooks.slack.com/services/`.

**Add New Webhook to Workspace is missing:** The switch in E2 is off. Turn **Activate Incoming Webhooks** **On**, reload, then click the button.

**#deploy is missing from the channel menu:** Slack is showing a different workspace, or the channel is not private in this workspace. Click **Cancel**. In Slack, confirm `#deploy` has a lock in the `My-Island` sidebar. Then repeat F1. Do not pick `#all-my-island`, `#social`, or `#new-channel`.

**Authorize and Allow are both missing:** The workspace name at the top of the permission page is wrong. Cancel. Repeat D5 so the app belongs to the workspace from Part A, then repeat F1.

**The permission page asks for chat:write, history, or a bot:** Click **Cancel** or **Deny**. Return to E3 and remove those scopes. Then repeat F1.

### F2. Copy the `#deploy` URL into a password manager

Click **Copy** on the `#deploy` row. If there is no **Copy** button, click the URL, select the whole URL, and copy it.

Open your password manager. Create a new saved item. Paste this as the item name:

```
my-island-notify deploy
```

Paste the copied URL into the password or secret field of that item. Save the item.

The URL is a secret. The saved place is the password manager. It does not go in git, in this guide, in Slack, in email, or in a chat.

**Worked:** The password manager has an item named `my-island-notify deploy`. Slack still shows one webhook row, channel `#deploy`.

**You have no password manager:** Stop. Do not paste the URL anywhere else. Get a password manager, then copy the URL from the `#deploy` row and save it there.

**The row’s channel is not `#deploy`:** Do not save that URL under the deploy name. Find the row whose channel is `#deploy`, and copy that URL.

### F3. Webhook for `#alert`

Same clicks as F1. In the channel menu, type:

```
alert
```

Click the locked row `#alert`. Click **Authorize** (or **Allow**).

**Worked:** **Webhook URLs for Your Workspace** now has two rows. One channel is `#deploy`. One channel is `#alert`.

**The new row is a second `#deploy`:** You picked the wrong channel. On that new row, click the revoke or delete control Slack shows for that webhook (it may be a trash icon or **Remove**). Then repeat F3 and pick `#alert`.

### F4. Copy the `#alert` URL

Copy only the URL on the row whose channel is `#alert`.

New password-manager item. Paste this as the name:

```
my-island-notify alerts
```

Paste the URL into that item’s secret field. Save.

**Worked:** Two password-manager items exist: `my-island-notify deploy` and `my-island-notify alerts`. They are different URLs.

### F5. Webhook for `#pr-failures`

Same clicks as F1. In the channel menu, type:

```
pr-failures
```

Click the locked row `#pr-failures`. Click **Authorize** (or **Allow**).

**Worked:** Three rows. Channels are `#deploy`, `#alert`, and `#pr-failures`.

**#pr-failures is missing from the menu:** In Slack, open `#pr-failures` and confirm the lock in the header. Then repeat F5 from the **Incoming Webhooks** page.

### F6. Copy the `#pr-failures` URL

Copy only the URL on the row whose channel is `#pr-failures`.

New password-manager item. Paste this as the name:

```
my-island-notify pr-failures
```

Paste the URL into that item’s secret field. Save.

**Worked:** Three saved items, three different URLs, names exactly:

```
my-island-notify deploy
my-island-notify alerts
my-island-notify pr-failures
```

### F7. Do not send a test message

Slack’s own help shows a “Hello, world” post. Skip it. Do not click a **Send** or test button. The three channels stay empty.

**Worked:** `#deploy`, `#alert`, and `#pr-failures` have no new message from `my-island-notify`.

---

## Part 1 is done when

- The sidebar shows the six private channels, in addition to `#all-my-island`, `#social`, and `#new-channel`.
- https://api.slack.com/apps shows one app named `my-island-notify`.
- **Incoming Webhooks** shows three URLs, one each for `#deploy`, `#alert`, and `#pr-failures`.
- **Event Subscriptions** is off, **Slash Commands** is empty, and **Bot Token Scopes** is empty.
- The three URLs are in the password manager under the three names above.

The `#alert` URL goes in `SLACK_ALERTS_WEBHOOK`. Nothing posts until that value is set on the host. Deploy and pull-request failure wiring are Part 2 and are not in the repo.

---

# Part 2 — Where the URLs get pasted into CI

An engineer does this later. You do not edit files. You do not open a Jenkins credential form and paste. You do not add a GitHub secret yet. Pasting now would put the secret in a place no job reads.

Wherever a URL would be typed, the placeholder is:

```
PASTE_WEBHOOK_URL_HERE
```

That placeholder is not a real URL. Do not replace it inside a file, this guide, or chat. The real value stays in the password manager until the engineer adds a real field.

Deploy (G) and pull-request failure (I) are the two stops. Alerts (H) are already wired.

## G. Deploy URL — Jenkins job `deploy-mock-prod`

**Password-manager item:** `my-island-notify deploy`

**What this URL is for:** One Slack line each time Jenkins job `deploy-mock-prod` finishes, pass or fail. The line is `kind: deploy`. It links to that Jenkins build and to https://fishing-journals.com/actuator/info. GitHub Actions does not post a second deploy line. Job `mock-prod signal` in `.github/workflows/ci.yml` starts Jenkins `deploy-mock-prod` after CI succeeds on `main`. It does not rsync and it does not post the deploy line.

**Job file:** `ops/jenkins/casc/jobs/deploy-mock-prod.groovy`

The job name inside that file is `deploy-mock-prod`. Stages today:

- `gate-main-gha`
- `ff-main`
- `deploy` (runs `scripts/deploy-mock-prod.sh`, which calls `ops/scripts/check_deploy_info.py`)
- `http-api-smoke` (runs `ops/scripts/smoke_mock_prod.py`)

There is no step after those stages that reads a Slack URL.

**Credential file:** `ops/jenkins/casc/jenkins.yaml`

The credential list in that file has one entry. Its id is `github-token`. The value comes from `.env` keys `JENKINS_GITHUB_TOKEN` and `GITHUB_USERNAME`, documented in `.env.example`. `.env.example` documents `SLACK_ALERTS_WEBHOOK` for house alerts into `#alert`. There is no Slack credential id in `jenkins.yaml` for this deploy webhook.

Jenkins on the Mac mini loads that same file. The screen at `http://127.0.0.1:8085/` (see `JENKINS_URL` in `.env.example` and `docs/ops/runbooks/JENKINS_LOCAL.md`) has no saved field for this webhook.

**Stop.** Hand this to an engineer. The files that would have to change are `ops/jenkins/casc/jenkins.yaml` (a credential whose value is `PASTE_WEBHOOK_URL_HERE` from the Mac mini secret store, same pattern as `github-token`, never committed) and `ops/jenkins/casc/jobs/deploy-mock-prod.groovy` (one post when the job finishes, every result, one line). A failed smoke also needs one `kind: alert` post using the alerts URL. You do not add that post yourself.

## H. Alerts URL — house Alertmanager

**Password-manager item:** `my-island-notify alerts`

**What this URL is for:** Firing house alerts only, into `#alert`. Resolved alerts stay off that channel (`send_resolved: false`). This notify does not start an agent.

**Config files:** `ops/observability/alertmanager.yml` and `ops/observability/alertmanager.slack.yml`

`alertmanager.yml` stays receiver `keep` so CI boots with no secret. When `SLACK_ALERTS_WEBHOOK` is set, compose writes the URL inside the container and loads `ops/observability/alertmanager.slack.yml` (`channel: "#alert"`, `send_resolved: false`, `api_url_file`). Do not add a second Slack receiver or a second channel.

The env key is `SLACK_ALERTS_WEBHOOK` in `.env.example`. The value is the incoming-webhook URL for `#alert`. Never commit a real value. Empty keeps receiver `keep`.

Gatling failures call `ops/scripts/notify_house_alertmanager.py`. That script posts to `HOUSE_ALERTMANAGER_URL` plus `/api/v2/alerts`. `HOUSE_ALERTMANAGER_URL` is the Alertmanager address, not a Slack URL. Do not put the webhook URL in `HOUSE_ALERTMANAGER_URL`.

The leftover fishing-journals Alertmanager is a different file. `ops/deploy/disable_legacy_alerts.py` keeps it as receiver `keep` at `/home/ubuntu/app/infra/observability/alertmanager/alertmanager.yml`. That file does not get this URL.

**Already wired.** Put the password-manager URL in `SLACK_ALERTS_WEBHOOK` on the host that runs compose. Do not edit `alertmanager.yml` to add another Slack receiver.

## I. Pull-request failure URL — GitHub Actions workflow `CI`

**Password-manager item:** `my-island-notify pr-failures`

**What this URL is for:** One Slack line when a required check fails on a pull request or on `main`. One message per failed workflow run. The line names the red job, the SHA, and the link. `kind: pull-request failure`.

**Workflow file:** `.github/workflows/ci.yml`

The workflow `name:` is `CI`. It runs on `pull_request`, on `push` to `main`, and on `workflow_dispatch`.

Required checks, job id then the `name:` GitHub shows:

| Job id | Name in GitHub | Posts to `#pr-failures` when red |
|---|---|---|
| `unit` | `unit tests` | yes |
| `catalog` | `catalog tests` | yes |
| `web` | `web tests` | yes |
| `stack` | `compose stack` | yes |

Same file, and they do not post to `#pr-failures`:

| Job id | Name in GitHub |
|---|---|
| `zap` | `zap baseline` |
| `chaos` | `chaos monkey` |
| `mock-prod-signal` | `mock-prod signal` |

`mock-prod signal` runs only on `main` after the jobs it needs. It starts Jenkins `deploy-mock-prod`. It does not rsync and it does not post the deploy line.

Jenkins writes the same four names as commit statuses from `Jenkinsfile` (`unit tests`, `catalog tests`, `web tests`, `compose stack`) via the multibranch job `my-island` in `ops/jenkins/casc/jobs/github-multibranch.groovy`. Jenkins does not post to Slack, so a red check is one Slack message, from Actions.

Workflow `.github/workflows/automerge.yml` is named `Automerge`. Its job `name:` is `automerge`. A finish that is still waiting for review does not post to `#pr-failures`.

`.github/workflows/ci.yml` has no step that reads a Slack secret. The only `secrets.` use in these workflows is `secrets.GITHUB_TOKEN` inside `.github/workflows/automerge.yml`. That token is not a webhook.

**Stop.** Hand this to an engineer. The file that would have to change is `.github/workflows/ci.yml`: one failure step that posts when `unit tests`, `catalog tests`, `web tests`, or `compose stack` fails on a pull request or on `main`, using `PASTE_WEBHOOK_URL_HERE` from a GitHub Actions secret. You do not create that secret, because no step reads it yet.

## What you do after the stops

Leave the password-manager items as they are. Put the alerts URL in `SLACK_ALERTS_WEBHOOK` on the host that runs compose. Do not commit it. Tell an engineer that Part 1 is done and that Part 2 stopped at:

- `ops/jenkins/casc/jenkins.yaml` and `ops/jenkins/casc/jobs/deploy-mock-prod.groovy`
- `.github/workflows/ci.yml`

Do not ask them to add a Slack receiver to `ops/observability/alertmanager.yml`. That file stays receiver `keep`. The Slack config is `ops/observability/alertmanager.slack.yml`.

The engineer gets the deploy and pull-request URLs from you through the password manager. They do not go in the guide, in git, or in chat.
