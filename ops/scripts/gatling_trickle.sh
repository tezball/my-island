#!/usr/bin/env bash
# Light Gatling trickle (WF-045 / WF-042). One user, Guest login + places + VisitIntent.
# Not weekly soak. Not merge-CI load. Failures must be non-zero so Jenkins goes red.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO"

MVN="${REPO}/services/catalog/mvnw"
if [[ ! -x "$MVN" ]]; then
  echo "catalog mvnw missing at $MVN" >&2
  exit 1
fi

BASE_URL="${GATLING_BASE_URL:-${MOCK_PROD_PUBLIC_ORIGIN:-https://fishing-journals.com}}"
USERNAME="${CATALOG_SEED_GUEST_USERNAME:-guest}"
PASSWORD="${CATALOG_SEED_GUEST_PASSWORD:-guest}"

echo "Gatling light trickle → ${BASE_URL} (seeded password Guest; not Google; not weekly perf)"

exec "$MVN" -f "${REPO}/ops/gatling/pom.xml" -B gatling:test \
  "-Dgatling.baseUrl=${BASE_URL}" \
  "-Dgatling.username=${USERNAME}" \
  "-Dgatling.password=${PASSWORD}"
