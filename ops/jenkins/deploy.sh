#!/bin/sh
# Jenkins runs this after ops/jenkins/checkout.sh has fast-forwarded
# /tmp/island-mvp-jenkins to origin/main. That path is the same on the host
# and in the Jenkins container, so compose bind mounts stay host paths.
# A red test never replaces the app. A red Gatling run fails the job.
# Do not cd to /tmp/mvp-seed. Agents edit that tree.
set -eu
cd /tmp/island-mvp-jenkins
if [ ! -d .git ]; then
  echo "job checkout missing at /tmp/island-mvp-jenkins"
  exit 1
fi
export GRADLE_USER_HOME="${GRADLE_USER_HOME:-/var/jenkins_home/gradle}"
if [ ! -s ops/observe/grafana-mcp.env ] && [ -s /tmp/mvp-seed/ops/observe/grafana-mcp.env ]; then
  umask 077
  cp /tmp/mvp-seed/ops/observe/grafana-mcp.env ops/observe/grafana-mcp.env
fi
if [ ! -s ops/observe/grafana-mcp.env ]; then
  umask 077
  token=$(od -An -N24 -tx1 /dev/urandom | tr -d ' \n')
  printf 'MCP_GRAFANA_SERVER_TOKEN=%s\n' "$token" > ops/observe/grafana-mcp.env
fi
docker compose up -d grafana-mcp
mcp_ok=0
j=0
while [ "$j" -lt 30 ]; do
  j=$((j + 1))
  if curl -fsS --max-time 3 http://172.17.0.1:8000/healthz >/dev/null; then
    mcp_ok=1
    break
  fi
  sleep 1
done
if [ "$mcp_ok" -ne 1 ]; then
  echo "grafana mcp did not become ready"
  exit 1
fi
SHA=$(git rev-parse HEAD)
INFO=$(curl -fsS --max-time 5 http://172.17.0.1:8080/info || true)
case "$INFO" in
  *"$SHA"*)
    echo "already deployed $SHA"
    exit 0
    ;;
esac
./gradlew :server:test --no-daemon
GIT_COMMIT="$SHA" docker compose up -d --build --force-recreate app
ok=0
i=0
while [ "$i" -lt 90 ]; do
  i=$((i + 1))
  if curl -fsS --max-time 3 http://172.17.0.1:8080/info | grep -q "$SHA"; then
    ok=1
    break
  fi
  sleep 2
done
if [ "$ok" -ne 1 ]; then
  echo "deploy did not serve $SHA"
  curl -fsS --max-time 3 http://172.17.0.1:8080/info || true
  exit 1
fi
export GATLING_BASE_URL=http://172.17.0.1:8080
./gradlew :gatling:gatlingRun --no-daemon
