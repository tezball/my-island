---
title: Jenkins local
type: runbook
---

# Jenkins local (clone → up)

House CI on the engineer laptop ([[ops/tickets/WF-031]]). Config in git under `ops/jenkins/`. State on Docker volume `ops_jenkins`.

## Start

```bash
cp .env.example .env   # once; edit token when you have it
./scripts/app start    # or ./scripts/dev up
```

UI: http://127.0.0.1:8085 — login `admin` / `admin` (override via `.env`).

Jobs seeded by JCasC:

| Job | Needs token? | Purpose |
|---|---|---|
| `local-ci` | No | Build bind-mounted `/workspace` (`unit` → `catalog` → `stack`) |
| `my-island` | Yes | GitHub multibranch; polls every 5m; builds `Jenkinsfile` |
| `deploy-mock-prod` | No | Stub; fails until mock-prod VPS ([[ops/tickets/WF-032]] / [[ops/tickets/WF-010]]) |

## GitHub token

1. Create a classic PAT (or fine-grained) with repo read + commit status / checks write.
2. Put it in `.env` (Casc stores it as username/password credential `github-token`):

```bash
JENKINS_GITHUB_TOKEN=ghp_...   # or github_pat_...
GITHUB_USERNAME=tezball
```

3. Recreate Jenkins so Casc reloads the credential:

```bash
docker compose up -d jenkins --force-recreate --wait
```

4. Open `my-island` → **Scan Multibranch Pipeline Now**.

Laptop Jenkins **polls** GitHub (no public webhook URL). Remote PR merges still use GitHub Actions until a shared Jenkins exists on mock-prod.

## Survive restart / wipe

- Restart: `./scripts/app stop` then `start` — jobs and build history stay on `ops_jenkins`.
- Casc YAML / Job DSL changes: recreate jenkins **and** wipe its volume so seed jobs re-apply:
  `docker compose stop jenkins && docker compose rm -f jenkins && docker volume rm -f my-island_ops_jenkins && ./scripts/dev up`
- Full wipe (Postgres + Grafana + Jenkins): `docker compose down -v`.

Jenkins bind-mounts the repo at the **host path** (`HOST_REPO=$PWD`) so `docker compose` volume mounts resolve under Docker Desktop File Sharing.

## Security

- `docker.sock` is mounted **for local clone→up only**. Do not copy this onto a shared/public host.
- Never commit `.env` or PATs into the vault.

## GHA dual-run

Actions still runs `unit` / `catalog` / `stack` and automerge ([[ops/tickets/WF-025]]). Stack job sets `SKIP_JENKINS=1` so CI does not build the Jenkins image.
