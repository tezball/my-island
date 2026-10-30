# Stack

CTO lock for the fresh repo. Change it in this file before the code follows a different tool.

## Clients

Kotlin Multiplatform. The MVP ships **Compose Multiplatform for Web**, phone-first. Android and iOS are the same UI module later, not a second design.

## Server

Kotlin and Ktor. One language for the API and the shared client logic. PostgreSQL 17 with PostGIS. Flyway for migrations.

## Run

Docker Compose is the stack. A dev container is how an agent and a person open the repo. Each git worktree sets its own `COMPOSE_PROJECT_NAME` and its own host ports, so two worktrees can run at the same time.

## Test

Gatling, Kotlin DSL, one simulation per use case: browse listings, check off a place, host edits a stay, admin opens the console. The pipeline runs them against the deploy, not only against a laptop.

## Ship

GitHub Actions. A commit on `main` builds, migrates, deploys, then runs Gatling. A red Gatling run fails the deploy check. Feature branches do not deploy.

## Agents

MCP servers an agent can use against the deploy:

- GitHub, for the repo and the workflow.
- Postgres, read-only, for the catalog.
- The deploy host’s logs and metrics. Grafana OSS is the metrics store.
- A small deploy MCP or workflow that reports the live commit and can rerun the deploy. The agent does not SSH.

No second API language. No Next.js. The web UI is the Compose web target.
