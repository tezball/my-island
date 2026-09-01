# Jenkins CI/CD

Self-hosted Jenkins beside My Island.

**PR path:** GitHub PR → Jenkins CI → Ollama AI review → autofix (if needed) → approve + squash-merge.

**Main path:** merge to `main` → Jenkins CI → `docker-compose.prod.yml` deploy → `confirm-prod.sh`.

## Quick start

```bash
# GitHub PAT so PRs can be reviewed/merged (repo scope)
echo 'ghp_...' > jenkins/secrets/github-token

./scripts/start-jenkins.sh

open http://localhost:8088
# Login: admin / admin  (override JENKINS_ADMIN_PASSWORD)
```

Seeded jobs:

| Job | When | What |
|-----|------|------|
| **my-island** | Manual | Build/test the bind-mounted repo. `DEPLOY_PROD` still opt-in. |
| **my-island-github** | Every GitHub PR + `main` (needs `GITHUB_TOKEN`) | PRs: test → AI review → autofix → merge. `main`: auto-deploy + confirm. |

GitHub scan polls about every **2 minutes**. For faster triggers, add a GitHub webhook to `http://<jenkins-host>:8088/github-webhook/` (Jenkins must be reachable from GitHub, or use a tunnel).

## Pipeline stages

| Stage | What it does |
|-------|----------------|
| Checkout | GitHub Branch Source, or `SOURCE=local` copies `/var/my-island` |
| Backend Test | `mvn test` in Maven 21 image (Testcontainers via docker.sock) |
| Backend Package | `mvn package -DskipTests` |
| Frontend Lint & Build | `npm ci`, lint (non-blocking until main is lint-clean), `build` |
| E2E Playwright | Optional (`RUN_E2E`) — spins compose api/web, Playwright |
| AI Review | PRs only — Ollama (`llama3.2`) reviews the diff and posts a GitHub review |
| AI Autofix | If review requests changes — apply search/replace edits, push, wait for next build (max 3) |
| Approve and Merge | If review is `approve` and CI is green — squash-merge (skips forks and `hold` / `do-not-merge` / `wip` labels) |
| Deploy Prod | GitHub `main` auto, or manual `DEPLOY_PROD` — `docker compose -f docker-compose.prod.yml up -d --build` |
| Confirm Prod | `scripts/confirm-prod.sh` — health, `/`, `/api/campsites` |

## First deploy

1. Edit `jenkins/secrets/env.prod` (created from `.env.prod.example` by start script).
2. Put a GitHub PAT in `jenkins/secrets/github-token`.
3. Either:
   - Open a PR — Jenkins reviews, merges, then deploys `main`, or
   - Run job **my-island** with `SOURCE=local` and `DEPLOY_PROD=true`.

Confirm URL defaults to `http://host.docker.internal:80` (host-published `WEB_PORT`).

## Safety valves

- Label a PR `hold`, `do-not-merge`, or `wip` to skip auto-merge.
- Fork PRs are reviewed but never auto-merged.
- Autofix stops after 3 `fix(ai-review):` commits on the PR.
- `AUTO_MERGE_PRS=false` / `AUTO_DEPLOY_MAIN=false` disable those steps without changing the Jenkinsfile.
- Manual job **my-island** never auto-deploys unless you check `DEPLOY_PROD`.

## Layout

```
docker-compose.jenkins.yml
Jenkinsfile
jenkins/
  Dockerfile
  plugins.txt
  casc/jenkins.yaml
  secrets/env.prod          # gitignored
  secrets/github-token      # gitignored
scripts/start-jenkins.sh
scripts/confirm-prod.sh
scripts/ci/                 # AI review, autofix, squash-merge
```

## Notes

- Jenkins mounts the **host Docker socket** — it builds/deploys containers on the same machine.
- Do not expose port `8088` publicly without changing the admin password and locking down the host.
- AI review uses the host Ollama at `:11434` if it is already up; otherwise `./scripts/start-jenkins.sh` starts an Ollama sidecar (`--profile ai`) and pulls `llama3.2`.
- Cloud Agents still cannot drive Jenkins over MCP; GitHub PRs are the automation trigger.

## Stop

```bash
docker compose -f docker-compose.jenkins.yml down
# keep jenkins_home volume for job history; add -v to wipe
```
