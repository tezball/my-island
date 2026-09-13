from __future__ import annotations

import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
DEPLOY = Path(__file__).resolve().parents[1] / "deploy"
for extra in (SCRIPTS, DEPLOY):
    if str(extra) not in sys.path:
        sys.path.insert(0, str(extra))
