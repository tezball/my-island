#!/usr/bin/env bash
# Happy-path catalog create → list → get. Assumes ./scripts/dev up (no chaos).
#   ./scripts/sim-place-listing.sh
#   ./scripts/sim-place-listing.sh --iterations 10
#   ./scripts/sim-place-listing.sh --no-prometheus
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
SIM="$REPO/ops/scripts/sim_place_listing.py"
exec python3 "$SIM" "$@"
