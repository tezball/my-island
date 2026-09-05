#!/usr/bin/env bash
# Idempotent Cloud Agent install: repo-tied Python test deps.
# Do not start Docker or compose here (no daemon during Builds).
set -euo pipefail

python3 -m pip install --user -r ops/tests/requirements.txt
python3 -c "import pytest, sys; print('pytest', pytest.__version__, 'python', sys.version.split()[0])"
java -version
docker --version
docker compose version
