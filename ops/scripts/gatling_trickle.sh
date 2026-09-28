#!/usr/bin/env bash
# Light Gatling trickle (WF-045 / WF-042 / WF-056). Ten seeded pulse users, one walk.
# Not the 10-minute 100-user hold. Not weekly soak. Not merge-CI load.
# Failures must be non-zero so Jenkins goes red.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO"

MVN="${REPO}/services/catalog/mvnw"
if [[ ! -x "$MVN" ]]; then
  echo "catalog mvnw missing at $MVN" >&2
  exit 1
fi

BASE_URL="${GATLING_BASE_URL:-${MOCK_PROD_PUBLIC_ORIGIN:-https://fishing-journals.com}}"

echo "Gatling light trickle → ${BASE_URL} (pulse-001..pulse-010; one walk; not weekly perf)"

exec "$MVN" -f "${REPO}/ops/gatling/pom.xml" -B gatling:test \
  "-Dgatling.baseUrl=${BASE_URL}"
