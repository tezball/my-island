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

if [[ -z "${GITHUB_TOKEN:-}" && -f jenkins/secrets/github-token ]]; then
  GITHUB_TOKEN="$(tr -d '[:space:]' < jenkins/secrets/github-token)"
  export GITHUB_TOKEN
  echo "Loaded GITHUB_TOKEN from jenkins/secrets/github-token"
fi

if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  echo "WARN: no GITHUB_TOKEN — GitHub PR job (my-island-github) will not be seeded."
  echo "      echo 'ghp_...' > jenkins/secrets/github-token  # repo scope, needed for auto-review/merge"
fi

if [[ -z "${DOCKER_GID:-}" ]]; then
  if [[ -e /var/run/docker.sock ]]; then
    DOCKER_GID="$(stat -c '%g' /var/run/docker.sock 2>/dev/null || stat -f '%g' /var/run/docker.sock)"
  else
    DOCKER_GID=999
  fi
  export DOCKER_GID
fi

compose_args=(-f docker-compose.jenkins.yml)

# Prefer a host Ollama already running (app stack). Otherwise start one beside Jenkins.
if [[ "${WITH_AI_REVIEW:-true}" == "true" ]]; then
  if curl -fsS --max-time 2 http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
    export OLLAMA_BASE_URL="${OLLAMA_BASE_URL:-http://host.docker.internal:11434}"
    echo "Using host Ollama at :11434"
  else
    compose_args+=(--profile ai)
    export OLLAMA_BASE_URL="${OLLAMA_BASE_URL:-http://ollama:11434}"
    echo "Starting Jenkins-compose Ollama (llama3.2 pull on first run)"
  fi
fi

echo "DOCKER_GID=${DOCKER_GID}"
echo "Jenkins UI: http://localhost:${JENKINS_HTTP_PORT:-8088}"
echo "Login: ${JENKINS_ADMIN_ID:-admin} / \${JENKINS_ADMIN_PASSWORD:-admin}"
echo "GitHub webhook (if Jenkins is reachable): ${JENKINS_URL:-http://localhost:8088/}github-webhook/"

docker compose "${compose_args[@]}" up -d --build "$@"
