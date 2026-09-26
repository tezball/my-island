#!/usr/bin/env bash
# Weekly Gatling perf (WF-045). Five Guests, same feature path as the trickle.
# Not a merge-CI load test. Non-zero fails the Jenkins job (red).
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO"

MVN="${REPO}/services/catalog/mvnw"
BASE_URL="${GATLING_BASE_URL:-${MOCK_PROD_PUBLIC_ORIGIN:-https://fishing-journals.com}}"
USERNAME="${CATALOG_SEED_GUEST_USERNAME:-guest}"
PASSWORD="${CATALOG_SEED_GUEST_PASSWORD:-guest}"

echo "Gatling weekly perf → ${BASE_URL} (seeded password Guest; not Google; not merge load)"

exec "$MVN" -f "${REPO}/ops/gatling/pom.xml" -B gatling:test \
  -Dgatling.simulationClass=island.gatling.GuestWeeklySimulation \
  "-Dgatling.baseUrl=${BASE_URL}" \
  "-Dgatling.username=${USERNAME}" \
  "-Dgatling.password=${PASSWORD}"
