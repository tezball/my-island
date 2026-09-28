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
    assert "cursor[bot]" in text
    assert "pull-request review tool" in text
    assert "gh api" in text
    assert "tezball" in text
    skill = (REPO / ".cursor" / "skills" / "pr-loop" / "SKILL.md").read_text()
    assert "name: pr-loop" in skill
    assert "gh pr merge" in skill
    automations = (REPO / "docs" / "ops" / "workflow" / "AUTOMATIONS.md").read_text()
    assert "my-island PR loop" in automations
    assert "cannot set" in automations
    rule = "The change and the text of the PR are the path forward."
    review = "It does not ask to revert the change the PR describes."
    fixer = "A fixer updates the ticket and the docs to match the PR and leaves the change in place."
    for blob in (
        text,
        skill,
        automations,
        (REPO / ".cursor" / "skills" / "reviewer" / "SKILL.md").read_text(),
    ):
        assert rule in blob
        assert review in blob
        assert fixer in blob
