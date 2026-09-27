from __future__ import annotations

from pathlib import Path

from gha_review_gate import (
    APPROVED,
    CHANGES_REQUESTED,
    GateError,
    decide,
    four_checks_success,
    has_valid_approve,
    latest_vote_by_user,
    pick_pr_number,
    poll_ready,
    should_mark_ready,
)

REPO = Path(__file__).resolve().parents[2]


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


def test_green_same_repo_draft_is_marked_ready() -> None:
    draft = _pr(draft=True)
    assert should_mark_ready(pr=draft, checks_green=True, check_runs=None)
    assert should_mark_ready(
        pr=draft,
        checks_green=False,
        check_runs=[
            _run("unit tests"),
            _run("catalog tests"),
            _run("web tests"),
            _run("compose stack"),
        ],
    )
    pending = [
        _run("unit tests"),
        _run("catalog tests"),
        _run("web tests"),
        _run("compose stack", status="in_progress", conclusion=""),
    ]
    assert not should_mark_ready(pr=draft, checks_green=False, check_runs=pending)
    assert not should_mark_ready(pr=_pr(draft=True, fork=True), checks_green=True, check_runs=None)
    assert not should_mark_ready(pr=_pr(), checks_green=True, check_runs=None)
    ready = dict(draft)
    ready["draft"] = False
    decision = decide(
        pr=ready,
        reviews=[_review("cursor[bot]", APPROVED)],
        head_sha="abc",
        checks_green=True,
        check_runs=None,
    )
    assert decision.action == "merge"


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


def _numbered(number: int, **kwargs: object) -> dict:
    pr = _pr(**kwargs)  # type: ignore[arg-type]
    pr["number"] = number
    return pr


def _green_runs() -> list[dict]:
    return [
        _run("unit tests", rid=1),
        _run("catalog tests", rid=2),
        _run("web tests", rid=3),
        _run("compose stack", rid=4),
    ]


def test_poll_skips_fork_without_loading_and_keeps_a_red_draft() -> None:
    loaded: list[int] = []
    marked: list[int] = []
    merged: list[tuple[int, str]] = []

    def load(number: int) -> tuple[dict, list[dict], list[dict]]:
        loaded.append(number)
        runs = _green_runs()
        runs[-1] = _run("compose stack", conclusion="failure", rid=4)
        return _numbered(number, draft=True), [], runs

    lines = poll_ready(
        [_numbered(1, draft=True), _numbered(2, fork=True)],
        load,
        lambda number, sha: merged.append((number, sha)),
        lambda number: None,
        mark=lambda number: marked.append(number),
    )
    assert loaded == [1]
    assert marked == []
    assert merged == []
    assert any("draft" in line for line in lines)
    assert any("fork" in line for line in lines)


def test_poll_marks_green_same_repo_draft_ready() -> None:
    marked: list[int] = []
    merged: list[tuple[int, str]] = []
    pr = _numbered(9, draft=True)
    lines = poll_ready(
        [pr],
        lambda number: (pr, [_review("cursor[bot]", APPROVED)], _green_runs()),
        lambda number, sha: merged.append((number, sha)),
        lambda number: None,
        mark=lambda number: marked.append(number),
    )
    assert marked == [9]
    assert merged == [(9, "abc")]
    assert any("marked ready" in line for line in lines)
    assert any("squash-merged" in line for line in lines)


def test_poll_waits_when_checks_green_but_no_approve() -> None:
    merged: list[int] = []
    pr = _numbered(7)
    lines = poll_ready(
        [pr],
        lambda number: (pr, [], _green_runs()),
        lambda number, sha: merged.append(number),
        lambda number: None,
    )
    assert merged == []
    assert any("waiting for review" in line for line in lines)


def test_poll_squash_merges_with_head_sha_when_gate_passes() -> None:
    merged: list[tuple[int, str]] = []
    dispatched: list[int] = []
    pr = _numbered(8)
    reviews = [_review("cursor[bot]", APPROVED)]
    lines = poll_ready(
        [pr],
        lambda number: (pr, reviews, _green_runs()),
        lambda number, sha: merged.append((number, sha)),
        lambda number: dispatched.append(number),
    )
    assert merged == [(8, "abc")]
    assert dispatched == [8]
    assert any("squash-merged" in line for line in lines)


def test_poll_merge_rejection_continues_to_next_pr() -> None:
    merged: list[tuple[int, str]] = []
    pr_bad = _numbered(3)
    pr_ok = _numbered(4)
    reviews = [_review("cursor[bot]", APPROVED)]

    def load(number: int) -> tuple[dict, list[dict], list[dict]]:
        pr = pr_bad if number == 3 else pr_ok
        return pr, reviews, _green_runs()

    def merge(number: int, sha: str) -> None:
        merged.append((number, sha))
        if number == 3:
            raise GateError("HTTP 405 not mergeable")

    lines = poll_ready([pr_bad, pr_ok], load, merge, lambda number: None)
    assert merged == [(3, "abc"), (4, "abc")]
    assert any("#3 merge skipped" in line for line in lines)
    assert any("#4 squash-merged" in line for line in lines)


def test_poll_pending_check_does_not_merge() -> None:
    merged: list[int] = []
    pr = _numbered(5)
    runs = _green_runs()
    runs[-1] = _run("compose stack", status="in_progress", conclusion="", rid=4)
    poll_ready(
        [pr],
        lambda number: (pr, [_review("cursor[bot]", APPROVED)], runs),
        lambda number, sha: merged.append(number),
        lambda number: None,
    )
    assert merged == []


def test_commit_status_does_not_hide_actions_check_run() -> None:
    runs = _green_runs()
    runs.append(
        {
            "context": "compose stack",
            "state": "failure",
            "id": 99,
            "description": "Jenkins",
        }
    )
    ok, why = four_checks_success(runs)
    assert ok, why


def test_latest_failed_check_run_blocks_regardless_of_app() -> None:
    runs = [
        _run("unit tests", rid=1),
        _run("catalog tests", rid=2),
        _run("web tests", rid=3),
        {
            **_run("compose stack", conclusion="success", rid=4),
            "app": {"slug": "github-actions"},
        },
        {
            **_run("compose stack", conclusion="failure", rid=5),
            "app": {"slug": "jenkins"},
        },
    ]
    ok, why = four_checks_success(runs)
    assert not ok
    assert "failure" in why


def test_earlier_failed_check_run_does_not_block_later_success() -> None:
    ok, _why = four_checks_success(
        [
            _run("unit tests"),
            _run("catalog tests"),
            _run("web tests"),
            _run("compose stack", conclusion="failure", rid=1),
            _run("compose stack", conclusion="success", rid=2),
        ]
    )
    assert ok


def test_automerge_poll_workflow_does_not_rerun_tests() -> None:
    text = (REPO / ".github" / "workflows" / "automerge-poll.yml").read_text()
    assert 'cron: "*/5 * * * *"' in text
    assert "workflow_dispatch:" in text
    assert "contents: write" in text
    assert "pull-requests: write" in text
    assert "checks: read" in text
    assert "actions: write" in text
    assert "AUTOMERGE_POLL" in text
    assert "gha_review_gate.py" in text
    assert "createReview" not in text
    assert "slack" not in text.lower()
    for job_name in (
        "name: unit tests",
        "name: catalog tests",
        "name: web tests",
        "name: compose stack",
    ):
        assert job_name not in text
    ci = (REPO / ".github" / "workflows" / "ci.yml").read_text()
    assert "schedule:" not in ci


def test_pick_pr_number_prefers_open() -> None:
    payload = [
        {"number": 1, "state": "closed"},
        {"number": 9, "state": "open"},
    ]
    assert pick_pr_number(payload) == 9
    assert pick_pr_number([{"number": 4, "state": "closed"}]) == 4
    assert pick_pr_number([]) is None
    assert pick_pr_number({"pulls": []}) is None
