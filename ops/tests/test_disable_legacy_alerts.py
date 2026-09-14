from __future__ import annotations

from pathlib import Path

import disable_legacy_alerts


def test_alertmanager_is_keep_only() -> None:
    out = disable_legacy_alerts.apply_alertmanager("smtp_from: secret")
    assert "receiver: keep" in out
    assert "email_configs" not in out
    assert "smtp_" not in out
    assert "tezball" not in out


def test_alerts_have_no_apidown() -> None:
    out = disable_legacy_alerts.apply_alerts("alert: ApiDown")
    assert "groups: []" in out
    assert "- alert:" not in out


def test_write_in_place_is_idempotent(tmp_path: Path) -> None:
    alerts = tmp_path / "alerts.yml"
    am = tmp_path / "alertmanager.yml"
    tmpl = tmp_path / "alertmanager.yml.tmpl"
    alerts.write_text("alert: ApiDown\n")
    am.write_text("smtp_from: no-reply@fishing-journals.com\n")
    tmpl.write_text("smtp_from: ${MAIL_FROM}\n")
    first = disable_legacy_alerts.apply_paths(
        alerts=alerts, alertmanager=am, alertmanager_tmpl=tmpl
    )
    second = disable_legacy_alerts.apply_paths(
        alerts=alerts, alertmanager=am, alertmanager_tmpl=tmpl
    )
    assert set(first) == {alerts, am, tmpl}
    assert set(second) == {alerts, am, tmpl}
    assert "- alert:" not in alerts.read_text()
    assert "email_configs" not in am.read_text()
    assert "smtp_" not in am.read_text()
    assert am.read_text() == tmpl.read_text()


def test_missing_files_are_skipped(tmp_path: Path) -> None:
    written = disable_legacy_alerts.apply_paths(
        alerts=tmp_path / "nope.yml",
        alertmanager=tmp_path / "nope-am.yml",
        alertmanager_tmpl=tmp_path / "nope.tmpl",
    )
    assert written == []
