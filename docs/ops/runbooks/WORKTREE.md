---
title: Add and remove a ticket worktree
type: runbook
owner: automation-expert
cssclasses:
  - runbook
---

# Add and remove a ticket worktree

Policy: [[ops/workflow/WORKTREES]]. Loop: [[ops/workflow/LOOP]].

Primary clone stays on `main`. This runbook is for a **second Cursor window**.

## Add (implementer or docs-only)

From the primary (`~/Projects/my-island` on `main`):

```bash
git fetch origin
git worktree add -b wf/WF-037-short-slug \
  ../my-island-WF-037-short-slug origin/main
```

Use `prd/<id>-slug` for product tickets. If the branch already exists on origin:

```bash
git fetch origin
git worktree add ../my-island-WF-037-short-slug origin/wf/WF-037-short-slug
```

Open `~/Projects/my-island-WF-037-short-slug` as a **new Cursor window**. One ticket in that session.

Optional, only if that tree needs laptop secrets Compose already has:

```bash
ln -s ../my-island/.env .env
```

## Prove the work

In the worktree:

```bash
python3 -m pytest ops/tests -q -m "not stack"
# if this ticket needs HTTP / MCP:
./scripts/app stop    # singleton stack; stop whoever had it
./scripts/app start
./scripts/app test
```

Do not `./scripts/app start` in two trees at once. Ports and project name `my-island` are shared.

## PR

```bash
gh pr create --title "<id>: <title>" --body "…"
```

Then ticket `pr:` + `status: review`, `board_sync.py`. Do not `gh pr merge`.

## Remove (after merge)

```bash
git worktree list
git worktree remove ../my-island-WF-037-short-slug
git branch -d wf/WF-037-short-slug   # if still present
cd ~/Projects/my-island && git pull --ff-only
```

If the folder is dirty or git complains, `--force` only when the PR is merged and you intend to throw the tree away.

Confirm Actions on `main` are green. If red, new worktree + fix PR.

## Must not

- `git checkout` a branch that another worktree already has
- Feature-commit in the primary clone
- Nested worktrees inside `~/Projects/my-island`
- Deploy a worktree branch to fishing-journals.com
- Force-push `main`
