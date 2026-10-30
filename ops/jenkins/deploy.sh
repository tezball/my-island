#!/bin/sh
# Jenkins runs this on the island-mvp checkout after origin/main is fast-forwarded.
# A red test never replaces the app. A red Gatling run fails the job.
set -eu
cd /repo
export GRADLE_USER_HOME="${GRADLE_USER_HOME:-/var/jenkins_home/gradle}"
SHA=$(git rev-parse HEAD)
INFO=$(curl -fsS --max-time 5 http://172.17.0.1:8080/info || true)
case "$INFO" in
  *"$SHA"*)
    echo "already deployed $SHA"
    exit 0
    ;;
esac
./gradlew :server:test --no-daemon
GIT_COMMIT="$SHA" docker compose -f /repo/compose.yml --project-directory /repo up -d --build --force-recreate app
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
  curl -fsS --max-time 3 http://127.0.0.1:8080/info || true
  exit 1
fi
export GATLING_BASE_URL=http://172.17.0.1:8080
./gradlew :gatling:gatlingRun --no-daemon
