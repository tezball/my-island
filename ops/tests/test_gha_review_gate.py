from __future__ import annotations

from gha_review_gate import (
    APPROVED,
    CHANGES_REQUESTED,
    decide,
    four_checks_success,
    has_valid_approve,
    latest_vote_by_user,
    pick_pr_number,
)


def _pr(*, author: str = "tezball", draft: bool = False, fork: bool = False, merged: bool = False) -> dict:
    repo = "tezball/my-island"
    head_repo = "someone/my-island" if fork else repo
    return {
        "user": {"login": author},
        "draft": draft,
        "merged": merged,
        "head": {"sha": "abc", "repo": {"full_name": head_repo}},
        "base": {"repo": {"full_name": repo}},
    }


def _review(
    login: str,
    state: str,
    *,
    commit_id: str = "abc",
    submitted_at: str = "2026-09-20T12:00:00Z",
    rid: int = 1,
) -> dict:
    return {
        "id": rid,
        "user": {"login": login},
        "state": state,
        "commit_id": commit_id,
        "submitted_at": submitted_at,
    }


def _run(name: str, *, status: str = "completed", conclusion: str = "success", rid: int = 1) -> dict:
    return {
        "id": rid,
        "name": name,
        "status": status,
        "conclusion": conclusion,
        "started_at": f"2026-09-20T12:00:0{rid}Z",
    }


def test_valid_approved_not_author_not_actions_bot() -> None:
    pr = _pr()
    reviews = [_review("cursor[bot]", APPROVED)]
    ok, why = has_valid_approve(pr, reviews, "abc")
    assert ok
    assert "cursor[bot]" in why


def test_github_actions_bot_approve_does_not_count() -> None:
    pr = _pr()
    reviews = [_review("github-actions[bot]", APPROVED)]
    ok, why = has_valid_approve(pr, reviews, "abc")
    assert not ok
    assert why == "waiting for review"


def test_author_approve_does_not_count() -> None:
    pr = _pr(author="tezball")
    reviews = [_review("tezball", APPROVED)]
    ok, why = has_valid_approve(pr, reviews, "abc")
    assert not ok


def test_stale_approve_commit_id_does_not_count() -> None:
    pr = _pr()
    reviews = [_review("reviewer", APPROVED, commit_id="old")]
    ok, why = has_valid_approve(pr, reviews, "abc")
    assert not ok
    assert why == "waiting for review"


def test_changes_requested_blocks_even_with_approve() -> None:
    pr = _pr()
    reviews = [
        _review("reviewer", APPROVED, rid=1, submitted_at="2026-09-20T12:00:00Z"),
        _review("naysayer", CHANGES_REQUESTED, rid=2, submitted_at="2026-09-20T12:01:00Z"),
    ]
    decision = decide(
        pr=pr, reviews=reviews, head_sha="abc", checks_green=True, check_runs=None
    )
    assert decision.action == "wait"
    assert decision.reason == "CHANGES_REQUESTED blocks"


def test_later_approve_clears_same_user_changes_requested() -> None:
    pr = _pr()
    reviews = [
        _review("reviewer", CHANGES_REQUESTED, rid=1, submitted_at="2026-09-20T12:00:00Z"),
        _review("reviewer", APPROVED, rid=2, submitted_at="2026-09-20T12:02:00Z"),
    ]
    decision = decide(
        pr=pr, reviews=reviews, head_sha="abc", checks_green=True, check_runs=None
    )
    assert decision.action == "merge"


def test_dismissed_changes_requested_does_not_block() -> None:
    votes = latest_vote_by_user(
        [
            _review("reviewer", CHANGES_REQUESTED, rid=1, submitted_at="2026-09-20T12:00:00Z"),
            _review("reviewer", "DISMISSED", rid=2, submitted_at="2026-09-20T12:01:00Z"),
        ]
    )
    assert "reviewer" not in votes


def test_waiting_for_review_when_ci_green_no_approve() -> None:
    decision = decide(
        pr=_pr(), reviews=[], head_sha="abc", checks_green=True, check_runs=None
    )
    assert decision.action == "wait"
    assert decision.reason == "waiting for review"


def test_draft_and_fork_skip() -> None:
    draft = decide(
        pr=_pr(draft=True),
        reviews=[_review("reviewer", APPROVED)],
        head_sha="abc",
        checks_green=True,
        check_runs=None,
    )
    assert draft.action == "skip"
    fork = decide(
        pr=_pr(fork=True),
        reviews=[_review("reviewer", APPROVED)],
        head_sha="abc",
        checks_green=True,
        check_runs=None,
    )
    assert fork.action == "skip"
    assert fork.reason == "fork — skip"


def test_four_checks_success_requires_named_jobs() -> None:
    ok, _ = four_checks_success(
        [
            _run("unit tests"),
            _run("catalog tests"),
            _run("web tests"),
            _run("compose stack"),
        ]
    )
    assert ok
    missing, why = four_checks_success(
        [_run("unit tests"), _run("catalog tests"), _run("web tests")]
    )
    assert not missing
    assert "compose stack" in why


def test_four_checks_pending_is_wait() -> None:
    ok, why = four_checks_success(
        [
            _run("unit tests"),
            _run("catalog tests"),
            _run("web tests"),
            _run("compose stack", status="in_progress", conclusion=""),
        ]
    )
    assert not ok
    assert "waiting for CI" in why


def test_review_event_waits_if_checks_not_green() -> None:
    decision = decide(
        pr=_pr(),
        reviews=[_review("reviewer", APPROVED)],
        head_sha="abc",
        checks_green=False,
        check_runs=[],
    )
    assert decision.action == "wait"
    assert decision.reason.startswith("waiting for CI")


def test_latest_failed_check_does_not_count_as_green() -> None:
    ok, why = four_checks_success(
        [
            _run("unit tests", conclusion="success", rid=1),
            _run("unit tests", conclusion="failure", rid=2),
            _run("catalog tests"),
            _run("web tests"),
            _run("compose stack"),
        ]
    )
    assert not ok
    assert "failure" in why


def test_pick_pr_number_prefers_open() -> None:
    payload = [
        {"number": 1, "state": "closed"},
        {"number": 9, "state": "open"},
    ]
    assert pick_pr_number(payload) == 9
    assert pick_pr_number([{"number": 4, "state": "closed"}]) == 4
    assert pick_pr_number([]) is None
    assert pick_pr_number({"pulls": []}) is None
