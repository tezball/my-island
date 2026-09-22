from pathlib import Path

REPO = Path(__file__).resolve().parents[2]


def test_playwright_is_cron_not_a_merge_gate() -> None:
    ci = (REPO / ".github" / "workflows" / "ci.yml").read_text()
    assert "playwright" not in ci.lower()
    cron = (REPO / ".github" / "workflows" / "playwright.yml").read_text()
    assert "0 */6 * * *" in cron
    assert "https://fishing-journals.com" in cron
    assert "pull_request:" not in cron
    groovy = (REPO / "ops" / "jenkins" / "casc" / "jobs" / "playwright-cron.groovy").read_text()
    assert "H H/6 * * *" in groovy
    assert "fishing-journals.com" in groovy
    casc = (REPO / "ops" / "jenkins" / "casc" / "jenkins.yaml").read_text()
    assert "playwright-cron.groovy" in casc
    mcp = (REPO / "docs" / "ops" / "workflow" / "MCP.md").read_text()
    assert "Playwright MCP" in mcp or "Playwright" in mcp
