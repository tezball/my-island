# Jenkins CI/CD

Self-hosted Jenkins beside My Island: **build → test → deploy → confirm prod**.

## Quick start

```bash
# Requires Docker on the host
./scripts/start-jenkins.sh

# UI
open http://localhost:8088
# Login: admin / admin  (override JENKINS_ADMIN_PASSWORD)
```

Seeded job: **my-island**.

## Pipeline stages

| Stage | What it does |
|-------|----------------|
| Checkout | `SOURCE=local` copies `/var/my-island`; or git SCM |
| Backend Test | `mvn test` in Maven 21 image (Testcontainers via docker.sock) |
| Backend Package | `mvn package -DskipTests` |
| Frontend Lint & Build | `npm ci`, `lint`, `build` |
| E2E Playwright | Optional (`RUN_E2E`) — spins compose api/web, Playwright |
| Deploy Prod | Optional (`DEPLOY_PROD`) — `docker compose -f docker-compose.prod.yml up -d --build` |
| Confirm Prod | `scripts/confirm-prod.sh` — health, `/`, `/api/campsites` |

## First deploy

1. Edit `jenkins/secrets/env.prod` (created from `.env.prod.example` by start script).
2. Run job **my-island** with:
   - `SOURCE=local`
   - `DEPLOY_PROD=true`
   - optional `WITH_OBSERVABILITY` / `WITH_AI`
3. Confirm URL defaults to `http://host.docker.internal:80` (host-published `WEB_PORT`).

Build/test without deploy: leave `DEPLOY_PROD` unchecked.

## Layout

```
docker-compose.jenkins.yml
Jenkinsfile
jenkins/
  Dockerfile
  plugins.txt
  casc/jenkins.yaml
  secrets/env.prod          # gitignored
scripts/start-jenkins.sh
scripts/confirm-prod.sh
```

## Notes

- Jenkins mounts the **host Docker socket** — it builds/deploys containers on the same machine.
- Do not expose port `8088` publicly without changing the admin password and locking down the host.
- For GitHub as SCM: set `MY_ISLAND_GIT_URL=https://github.com/tezball/my-island.git` when starting compose.
- Cloud Agents cannot drive this Jenkins until an MCP/API bridge exists; humans (or a local Cursor + Jenkins CLI) trigger builds today.

## Stop

```bash
docker compose -f docker-compose.jenkins.yml down
# keep jenkins_home volume for job history; add -v to wipe
```
