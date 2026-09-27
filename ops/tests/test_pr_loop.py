from __future__ import annotations

from pathlib import Path

REPO = Path(__file__).resolve().parents[2]


def test_pr_loop_keeps_the_merge_gate() -> None:
    text = (REPO / "docs" / "ops" / "workflow" / "PR-LOOP.md").read_text()
    for name in ("unit tests", "catalog tests", "web tests", "compose stack"):
        assert name in text
    assert "gh pr merge" in text
    assert "createReview" in text
    assert "continuous-integration/jenkins/branch" in text
    assert "compose stack" in text
    assert "pr-loop fix" in text
    assert "*/3 * * * *" in text
    assert "my-island PR loop" in text
    assert "draft: false" in text
    assert "Forks stay drafts" in text
    skill = (REPO / ".cursor" / "skills" / "pr-loop" / "SKILL.md").read_text()
    assert "name: pr-loop" in skill
    assert "gh pr merge" in skill
    automations = (REPO / "docs" / "ops" / "workflow" / "AUTOMATIONS.md").read_text()
    assert "my-island PR loop" in automations
    assert "cannot set" in automations
