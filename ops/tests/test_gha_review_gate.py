from __future__ import annotations

from pathlib import Path

import pytest

from gha_review_gate import (
    APPROVED,
    CHANGES_REQUESTED,
    CONFLICT_COMMENT_LEAD,
    GateError,
    MainRedHold,
    QUEUE_CONTEXT,
    QUEUE_HELD_DESCRIPTION,
    REQUIRED_CHECK_NAMES,
    UpdateConflict,
    hold_is_active,
    post_commit_status,
    post_queue_for_pull,
    post_queue_status,
    queue_status_plan,
    should_post_queue,
    squash_held,
    branch_update_reason,
    comment_on_conflict,
    conflict_comment_body,
    conflict_comment_exists,
    DECISION_CONTEXT,
    MemoryClaim,
    TRIGGER_REVIEW_MESSAGE,
    begin_event,
    create_empty_commit,
    second_run_refusal,
    decide,
    dispatch_head_ci,
    fast_forward_branch,
    is_cursoragent_commit,
    should_trigger_cursoragent_review,
    four_checks_success,
    has_valid_approve,
    latest_vote_by_user,
    mark_ready,
    merge_main_into_head,
    mirror_missing_check_statuses,
    pick_pr_number,
    poll_ready,
    statuses_to_mirror,
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


def _refetched_ready(pr: dict) -> dict:
    ready = dict(pr)
    ready["draft"] = False
    return ready


def test_poll_marks_green_same_repo_draft_ready() -> None:
    marked: list[int] = []
    merged: list[tuple[int, str]] = []
    pr = _numbered(9, draft=True)

    def mark(number: int) -> dict:
        marked.append(number)
        return _refetched_ready(pr)

    lines = poll_ready(
        [pr],
        lambda number: (pr, [_review("cursor[bot]", APPROVED)], _green_runs()),
        lambda number, sha: merged.append((number, sha)),
        lambda number: None,
        mark=mark,
    )
    assert marked == [9]
    assert merged == [(9, "abc")]
    assert any("marked ready" in line for line in lines)
    assert any("squash-merged" in line for line in lines)


def test_memory_only_ready_flip_does_not_count() -> None:
    merged: list[tuple[int, str]] = []
    pr = _numbered(9, draft=True)

    def mark(number: int) -> None:
        del number
        pr["draft"] = False
        return None

    lines = poll_ready(
        [pr],
        lambda number: (pr, [_review("cursor[bot]", APPROVED)], _green_runs()),
        lambda number, sha: merged.append((number, sha)),
        lambda number: None,
        mark=mark,
    )
    assert merged == []
    assert not any("marked ready" in line for line in lines)
    assert any("ready skipped: still a draft" in line for line in lines)
    assert any("draft — skip" in line for line in lines)


def test_ready_mutation_failure_stays_a_draft() -> None:
    merged: list[int] = []
    pr = _numbered(9, draft=True)

    def mark(number: int) -> dict:
        del number
        raise GateError("graphql: boom")

    lines = poll_ready(
        [pr],
        lambda number: (pr, [_review("cursor[bot]", APPROVED)], _green_runs()),
        lambda number, sha: merged.append(number),
        lambda number: None,
        mark=mark,
    )
    assert merged == []
    assert not any("marked ready" in line for line in lines)
    assert any("ready skipped: graphql: boom" in line for line in lines)
    assert any("draft — skip" in line for line in lines)


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
    assert 'cron: "0 * * * *"' in text
    assert "*/5" not in text
    assert "H/5" not in text
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


def test_behind_same_repo_merges_main_and_does_not_squash() -> None:
    updated: list[tuple[int, str, str]] = []
    marked: list[int] = []
    merged: list[tuple[int, str]] = []
    pr = _numbered(11)
    pr["head"]["ref"] = "feature"
    pr["mergeable_state"] = "behind"
    pr["mergeable"] = True
    lines = poll_ready(
        [pr],
        lambda number: (
            pr,
            [_review("cursor[bot]", APPROVED)],
            _green_runs(),
            {"behind_by": 2, "status": "behind"},
        ),
        lambda number, sha: merged.append((number, sha)),
        lambda number: None,
        mark=lambda number: marked.append(number),
        update=lambda current, reason: updated.append(
            (current["number"], reason, current["head"]["ref"])
        )
        or True,
    )
    assert updated == [(11, "behind", "feature")]
    assert marked == []
    assert merged == []
    assert any("updated: merged origin/main (behind)" in line for line in lines)


def test_successful_behind_merge_dispatches_ci_on_head_ref() -> None:
    dispatched: list[str] = []
    merged: list[tuple[int, str]] = []
    pr = _numbered(11)
    pr["head"]["ref"] = "cursor/pr-loop-clean-green-86de"
    pr["mergeable_state"] = "behind"
    pr["mergeable"] = True
    lines = poll_ready(
        [pr],
        lambda number: (
            pr,
            [_review("cursor[bot]", APPROVED)],
            _green_runs(),
            {"behind_by": 2, "status": "behind"},
        ),
        lambda number, sha: merged.append((number, sha)),
        lambda number: None,
        update=lambda current, reason: True,
        dispatch_head=lambda current: dispatched.append(current["head"]["ref"]),
    )
    assert dispatched == ["cursor/pr-loop-clean-green-86de"]
    assert merged == []
    assert any("dispatched CI on cursor/pr-loop-clean-green-86de" in line for line in lines)
    assert not any("dispatched CI on main" in line for line in lines)
    assert not any("waiting for review" in line for line in lines)


def test_successful_dirty_merge_dispatches_ci_on_head_ref() -> None:
    dispatched: list[str] = []
    pr = _numbered(12)
    pr["head"]["ref"] = "feature"
    pr["mergeable_state"] = "dirty"
    pr["mergeable"] = False
    lines = poll_ready(
        [pr],
        lambda number: (
            pr,
            [_review("cursor[bot]", APPROVED)],
            _green_runs(),
            {"behind_by": 1, "status": "diverged"},
        ),
        lambda number, sha: None,
        lambda number: None,
        update=lambda current, reason: reason == "dirty",
        dispatch_head=lambda current: dispatched.append(current["head"]["ref"]),
    )
    assert dispatched == ["feature"]
    assert any("dispatched CI on feature" in line for line in lines)
    assert any("updated: merged origin/main (dirty)" in line for line in lines)


def test_ci_dispatch_failure_is_logged_and_poll_continues() -> None:
    dispatched: list[str] = []
    merged: list[int] = []
    first = _numbered(11)
    first["head"]["ref"] = "feature"
    first["mergeable_state"] = "behind"
    first["mergeable"] = True
    second = _numbered(13)
    second["head"]["ref"] = "other"
    second["mergeable_state"] = "behind"
    second["mergeable"] = True

    def dispatch_head(current: dict) -> None:
        ref = current["head"]["ref"]
        if ref == "feature":
            raise GateError("HTTP 403 dispatch")
        dispatched.append(ref)

    lines = poll_ready(
        [first, second],
        lambda number: (
            first if number == 11 else second,
            [_review("cursor[bot]", APPROVED)],
            _green_runs(),
            {"behind_by": 1, "status": "behind"},
        ),
        lambda number, sha: merged.append(number),
        lambda number: None,
        update=lambda current, reason: True,
        dispatch_head=dispatch_head,
    )
    assert dispatched == ["other"]
    assert merged == []
    assert any("#11 CI dispatch skipped: HTTP 403 dispatch" in line for line in lines)
    assert any("#13 dispatched CI on other" in line for line in lines)


def test_already_up_to_date_merge_does_not_dispatch_ci() -> None:
    dispatched: list[str] = []
    pr = _numbered(8)
    pr["head"]["ref"] = "feature"
    pr["mergeable_state"] = "behind"
    pr["mergeable"] = True
    poll_ready(
        [pr],
        lambda number: (pr, [_review("cursor[bot]", APPROVED)], _green_runs(), None),
        lambda number, sha: None,
        lambda number: None,
        update=lambda current, reason: False,
        dispatch_head=lambda current: dispatched.append(current["head"]["ref"]),
    )
    assert dispatched == []


def test_fork_behind_does_not_dispatch_ci() -> None:
    dispatched: list[str] = []
    pr = _numbered(2, fork=True, draft=True)
    pr["head"]["ref"] = "feature"
    pr["mergeable_state"] = "behind"
    pr["mergeable"] = True
    poll_ready(
        [pr],
        lambda number: (pr, [], _green_runs(), {"behind_by": 4, "status": "behind"}),
        lambda number, sha: None,
        lambda number: None,
        update=lambda current, reason: True,
        dispatch_head=lambda current: dispatched.append("called"),
    )
    assert dispatched == []


def test_dispatch_head_ci_posts_branch_not_main(monkeypatch: pytest.MonkeyPatch) -> None:
    seen: dict[str, object] = {}

    def fake(method: str, url: str, token: str, payload: dict | None = None, timeout: float = 30):
        del token, timeout
        seen["method"] = method
        seen["url"] = url
        seen["payload"] = payload
        return {}, ""

    monkeypatch.setattr("gha_review_gate._github_request", fake)
    dispatch_head_ci("tezball", "my-island", "cursor/pr-loop-draft-undraft-86de", "tok")
    assert seen["method"] == "POST"
    assert str(seen["url"]).endswith("/actions/workflows/ci.yml/dispatches")
    payload = seen["payload"]
    assert isinstance(payload, dict)
    assert payload["ref"] == "cursor/pr-loop-draft-undraft-86de"
    assert payload["ref"] != "main"
    with pytest.raises(GateError, match="refuse to dispatch CI on main"):
        dispatch_head_ci("tezball", "my-island", "main", "tok")


def test_dirty_conflict_comments_and_skips() -> None:
    comments: list[tuple[int, str]] = []
    marked: list[int] = []
    merged: list[int] = []
    pr = _numbered(12)
    pr["head"]["ref"] = "feature"
    pr["mergeable_state"] = "dirty"
    pr["mergeable"] = False

    def update(current: dict, reason: str) -> bool:
        del current, reason
        raise UpdateConflict("HTTP 409")

    lines = poll_ready(
        [pr],
        lambda number: (
            pr,
            [_review("cursor[bot]", APPROVED)],
            _green_runs(),
            {"behind_by": 1, "status": "diverged"},
        ),
        lambda number, sha: merged.append(number),
        lambda number: None,
        mark=lambda number: marked.append(number),
        update=update,
        on_conflict=lambda number, sha: comments.append((number, sha)),
    )
    assert comments == [(12, "abc")]
    assert marked == []
    assert merged == []
    assert any(CONFLICT_COMMENT_LEAD in line for line in lines)


def test_up_to_date_draft_is_still_marked_ready() -> None:
    called: list[str] = []
    marked: list[int] = []
    pr = _numbered(9, draft=True)
    pr["head"]["ref"] = "feature"
    pr["mergeable_state"] = "clean"
    pr["mergeable"] = True
    def mark(number: int) -> dict:
        marked.append(number)
        return _refetched_ready(pr)

    lines = poll_ready(
        [pr],
        lambda number: (pr, [], _green_runs(), {"behind_by": 0, "status": "ahead"}),
        lambda number, sha: None,
        lambda number: None,
        mark=mark,
        update=lambda current, reason: called.append(reason) or True,
    )
    assert called == []
    assert marked == [9]
    assert any("marked ready" in line for line in lines)
    assert any("waiting for review" in line for line in lines)


def test_fork_is_not_updated_even_when_behind() -> None:
    called: list[str] = []
    pr = _numbered(2, fork=True, draft=True)
    pr["mergeable_state"] = "behind"
    pr["mergeable"] = True
    compare = {"behind_by": 4, "status": "behind"}
    assert branch_update_reason(pr, compare) is None
    poll_ready(
        [pr],
        lambda number: (pr, [], _green_runs(), compare),
        lambda number, sha: None,
        lambda number: None,
        update=lambda current, reason: called.append(reason) or True,
    )
    assert called == []


def test_diverged_compare_counts_as_behind() -> None:
    pr = _numbered(1)
    pr["mergeable_state"] = "blocked"
    pr["mergeable"] = True
    assert branch_update_reason(pr, {"behind_by": 3, "status": "diverged"}) == "behind"


def test_stale_behind_flag_still_merges_when_already_up_to_date() -> None:
    merged: list[tuple[int, str]] = []
    pr = _numbered(8)
    pr["head"]["ref"] = "feature"
    pr["mergeable_state"] = "behind"
    pr["mergeable"] = True
    lines = poll_ready(
        [pr],
        lambda number: (pr, [_review("cursor[bot]", APPROVED)], _green_runs(), None),
        lambda number, sha: merged.append((number, sha)),
        lambda number: None,
        update=lambda current, reason: False,
    )
    assert merged == [(8, "abc")]
    assert any("squash-merged" in line for line in lines)


def test_actions_bot_approve_still_does_not_merge() -> None:
    merged: list[int] = []
    pr = _numbered(6)
    pr["mergeable_state"] = "clean"
    pr["mergeable"] = True
    lines = poll_ready(
        [pr],
        lambda number: (
            pr,
            [_review("github-actions[bot]", APPROVED)],
            _green_runs(),
            {"behind_by": 0, "status": "ahead"},
        ),
        lambda number, sha: merged.append(number),
        lambda number: None,
        update=lambda current, reason: True,
    )
    assert merged == []
    assert any("waiting for review" in line for line in lines)


def test_merge_main_into_head_posts_a_merge_commit(monkeypatch: pytest.MonkeyPatch) -> None:
    seen: dict[str, object] = {}

    def fake(method: str, url: str, token: str, payload: dict | None = None, timeout: float = 30):
        del token, timeout
        seen["method"] = method
        seen["url"] = url
        seen["payload"] = payload
        return {"sha": "deadbeef"}, ""

    monkeypatch.setattr("gha_review_gate._github_request", fake)
    assert merge_main_into_head("tezball", "my-island", "feature", "tok") is True
    assert seen["method"] == "POST"
    assert str(seen["url"]).endswith("/repos/tezball/my-island/merges")
    payload = seen["payload"]
    assert isinstance(payload, dict)
    assert payload["base"] == "feature"
    assert payload["head"] == "main"
    assert "force" not in payload


def test_merge_main_into_head_conflict_and_refuse_main(monkeypatch: pytest.MonkeyPatch) -> None:
    def fake(method: str, url: str, token: str, payload: dict | None = None, timeout: float = 30):
        del method, url, token, payload, timeout
        raise GateError("HTTP 409 conflict", status=409)

    monkeypatch.setattr("gha_review_gate._github_request", fake)
    with pytest.raises(UpdateConflict):
        merge_main_into_head("tezball", "my-island", "feature", "tok")
    with pytest.raises(GateError, match="refuse to merge into main"):
        merge_main_into_head("tezball", "my-island", "main", "tok")


def test_merge_main_into_head_already_contains_main(monkeypatch: pytest.MonkeyPatch) -> None:
    def fake(method: str, url: str, token: str, payload: dict | None = None, timeout: float = 30):
        del method, url, token, payload, timeout
        return None, ""

    monkeypatch.setattr("gha_review_gate._github_request", fake)
    assert merge_main_into_head("tezball", "my-island", "feature", "tok") is False


def test_conflict_comment_posts_once_and_is_not_a_review(monkeypatch: pytest.MonkeyPatch) -> None:
    posted: list[tuple[str, str, dict]] = []
    comments: list[dict] = []

    def fake_fetch(owner: str, repo: str, number: int, token: str) -> list[dict]:
        del owner, repo, number, token
        return list(comments)

    def fake_request(method: str, url: str, token: str, payload: dict | None = None, timeout: float = 30):
        del token, timeout
        assert payload is not None
        posted.append((method, url, payload))
        comments.append(payload)
        return {"id": 1}, ""

    monkeypatch.setattr("gha_review_gate.fetch_issue_comments", fake_fetch)
    monkeypatch.setattr("gha_review_gate._github_request", fake_request)
    assert comment_on_conflict("tezball", "my-island", 4, "abc", "tok") is True
    assert comment_on_conflict("tezball", "my-island", 4, "abc", "tok") is False
    assert len(posted) == 1
    assert posted[0][0] == "POST"
    assert posted[0][1].endswith("/issues/4/comments")
    assert "/reviews" not in posted[0][1]
    body = conflict_comment_body("abc")
    assert posted[0][2]["body"] == body
    assert conflict_comment_exists([{"body": body}], "abc")
    assert CONFLICT_COMMENT_LEAD in body
    assert "did not force-push" in body


def test_mark_ready_uses_graphql_then_refetch(monkeypatch: pytest.MonkeyPatch) -> None:
    fetches: list[dict] = [
        {"node_id": "PR_node", "draft": True, "number": 9},
        {"node_id": "PR_node", "draft": False, "number": 9},
    ]
    seen: dict[str, object] = {}

    def fake_fetch(owner: str, repo: str, number: int, token: str) -> dict:
        del owner, repo, number, token
        return fetches.pop(0)

    def fake_request(method: str, url: str, token: str, payload: dict | None = None, timeout: float = 30):
        del token, timeout
        seen["method"] = method
        seen["url"] = url
        seen["payload"] = payload
        return {"data": {"markPullRequestReadyForReview": {"pullRequest": {"isDraft": False}}}}, ""

    monkeypatch.setattr("gha_review_gate.fetch_pr", fake_fetch)
    monkeypatch.setattr("gha_review_gate._github_request", fake_request)
    refreshed = mark_ready("tezball", "my-island", 9, "tok")
    assert refreshed["draft"] is False
    assert seen["method"] == "POST"
    assert seen["url"] == "https://api.github.com/graphql"
    payload = seen["payload"]
    assert isinstance(payload, dict)
    assert "markPullRequestReadyForReview" in payload["query"]
    assert payload["variables"] == {"id": "PR_node"}
    assert "draft" not in payload
    assert fetches == []


def test_mark_ready_does_not_patch_rest_draft() -> None:
    text = (REPO / "ops" / "scripts" / "gha_review_gate.py").read_text()
    assert "markPullRequestReadyForReview" in text
    assert '{"draft": False}' not in text
    assert "{'draft': False}" not in text
    assert "PATCH" not in text.split("def mark_ready", 1)[1].split("def confirm_ready", 1)[0]


def test_no_second_five_minute_poll() -> None:
    workflows = REPO / ".github" / "workflows"
    scheduled = [
        path.name
        for path in sorted(workflows.glob("*.yml"))
        if 'cron: "*/5' in path.read_text() or 'cron: "H/5' in path.read_text()
    ]
    assert scheduled == []
    poll = (workflows / "automerge-poll.yml").read_text()
    assert 'cron: "0 * * * *"' in poll
    assert poll.count("cron:") == 1
    assert "issues: write" in poll
    assert "on:\n  schedule:" in poll
    assert "gha_review_gate.py" in poll


def test_one_event_does_not_double_merge() -> None:
    claim = MemoryClaim()
    merges: list[str] = []
    pr = _numbered(8)
    pr["mergeable_state"] = "clean"
    pr["mergeable"] = True

    def once() -> list[str]:
        return poll_ready(
            [pr],
            lambda number: (
                pr,
                [_review("cursor[bot]", APPROVED)],
                _green_runs(),
                {"behind_by": 0, "status": "ahead"},
            ),
            lambda number, sha: merges.append(sha),
            lambda number: None,
            claim=claim,
        )

    first = once()
    second = once()
    assert merges == ["abc"]
    assert any("squash-merged" in line for line in first)
    assert any("refused: already decided" in line for line in second)

    inflight = MemoryClaim()
    inflight.put("abc", "pending", "in flight")
    assert begin_event(inflight, "abc", review_event=False) == "in flight"
    assert second_run_refusal(inflight.get("abc"), review_event=True) == "in flight"
    blocked: list[str] = []
    lines = poll_ready(
        [pr],
        lambda number: (
            pr,
            [_review("cursor[bot]", APPROVED)],
            _green_runs(),
            {"behind_by": 0, "status": "ahead"},
        ),
        lambda number, sha: blocked.append(sha),
        lambda number: None,
        claim=inflight,
    )
    assert blocked == []
    assert any("refused: in flight" in line for line in lines)


def test_poll_does_not_merge_main_unless_about_to_squash() -> None:
    called: list[str] = []
    merged: list[int] = []
    pr = _numbered(11)
    pr["head"]["ref"] = "feature"
    pr["mergeable_state"] = "behind"
    pr["mergeable"] = True
    lines = poll_ready(
        [pr],
        lambda number: (
            pr,
            [],
            _green_runs(),
            {"behind_by": 2, "status": "behind"},
        ),
        lambda number, sha: merged.append(number),
        lambda number: None,
        update=lambda current, reason: called.append(reason) or True,
    )
    assert called == []
    assert merged == []
    assert any("waiting for review" in line for line in lines)
    assert not any("updated: merged origin/main" in line for line in lines)


def test_hourly_backstop_still_calls_the_gate() -> None:
    poll = (REPO / ".github" / "workflows" / "automerge-poll.yml").read_text()
    automerge = (REPO / ".github" / "workflows" / "automerge.yml").read_text()
    assert 'cron: "0 * * * *"' in poll
    assert "*/5" not in poll
    assert "AUTOMERGE_POLL" in poll
    assert "gha_review_gate.py" in poll
    assert "workflow_dispatch:" in poll
    assert "check_run:" in automerge
    assert "cancel-in-progress: false" in automerge
    assert "github.event.review.user.login != github.event.pull_request.user.login" in automerge
    assert "gha_review_gate.py" in automerge


def test_cursoragent_trigger_commit_is_still_present() -> None:
    text = (REPO / "ops" / "scripts" / "gha_review_gate.py").read_text()
    assert TRIGGER_REVIEW_MESSAGE == "Trigger review for pull request head"
    assert f'TRIGGER_REVIEW_MESSAGE = "{TRIGGER_REVIEW_MESSAGE}"' in text
    assert "def trigger_cursoragent_review" in text
    assert "def create_empty_commit" in text
    assert "tezball86@gmail.com" not in text
    assert "git config" not in text
    assert DECISION_CONTEXT == "automerge/decision"
    assert DECISION_CONTEXT not in REQUIRED_CHECK_NAMES
    note = (REPO / "docs" / "ops" / "workflow" / "AUTOMATIONS.md").read_text()
    assert "https://cursor.com/automations/2a5248fd-aedf-11f1-bf4b-42ffb4d10ea7" in note
    assert TRIGGER_REVIEW_MESSAGE in note
    assert "Run as Terry" in note


def test_review_event_may_rerun_after_waiting_decision() -> None:
    claim = MemoryClaim()
    claim.put("abc", "success", "review:waiting for review")
    assert second_run_refusal(claim.get("abc"), review_event=False) == "already decided"
    assert second_run_refusal(claim.get("abc"), review_event=True) is None
    assert begin_event(claim, "abc", review_event=True) is None


def test_pick_pr_number_prefers_open() -> None:
    payload = [
        {"number": 1, "state": "closed"},
        {"number": 9, "state": "open"},
    ]
    assert pick_pr_number(payload) == 9
    assert pick_pr_number([{"number": 4, "state": "closed"}]) == 4
    assert pick_pr_number([]) is None
    assert pick_pr_number({"pulls": []}) is None


def _actions_run(
    name: str,
    *,
    conclusion: str = "success",
    status: str = "completed",
    rid: int = 1,
    slug: str = "github-actions",
) -> dict:
    return {
        "id": rid,
        "name": name,
        "status": status,
        "conclusion": conclusion,
        "app": {"slug": slug},
        "started_at": f"2026-09-20T12:00:0{rid}Z",
    }


def _four_actions_runs() -> list[dict]:
    return [
        _actions_run("unit tests", rid=1),
        _actions_run("catalog tests", rid=2),
        _actions_run("web tests", rid=3),
        _actions_run("compose stack", rid=4),
    ]


def test_statuses_to_mirror_copies_only_missing_names() -> None:
    plan = statuses_to_mirror(
        _four_actions_runs(),
        {"unit tests", "jenkins/compose stack"},
        {},
    )
    assert plan == [
        ("catalog tests", "success"),
        ("web tests", "success"),
        ("compose stack", "success"),
    ]


def test_statuses_to_mirror_copies_failure_and_skips_unfinished() -> None:
    runs = [
        _actions_run("unit tests", conclusion="failure", rid=1),
        _actions_run("catalog tests", status="in_progress", conclusion="", rid=2),
        _actions_run("web tests", conclusion="skipped", rid=3),
        _actions_run("compose stack", conclusion="success", rid=4, slug="jenkins"),
    ]
    assert statuses_to_mirror(runs, set(), {}) == [("unit tests", "failure")]


def test_statuses_to_mirror_does_not_overwrite_failure_with_success() -> None:
    plan = statuses_to_mirror(
        _four_actions_runs(),
        set(),
        {"compose stack": "failure", "jenkins/compose stack": "failure"},
    )
    assert ("compose stack", "success") not in plan
    assert ("unit tests", "success") in plan
    assert all(not context.startswith("jenkins/") for context, _state in plan)


def test_missing_check_run_posts_nothing_for_that_name() -> None:
    runs = [run for run in _four_actions_runs() if run["name"] != "web tests"]
    plan = statuses_to_mirror(runs, set(), {})
    assert "web tests" not in {context for context, _state in plan}


def test_post_commit_status_uses_statuses_api(monkeypatch: pytest.MonkeyPatch) -> None:
    seen: dict[str, object] = {}

    def fake(method: str, url: str, token: str, payload: dict | None = None, timeout: float = 30):
        del token, timeout
        seen["method"] = method
        seen["url"] = url
        seen["payload"] = payload
        return {}, ""

    monkeypatch.setattr("gha_review_gate._github_request", fake)
    post_commit_status("tezball", "my-island", "abc", "unit tests", "success", "tok")
    assert seen["method"] == "POST"
    assert str(seen["url"]).endswith("/statuses/abc")
    assert "/check-runs" not in str(seen["url"])
    payload = seen["payload"]
    assert isinstance(payload, dict)
    assert payload["context"] == "unit tests"
    assert payload["state"] == "success"
    with pytest.raises(GateError, match="not success or failure"):
        post_commit_status("tezball", "my-island", "abc", "unit tests", "pending", "tok")
    with pytest.raises(GateError, match="outside the four check names"):
        post_commit_status("tezball", "my-island", "abc", "jenkins/compose stack", "success", "tok")


def test_mirror_refetches_rollup_after_posting(monkeypatch: pytest.MonkeyPatch) -> None:
    rollups = [set(), {"unit tests", "catalog tests", "web tests", "compose stack"}]
    posted: list[tuple[str, str]] = []

    def fake_rollup(owner: str, repo: str, number: int, head_sha: str, token: str) -> set[str]:
        del owner, repo, number, head_sha, token
        return rollups.pop(0)

    def fake_states(owner: str, repo: str, sha: str, token: str) -> dict[str, str]:
        del owner, repo, sha, token
        return {"jenkins/compose stack": "failure"}

    def fake_post(owner: str, repo: str, sha: str, context: str, state: str, token: str) -> None:
        del owner, repo, sha, token
        posted.append((context, state))

    monkeypatch.setattr("gha_review_gate.fetch_pr_rollup_names", fake_rollup)
    monkeypatch.setattr("gha_review_gate.fetch_commit_status_states", fake_states)
    monkeypatch.setattr("gha_review_gate.post_commit_status", fake_post)
    lines = mirror_missing_check_statuses(
        "tezball", "my-island", 129, "b4e5dcb", _four_actions_runs(), "tok"
    )
    assert posted == [
        ("unit tests", "success"),
        ("catalog tests", "success"),
        ("web tests", "success"),
        ("compose stack", "success"),
    ]
    assert any("rollup refreshed" in line for line in lines)
    assert rollups == []
    assert not any("rollup still missing" in line for line in lines)


def test_poll_mirrors_then_keeps_the_approval_gate() -> None:
    mirrored: list[int] = []
    merged: list[int] = []
    pr = _numbered(129)
    pr["head"]["sha"] = "b4e5dcb"
    lines = poll_ready(
        [pr],
        lambda number: (pr, [], _four_actions_runs(), {"behind_by": 0, "status": "ahead"}),
        lambda number, sha: merged.append(number),
        lambda number: None,
        mirror=lambda current, runs: mirrored.append(current["number"]) or ["#129 mirrored unit tests success"],
    )
    assert mirrored == [129]
    assert merged == []
    assert any("waiting for review" in line for line in lines)
    assert any("mirrored unit tests success" in line for line in lines)


def test_poll_does_not_mirror_a_fork() -> None:
    mirrored: list[int] = []
    pr = _numbered(2, fork=True, draft=True)
    poll_ready(
        [pr],
        lambda number: (pr, [], _four_actions_runs(), {"behind_by": 1, "status": "behind"}),
        lambda number, sha: None,
        lambda number: None,
        mirror=lambda current, runs: mirrored.append(current["number"]) or [],
    )
    assert mirrored == []


def test_automerge_workflow_can_write_statuses() -> None:
    automerge = (REPO / ".github" / "workflows" / "automerge.yml").read_text()
    poll = (REPO / ".github" / "workflows" / "automerge-poll.yml").read_text()
    assert "statuses: write" in automerge
    assert "statuses: write" in poll


def _cursoragent_commit(message: str = "feat: something") -> dict:
    return {
        "sha": "abc",
        "commit": {
            "message": message,
            "author": {"name": "Cursor Agent", "email": "cursoragent@cursor.com"},
            "tree": {"sha": "tree123"},
        },
    }


def test_cursoragent_email_is_the_head_author() -> None:
    assert is_cursoragent_commit(_cursoragent_commit())
    other = _cursoragent_commit()
    other["commit"]["author"] = {"name": "github-actions[bot]", "email": "41898282+github-actions[bot]@users.noreply.github.com"}
    assert not is_cursoragent_commit(other)


def test_should_trigger_review_only_when_green_and_unapproved() -> None:
    pr = _numbered(4)
    pr["head"]["sha"] = "abc"
    commit = _cursoragent_commit()
    assert should_trigger_cursoragent_review(commit, pr, [], _green_runs())
    assert not should_trigger_cursoragent_review(
        _cursoragent_commit(TRIGGER_REVIEW_MESSAGE), pr, [], _green_runs()
    )
    assert not should_trigger_cursoragent_review(commit, _numbered(2, fork=True), [], _green_runs())
    red = _green_runs()
    red[-1] = _run("compose stack", conclusion="failure", rid=4)
    assert not should_trigger_cursoragent_review(commit, pr, [], red)
    approved = [_review("cursor[bot]", APPROVED)]
    assert not should_trigger_cursoragent_review(commit, pr, approved, _green_runs())
    author_only = [_review("tezball", APPROVED)]
    assert should_trigger_cursoragent_review(commit, pr, author_only, _green_runs())


def test_empty_trigger_commit_fast_forwards_without_author(monkeypatch: pytest.MonkeyPatch) -> None:
    seen: list[tuple[str, str, dict]] = []

    def fake(method: str, url: str, token: str, payload: dict | None = None, timeout: float = 30):
        del token, timeout
        seen.append((method, url, payload or {}))
        if url.endswith("/git/commits"):
            return {"sha": "newsha"}, ""
        return {}, ""

    monkeypatch.setattr("gha_review_gate._github_request", fake)
    assert create_empty_commit("tezball", "my-island", "abc", "tree123", "tok") == "newsha"
    fast_forward_branch("tezball", "my-island", "cursor/feature", "newsha", "tok")
    created = seen[0][2]
    assert seen[0][0] == "POST"
    assert seen[0][1].endswith("/git/commits")
    assert created["message"] == TRIGGER_REVIEW_MESSAGE
    assert created["tree"] == "tree123"
    assert created["parents"] == ["abc"]
    assert "author" not in created
    assert "committer" not in created
    moved = seen[1][2]
    assert seen[1][0] == "PATCH"
    assert seen[1][1].endswith("/git/refs/heads/cursor/feature")
    assert moved == {"sha": "newsha", "force": False}
    with pytest.raises(GateError, match="refuse to update main"):
        fast_forward_branch("tezball", "my-island", "main", "newsha", "tok")


def test_poll_trigger_skips_mirror_ready_and_squash() -> None:
    mirrored: list[int] = []
    marked: list[int] = []
    merged: list[int] = []
    pr = _numbered(4)
    pr["head"]["ref"] = "cursor/feature"
    lines = poll_ready(
        [pr],
        lambda number: (pr, [], _green_runs(), {"behind_by": 0, "status": "ahead"}),
        lambda number, sha: merged.append(number),
        lambda number: None,
        mark=lambda number: marked.append(number),
        mirror=lambda current, runs: mirrored.append(current["number"]) or [],
        trigger=lambda current, reviews, runs: ["#4 triggered review"],
    )
    assert mirrored == []
    assert marked == []
    assert merged == []
    assert any("triggered review" in line for line in lines)
    assert not any("squash-merged" in line for line in lines)


def test_existing_trigger_commit_does_not_push_another() -> None:
    pr = _numbered(4)
    assert not should_trigger_cursoragent_review(
        _cursoragent_commit(TRIGGER_REVIEW_MESSAGE + "\n\nbody"),
        pr,
        [],
        _green_runs(),
    )


def test_poll_skips_squash_while_held_except_main_fix() -> None:
    merged: list[tuple[int, str]] = []
    held = _numbered(8)
    fix = _numbered(9)
    fix["labels"] = [{"name": "main-fix"}]
    reviews = [_review("cursor[bot]", APPROVED)]

    def load(number: int) -> tuple[dict, list[dict], list[dict]]:
        pr = held if number == 8 else fix
        return pr, reviews, _green_runs()

    lines = poll_ready(
        [held, fix],
        load,
        lambda number, sha: merged.append((number, sha)),
        lambda number: None,
        hold=lambda pr: squash_held(pr, active=True),
    )
    assert merged == [(9, "abc")]
    assert any("#8 squash skipped: held while main is red" in line for line in lines)
    assert any("valid APPROVED" in line for line in lines)
    assert any("#9 squash-merged" in line for line in lines)


def test_hold_still_marks_ready_then_skips_squash() -> None:
    marked: list[int] = []
    merged: list[int] = []
    pr = _numbered(8, draft=True)

    def mark(number: int) -> dict:
        marked.append(number)
        return _refetched_ready(pr)

    lines = poll_ready(
        [pr],
        lambda number: (pr, [_review("cursor[bot]", APPROVED)], _green_runs()),
        lambda number, sha: merged.append(number),
        lambda number: None,
        mark=mark,
        hold=lambda current: True,
    )
    assert marked == [8]
    assert merged == []
    assert any("marked ready" in line for line in lines)
    assert any("squash skipped: held while main is red" in line for line in lines)


def test_main_fix_still_needs_approval_and_four_checks() -> None:
    merged: list[int] = []
    fix = _numbered(9)
    fix["labels"] = [{"name": "main-fix"}]
    lines = poll_ready(
        [fix],
        lambda number: (fix, [], _green_runs()),
        lambda number, sha: merged.append(number),
        lambda number: None,
        hold=lambda current: False,
    )
    assert merged == []
    assert any("waiting for review" in line for line in lines)

    red = _green_runs()
    red[0] = _run("unit tests", conclusion="failure", rid=1)
    lines = poll_ready(
        [fix],
        lambda number: (fix, [_review("cursor[bot]", APPROVED)], red),
        lambda number, sha: merged.append(number),
        lambda number: None,
        hold=lambda current: False,
    )
    assert merged == []
    assert any("waiting for CI" in line for line in lines)


def test_only_main_fix_label_may_squash() -> None:
    mentioned = _numbered(12)
    labeled = _numbered(12)
    labeled["labels"] = [{"name": "main-fix"}]
    assert squash_held(mentioned, active=True) is True
    assert squash_held(labeled, active=True) is False


def test_pending_does_not_activate_hold_or_skip_squash() -> None:
    assert hold_is_active(open_issues=1, states=["pending"]) is False
    assert (
        hold_is_active(
            open_issues=1,
            states=["success", "pending", "skipped", "cancelled", "neutral"],
        )
        is False
    )
    assert hold_is_active(open_issues=0, states=["failure"]) is False
    assert hold_is_active(open_issues=1, states=["pending", "failure"]) is True
    assert hold_is_active(open_issues=1, states=None) is True
    merged: list[tuple[int, str]] = []
    pr = _numbered(8)
    lines = poll_ready(
        [pr],
        lambda number: (pr, [_review("cursor[bot]", APPROVED)], _green_runs()),
        lambda number, sha: merged.append((number, sha)),
        lambda number: None,
        hold=lambda current: squash_held(
            current,
            active=hold_is_active(open_issues=1, states=["pending"]),
        ),
    )
    assert merged == [(8, "abc")]
    assert not any("squash skipped" in line for line in lines)


def test_queue_status_is_not_a_real_check() -> None:
    other = _numbered(3)
    fix = _numbered(4)
    fix["labels"] = [{"name": "main-fix"}]
    fork = _numbered(6, fork=True)
    assert queue_status_plan(other, active=True, main_sha="mainsha") == (
        "failure",
        QUEUE_HELD_DESCRIPTION,
    )
    assert QUEUE_HELD_DESCRIPTION == "held while main is red"
    assert queue_status_plan(fix, active=True, main_sha="mainsha") == ("success", "main-fix")
    mentioned = _numbered(5)
    assert queue_status_plan(mentioned, active=True, main_sha="mainsha") == (
        "failure",
        QUEUE_HELD_DESCRIPTION,
    )
    assert queue_status_plan(other, active=False, main_sha="mainsha") == (
        "success",
        "main is not red",
    )
    assert queue_status_plan(fork, active=True, main_sha="mainsha") is None
    same_as_main = _numbered(7)
    same_as_main["head"]["sha"] = "a" * 40
    assert queue_status_plan(same_as_main, active=True, main_sha="a" * 40) is None
    assert QUEUE_CONTEXT == "queue/main-fix"
    assert QUEUE_CONTEXT not in REQUIRED_CHECK_NAMES
    assert not QUEUE_CONTEXT.startswith("jenkins/")
    assert should_post_queue("failure", "success") is True
    assert should_post_queue("success", "success") is False
    with pytest.raises(GateError):
        post_commit_status("tezball", "my-island", "abc", QUEUE_CONTEXT, "success", "tok")


def test_queue_failure_is_not_posted_on_main_head(monkeypatch: pytest.MonkeyPatch) -> None:
    def boom(*_args: object, **_kwargs: object) -> None:
        raise AssertionError("posted queue status")

    monkeypatch.setattr("gha_review_gate._github_request", boom)
    pr = _numbered(3)
    pr["head"]["sha"] = "a" * 40
    assert (
        post_queue_for_pull("tezball", "my-island", pr, MainRedHold(True, "a" * 40), "tok")
        == []
    )


def test_post_queue_status_uses_only_queue_context(monkeypatch: pytest.MonkeyPatch) -> None:
    seen: dict[str, object] = {}

    def fake(method: str, url: str, token: str, payload: dict | None = None, timeout: float = 30):
        del method, url, token, timeout
        seen["payload"] = payload
        return {}, ""

    monkeypatch.setattr("gha_review_gate._github_request", fake)
    post_queue_status(
        "tezball",
        "my-island",
        "abc",
        "failure",
        "held while main is red",
        "tok",
    )
    payload = seen["payload"]
    assert isinstance(payload, dict)
    assert payload["context"] == "queue/main-fix"
    assert payload["context"] not in REQUIRED_CHECK_NAMES
    assert not str(payload["context"]).startswith("jenkins/")
    assert payload["description"] == "held while main is red"
    assert payload["state"] == "failure"
    post_queue_status("tezball", "my-island", "abc", "success", "main is not red", "tok")
    released = seen["payload"]
    assert isinstance(released, dict)
    assert released["context"] == "queue/main-fix"
    assert released["state"] == "success"
    with pytest.raises(GateError):
        post_queue_status("tezball", "my-island", "abc", "failure", "unit tests", "tok")


def test_poll_posts_queue_on_same_repo_heads_only() -> None:
    queued: list[int] = []
    merged: list[int] = []
    pr = _numbered(8)
    lines = poll_ready(
        [pr, _numbered(2, fork=True)],
        lambda number: (pr, [_review("cursor[bot]", APPROVED)], _green_runs()),
        lambda number, sha: merged.append(number),
        lambda number: None,
        hold=lambda current: True,
        queue=lambda current: queued.append(current["number"])
        or [f"#{current['number']} queue/main-fix failure"],
    )
    assert queued == [8]
    assert merged == []
    assert any("#8 queue/main-fix failure" in line for line in lines)
    assert any("squash skipped: held while main is red" in line for line in lines)
