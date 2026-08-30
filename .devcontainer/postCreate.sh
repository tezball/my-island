#!/usr/bin/env bash
# Runs once after the dev container is created. Installs project dependencies so the
# API and web app are ready to run. Backing services (postgres, mailpit) are already
# up via docker-compose; migrations/seed run automatically when the API first starts.
set -euo pipefail

echo "==> Toolchain versions"
java -version || true
node --version || true
mvn -version | head -1 || true

echo "==> Installing web dependencies (npm ci)"
(cd my-island-web && npm ci)

echo "==> Warming Maven dependencies for API"
(cd my-island-api && ./mvnw -q -DskipTests dependency:go-offline) || true

echo "==> Warming Maven dependencies for moderator"
(cd my-island-moderator && mvn -q -DskipTests dependency:go-offline) || true

cat <<'EOF'

Dev container ready.

Start the API (dev profile, runs Flyway migrations + seed data on first boot):
  cd my-island-api && SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run

Start the web app (in a second terminal):
  cd my-island-web && npm run dev

Then open:
  Frontend:  http://localhost:5173
  API:       http://localhost:8080/api
  Swagger:   http://localhost:8080/api/swagger-ui.html
  Mailpit:   http://localhost:8025
EOF
