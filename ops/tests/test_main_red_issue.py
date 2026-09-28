from __future__ import annotations

from pathlib import Path

import pytest

from gha_review_gate import hold_is_active
from main_red_issue import (
    Check,
    Issue,
    handle,
    is_red_state,
    issue_body,
    issue_title,
    latest_signal_states,
)

REPO = Path(__file__).resolve().parents[2]
MAIN = "a" * 40
FEATURE = "b" * 40
OTHER = "c" * 40
PASTE = (
    "The issue is a red main SHA. Open one fix pull request from latest main. "
    "Label it main-fix and link the issue. Do not push to main. Do not post a green status. "
    "Do not weaken checks. Do not click Jenkins Build. Do not SSH. If the only log is "
    "http://127.0.0.1:8085 and the status description does not name the cause, say so on the "
    "issue and stop. If a main-fix pull request for this SHA already exists, do not open another. "
    "A failing fix pull request is not a new main failure."
)


class Fake:
    def __init__(self, head: str) -> None:
        self.head = head
        self.rows: list[Issue] = []
        self.api: dict[str, list[Check]] = {}
        self.labeled = False
        self._n = 0

    def main_head(self) -> str:
        return self.head

    def issues(self) -> list[Issue]:
        return list(self.rows)

    def checks(self, sha: str) -> list[Check]:
        return list(self.api.get(sha, []))

    def ensure_label(self) -> None:
        self.labeled = True

    def create_issue(self, title: str, body: str) -> Issue:
        self._n += 1
        issue = Issue(self._n, title, "open", body, [])
        self.rows.append(issue)
        return issue

    def comment(self, number: int, body: str) -> None:
        for issue in self.rows:
            if issue.number == number:
                issue.comments.append(body)

    def close(self, number: int) -> None:
        for issue in self.rows:
            if issue.number == number:
                issue.state = "closed"

    def reopen(self, number: int) -> None:
        for issue in self.rows:
            if issue.number == number:
                issue.state = "open"


def _status(
    sha: str, state: str, context: str, description: str, url: str
) -> dict[str, str]:
    return {
        "sha": sha,
        "state": state,
        "context": context,
        "description": description,
        "target_url": url,
    }


def _check_run(sha: str, conclusion: str) -> dict[str, object]:
    return {
        "action": "completed",
        "check_run": {
            "name": "unit tests",
            "head_sha": sha,
            "status": "completed",
            "conclusion": conclusion,
            "html_url": "https://example/unit",
            "output": {"title": "exit 1", "summary": ""},
        },
    }


def _open(store: Fake) -> list[Issue]:
    return [issue for issue in store.rows if issue.state == "open"]


def test_dedupe_one_issue_per_sha() -> None:
    store = Fake(MAIN)
    first = _status(MAIN, "failure", "jenkins/unit tests", "exit 1", "https://example/unit")
    handle("status", first, store)
    handle("status", first, store)
    assert len(store.rows) == 1
    assert store.rows[0].comments == []
    assert store.rows[0].title == issue_title(MAIN)
    assert MAIN in store.rows[0].body
    assert "jenkins/unit tests" in store.rows[0].body
    assert "exit 1" in store.rows[0].body
    assert "https://example/unit" in store.rows[0].body
    second = _status(
        MAIN,
        "error",
        "jenkins/catalog tests",
        "cannot be built",
        "http://127.0.0.1:8085/job/1",
    )
    handle("status", second, store)
    assert len(store.rows) == 1
    assert len(store.rows[0].comments) == 1
    comment = store.rows[0].comments[0]
    assert "jenkins/catalog tests" in comment
    assert "cannot be built" in comment
    assert "http://127.0.0.1:8085/job/1" in comment
    handle("status", second, store)
    assert len(store.rows) == 1
    assert len(store.rows[0].comments) == 1


def test_closed_issue_is_reopened_instead_of_a_second_issue() -> None:
    store = Fake(MAIN)
    event = _status(MAIN, "failure", "jenkins/unit tests", "exit 1", "https://example/unit")
    handle("status", event, store)
    store.rows[0].state = "closed"
    handle("status", event, store)
    assert len(store.rows) == 1
    assert store.rows[0].state == "open"
    assert any("Reopened" in comment for comment in store.rows[0].comments)


def test_duplicate_open_issues_collapse_to_one() -> None:
    store = Fake(MAIN)
    failing = Check("status", "jenkins/unit tests", "exit 1", "https://example/unit", "failure")
    body = issue_body(MAIN, [failing])
    store.rows = [
        Issue(1, issue_title(MAIN), "open", body, []),
        Issue(2, issue_title(MAIN), "open", body, []),
    ]
    store._n = 2
    store.api[MAIN] = [failing]
    handle("status", _status(MAIN, "success", "web tests", "ok", "https://example/web"), store)
    assert [issue.number for issue in _open(store)] == [1]
    assert any("Duplicate of #1" in comment for comment in store.rows[1].comments)


def test_feature_branch_and_old_main_sha_do_not_open() -> None:
    store = Fake(MAIN)
    handle(
        "status",
        _status(FEATURE, "failure", "jenkins/unit tests", "exit 1", "https://example/unit"),
        store,
    )
    handle("check_run", _check_run(FEATURE, "failure"), store)
    handle(
        "status",
        _status(
            OTHER,
            "error",
            "jenkins/catalog tests",
            "cannot be built",
            "http://127.0.0.1:8085/9",
        ),
        store,
    )
    assert store.rows == []


def test_pending_is_not_red_and_does_not_keep_an_issue() -> None:
    assert is_red_state("pending") is False
    assert is_red_state("failure") is True
    assert is_red_state("error") is True
    store = Fake(MAIN)
    handle(
        "status",
        _status(
            MAIN,
            "pending",
            "jenkins/unit tests",
            "This commit is being built",
            "http://127.0.0.1:8085",
        ),
        store,
    )
    assert store.rows == []
    handle(
        "status",
        _status(MAIN, "failure", "jenkins/unit tests", "exit 1", "https://example/unit"),
        store,
    )
    assert len(_open(store)) == 1
    handle(
        "status",
        _status(MAIN, "pending", "jenkins/unit tests", "building", "http://127.0.0.1:8085"),
        store,
    )
    assert store.rows[0].state == "closed"
    assert any("green" in comment for comment in store.rows[0].comments)


def test_pending_does_not_close_a_different_failure() -> None:
    store = Fake(MAIN)
    handle("check_run", _check_run(MAIN, "failure"), store)
    store.api[MAIN] = [
        Check("check", "unit tests", "exit 1", "https://example/unit", "failure")
    ]
    handle(
        "status",
        _status(
            MAIN,
            "pending",
            "jenkins/catalog tests",
            "building",
            "http://127.0.0.1:8085",
        ),
        store,
    )
    assert store.rows[0].state == "open"
    assert not any("jenkins/catalog tests" in comment for comment in store.rows[0].comments)


@pytest.mark.parametrize("state", ["pending", "success", "skipped", "cancelled", "neutral", "canceled"])
def test_ignored_states_are_not_red(state: str) -> None:
    assert is_red_state(state) is False
    store = Fake(MAIN)
    handle("status", _status(MAIN, state, "jenkins/unit tests", state, "https://example"), store)
    assert store.rows == []


def test_latest_pending_does_not_hide_a_different_failure() -> None:
    replaced = latest_signal_states(
        [],
        [
            {
                "context": "jenkins/unit tests",
                "state": "pending",
                "description": "building",
                "target_url": "http://127.0.0.1:8085",
            },
            {
                "context": "jenkins/unit tests",
                "state": "failure",
                "description": "old",
                "target_url": "http://127.0.0.1:8085",
            },
        ],
    )
    assert replaced == ["pending"]
    assert not any(is_red_state(state) for state in replaced)
    mixed = latest_signal_states(
        [
            {
                "name": "unit tests",
                "status": "completed",
                "conclusion": "failure",
                "id": 1,
                "output": {"title": "exit 1"},
                "html_url": "https://example/unit",
            }
        ],
        [
            {
                "context": "jenkins/catalog tests",
                "state": "pending",
                "description": "building",
                "target_url": "http://127.0.0.1:8085",
            }
        ],
    )
    assert "failure" in mixed
    assert "pending" in mixed
    both = latest_signal_states(
        [
            {
                "name": "compose stack",
                "status": "completed",
                "conclusion": "success",
                "id": 2,
            }
        ],
        [
            {
                "context": "jenkins/compose stack",
                "state": "failure",
                "description": "jenkins red",
                "target_url": "http://127.0.0.1:8085/job",
            }
        ],
    )
    assert "success" in both
    assert "failure" in both


def test_close_when_head_moves_or_sha_is_green() -> None:
    store = Fake(MAIN)
    handle(
        "status",
        _status(MAIN, "failure", "jenkins/unit tests", "exit 1", "https://example/unit"),
        store,
    )
    store.api[MAIN] = [
        Check("status", "jenkins/unit tests", "exit 1", "https://example/unit", "failure")
    ]
    store.head = OTHER
    handle(
        "status",
        _status(OTHER, "success", "jenkins/unit tests", "ok", "https://example/unit"),
        store,
    )
    assert store.rows[0].state == "closed"
    assert any("no longer main HEAD" in comment for comment in store.rows[0].comments)
    assert _open(store) == []

    store.head = MAIN
    store.api[MAIN] = [
        Check("status", "jenkins/unit tests", "ok", "https://example/unit", "success")
    ]
    handle(
        "status",
        _status(MAIN, "failure", "jenkins/catalog tests", "nope", "https://example/catalog"),
        store,
    )
    assert len(store.rows) == 1
    assert store.rows[0].state == "open"
    handle(
        "status",
        _status(MAIN, "success", "jenkins/catalog tests", "ok", "https://example/catalog"),
        store,
    )
    assert store.rows[0].state == "closed"
    assert any("green" in comment for comment in store.rows[0].comments)


def test_queue_failure_on_main_does_not_open_keep_or_hold() -> None:
    store = Fake(MAIN)
    queue = _status(
        MAIN,
        "failure",
        "queue/main-fix",
        "held while main is red",
        "https://example/queue",
    )
    handle("status", queue, store)
    assert store.rows == []
    handle("check_run", _check_run(MAIN, "failure"), store)
    assert len(_open(store)) == 1
    store.api[MAIN] = [
        Check("check", "unit tests", "ok", "https://example/unit", "success"),
        Check(
            "status",
            "queue/main-fix",
            "held while main is red",
            "https://example/queue",
            "failure",
        ),
    ]
    handle("check_run", _check_run(MAIN, "success"), store)
    assert store.rows[0].state == "closed"
    states = latest_signal_states(
        [
            {
                "name": "unit tests",
                "status": "completed",
                "conclusion": "success",
                "id": 1,
            }
        ],
        [
            {
                "context": "queue/main-fix",
                "state": "failure",
                "description": "held while main is red",
                "target_url": "https://example/queue",
            }
        ],
    )
    assert states == ["success"]
    assert hold_is_active(open_issues=1, states=states) is False
    only_queue = latest_signal_states(
        [],
        [
            {
                "context": "queue/main-fix",
                "state": "failure",
                "description": "held while main is red",
                "target_url": "",
            }
        ],
    )
    assert only_queue == []
    assert hold_is_active(open_issues=1, states=only_queue) is False


def test_jenkins_branch_status_is_not_a_main_failure() -> None:
    store = Fake(MAIN)
    handle(
        "status",
        _status(
            MAIN,
            "error",
            "continuous-integration/jenkins/branch",
            "This commit cannot be built",
            "http://127.0.0.1:8085",
        ),
        store,
    )
    handle(
        "status",
        _status(MAIN, "failure", "compose stack", "jenkins reused the name", "http://127.0.0.1:8085"),
        store,
    )
    assert store.rows == []
    states = latest_signal_states(
        [],
        [
            {
                "context": "continuous-integration/jenkins/branch",
                "state": "error",
                "description": "This commit cannot be built",
                "target_url": "http://127.0.0.1:8085",
            },
            {
                "context": "compose stack",
                "state": "failure",
                "description": "jenkins reused the name",
                "target_url": "http://127.0.0.1:8085",
            },
        ],
    )
    assert states == []
    assert hold_is_active(open_issues=1, states=states) is False


def test_workflow_and_doc_do_not_weaken_checks() -> None:
    workflow = (REPO / ".github" / "workflows" / "main-red.yml").read_text()
    assert "check_run:" in workflow
    assert "types: [completed]" in workflow
    assert "\n  status:" in workflow
    assert "ref: main" in workflow
    assert "ops/scripts/main_red_issue.py" in workflow
    assert "statuses: write" not in workflow
    assert "checks: write" not in workflow
    assert "bypass" not in workflow
    assert "administration:" not in workflow
    script = (REPO / "ops" / "scripts" / "main_red_issue.py").read_text()
    assert "/statuses/" not in script
    note = (REPO / "docs" / "ops" / "workflow" / "AUTOMATIONS.md").read_text()
    assert PASTE in note
    assert "queue/main-fix" in note
    assert "held while main is red" in note
    assert "does not post that failure onto main HEAD" in note
    assert "continuous-integration/jenkins/branch" in note
    assert "jenkins/unit tests" in note
    assert "mentioned in a comment is not enough" in note
    assert "bypass list stays empty" in note
    assert "does not add that required check" in note
    assert "main-red" in note
