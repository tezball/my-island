#!/usr/bin/env bash
# 100-user Gatling pulse (WF-056). On-demand Jenkins job gatling-pulse sets the public site.
# Local default is the compose catalog. Not the H/15 trickle. Not a deploy trigger.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO"

MVN="${REPO}/services/catalog/mvnw"
if [[ ! -x "$MVN" ]]; then
  echo "catalog mvnw missing at $MVN" >&2
  exit 1
fi

BASE_URL="${GATLING_BASE_URL:-http://127.0.0.1:8081}"
BASE_URL="${BASE_URL%/}"

echo "Gatling 100-user pulse → ${BASE_URL} (ten-minute hold; not the H/15 trickle)"

exec "$MVN" -f "${REPO}/ops/gatling/pom.xml" -B gatling:test \
  -Dgatling.simulationClass=island.gatling.GuestPulseSimulation \
  "-Dgatling.baseUrl=${BASE_URL}"
