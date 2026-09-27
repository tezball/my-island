from __future__ import annotations

from pathlib import Path

REPO = Path(__file__).resolve().parents[2]


def test_house_alertmanager_slack_url_stays_out_of_git() -> None:
    keep = (REPO / "ops" / "observability" / "alertmanager.yml").read_text()
    slack = (REPO / "ops" / "observability" / "alertmanager.slack.yml").read_text()
    compose = (REPO / "compose.yml").read_text()
    example = (REPO / ".env.example").read_text()

    assert "receiver: keep" in keep
    assert "slack_configs" not in keep
    assert "hooks.slack.com" not in keep

    assert "receiver: slack" in slack
    assert "api_url_file: /tmp/slack-alerts-url" in slack
    assert "send_resolved: false" in slack
    assert 'channel: "#alert"' in slack
    assert "kind: alert" in slack
    assert "hooks.slack.com" not in slack
    assert "api_url:" not in slack

    assert "SLACK_ALERTS_WEBHOOK: ${SLACK_ALERTS_WEBHOOK:-}" in compose
    assert "alertmanager.slack.yml" in compose
    assert "hooks.slack.com" not in compose

    assert "SLACK_ALERTS_WEBHOOK=" in example
    assert "hooks.slack.com" not in example
