#!/usr/bin/env bash
# Start the co-hosted Jenkins controller for My Island CI/CD.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

mkdir -p jenkins/secrets

if [[ ! -f jenkins/secrets/env.prod ]]; then
  if [[ -f .env.prod ]]; then
    cp .env.prod jenkins/secrets/env.prod
    echo "Copied .env.prod → jenkins/secrets/env.prod"
  else
    cp .env.prod.example jenkins/secrets/env.prod
    echo "Created jenkins/secrets/env.prod from .env.prod.example — edit secrets before DEPLOY_PROD"
  fi
fi

# Ensure root .env.prod exists for other compose files / docs
if [[ ! -f .env.prod ]]; then
  cp jenkins/secrets/env.prod .env.prod
fi

if [[ -z "${DOCKER_GID:-}" ]]; then
  if [[ -e /var/run/docker.sock ]]; then
    DOCKER_GID="$(stat -c '%g' /var/run/docker.sock 2>/dev/null || stat -f '%g' /var/run/docker.sock)"
  else
    DOCKER_GID=999
  fi
  export DOCKER_GID
fi

echo "DOCKER_GID=${DOCKER_GID}"
echo "Jenkins UI: http://localhost:${JENKINS_HTTP_PORT:-8088}"
echo "Login: ${JENKINS_ADMIN_ID:-admin} / \${JENKINS_ADMIN_PASSWORD:-admin}"

docker compose -f docker-compose.jenkins.yml up -d --build "$@"
