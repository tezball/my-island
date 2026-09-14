#!/usr/bin/env python3
"""Mute leftover fishing-journals Prometheus/Alertmanager email (INC-001)."""

from __future__ import annotations

import argparse
from pathlib import Path

KEEP_ALERTMANAGER = """# Mock-prod is not prod (CEO 2026-09-12 / INC-001).
# Leftover fishing-journals Alertmanager emailed ApiDown because scrape
# target api:8081 is the retired FJ API (WF-032). keep = no email.
route:
  receiver: keep

receivers:
  - name: keep
"""

EMPTY_ALERTS = """# Leftover fishing-journals Prometheus rules disabled (INC-001).
# The retired FJ scrape target (api:8081) is gone after the apex cutover.
# Re-enable only when mock-prod has an intentional on-call receiver.
groups: []
"""

DEFAULT_ALERTS = "/home/ubuntu/app/infra/observability/prometheus/alerts.yml"
DEFAULT_ALERTMANAGER = "/home/ubuntu/app/infra/observability/alertmanager/alertmanager.yml"
DEFAULT_TMPL = "/home/ubuntu/app/infra/observability/alertmanager/alertmanager.yml.tmpl"


def apply_alertmanager(_text: str = "") -> str:
    return KEEP_ALERTMANAGER if KEEP_ALERTMANAGER.endswith("\n") else KEEP_ALERTMANAGER + "\n"


def apply_alerts(_text: str = "") -> str:
    return EMPTY_ALERTS if EMPTY_ALERTS.endswith("\n") else EMPTY_ALERTS + "\n"


def write_in_place(path: Path, content: str) -> bool:
    """Truncate the existing inode so Docker file bind-mounts see the write."""
    if not path.is_file():
        return False
    text = content if content.endswith("\n") else content + "\n"
    with path.open("r+", encoding="utf-8") as fh:
        fh.seek(0)
        fh.write(text)
        fh.truncate()
    return True


def apply_paths(
    *,
    alerts: Path,
    alertmanager: Path,
    alertmanager_tmpl: Path | None = None,
) -> list[Path]:
    written: list[Path] = []
    if write_in_place(alerts, apply_alerts()):
        written.append(alerts)
    if write_in_place(alertmanager, apply_alertmanager()):
        written.append(alertmanager)
    if alertmanager_tmpl is not None and write_in_place(
        alertmanager_tmpl, apply_alertmanager()
    ):
        written.append(alertmanager_tmpl)
    return written


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--alerts", default=DEFAULT_ALERTS)
    parser.add_argument("--alertmanager", default=DEFAULT_ALERTMANAGER)
    parser.add_argument("--alertmanager-tmpl", default=DEFAULT_TMPL)
    args = parser.parse_args()
    written = apply_paths(
        alerts=Path(args.alerts),
        alertmanager=Path(args.alertmanager),
        alertmanager_tmpl=Path(args.alertmanager_tmpl) if args.alertmanager_tmpl else None,
    )
    if not written:
        print("no leftover fishing-journals alert files present; skip")
        return 0
    for path in written:
        print(f"muted {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
