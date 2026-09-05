from __future__ import annotations

import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
LEADS = REPO / "data" / "leads"
SCHEMA = json.loads((LEADS / "schema.json").read_text())
JSONL = LEADS / "places.jsonl"
STARTER = REPO / "docs" / "leads" / "CAMPSITE_LEADS.md"
STARTER_PATH = "docs/leads/CAMPSITE_LEADS.md"


def _check(instance, schema: dict, path: str = "$") -> None:
    if "enum" in schema:
        assert instance in schema["enum"], f"{path} {instance!r} not in {schema['enum']}"
    expected = schema.get("type")
    if expected == "object":
        assert isinstance(instance, dict), path
        required = schema.get("required", [])
        for key in required:
            assert key in instance, f"{path} missing {key}"
        if schema.get("additionalProperties") is False:
            extra = set(instance) - set(schema.get("properties", {}))
            assert not extra, f"{path} extra keys {extra}"
        for key, val in instance.items():
            sub = schema.get("properties", {}).get(key)
            if sub:
                _check(val, sub, f"{path}.{key}")
        return
    if expected == "array":
        assert isinstance(instance, list), path
        if "minItems" in schema:
            assert len(instance) >= schema["minItems"], path
        if schema.get("uniqueItems"):
            assert len(instance) == len(set(instance)), path
        item_schema = schema.get("items")
        if item_schema:
            for i, item in enumerate(instance):
                _check(item, item_schema, f"{path}[{i}]")
        return
    if expected == "string":
        assert isinstance(instance, str), path
        if "minLength" in schema:
            assert len(instance) >= schema["minLength"], path
        if "maxLength" in schema:
            assert len(instance) <= schema["maxLength"], path
        if "pattern" in schema:
            assert re.search(schema["pattern"], instance), f"{path} {instance!r}"
        return
    if expected == "number":
        assert isinstance(instance, (int, float)) and not isinstance(instance, bool), path


def _records() -> list[dict]:
    lines = JSONL.read_text().splitlines()
    assert lines, "places.jsonl empty"
    assert JSONL.read_text().endswith("\n")
    return [json.loads(line) for line in lines]


def test_leads_docs_exist() -> None:
    for name in ("README.md", "schema.json", "places.jsonl", "SOURCES.md", "LEGAL.md"):
        assert (LEADS / name).is_file(), name
    readme = (LEADS / "README.md").read_text()
    assert "lead → reviewed → promoted" in readme or "lead → reviewed" in readme
    assert "No live catalog writes" in readme or "no live catalog" in readme.lower()
    assert "CAPTCHA" in readme
    legal = (LEADS / "LEGAL.md").read_text()
    assert "database-right" in legal.lower() or "database right" in legal.lower()
    assert "counsel" in legal.lower()


def test_each_lead_matches_schema() -> None:
    records = _records()
    for rec in records:
        _check(rec, SCHEMA)


def test_seed_has_all_starter_campsites() -> None:
    records = _records()
    assert len(records) == 29
    ids = [r["id"] for r in records]
    keys = [r["dedupe_key"] for r in records]
    assert len(set(ids)) == 29
    assert len(set(keys)) == 29
    names = {r["name"] for r in records}
    starter = STARTER.read_text()
    table_names = []
    for line in starter.splitlines():
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if not cells or cells[0] in {"Site Name", "-" * len(cells[0])}:
            continue
        if cells[0].startswith("-"):
            continue
        table_names.append(cells[0])
    assert len(table_names) == 29, table_names
    missing = [n for n in table_names if n not in names]
    assert missing == []
    for rec in records:
        assert rec["status"] == "lead"
        assert rec["place_type"] == "campsite"
        assert rec["country"] == "IE"
        blob = json.dumps(rec)
        assert STARTER_PATH in rec["source_url"] or STARTER_PATH in blob
        email = rec.get("email_public", "")
        assert "gmail.com" not in email.lower()
        assert "yahoo." not in email.lower()


def test_starter_doc_points_at_data_leads() -> None:
    text = STARTER.read_text()
    assert "data/leads/" in text


def test_prd006_links_research_store() -> None:
    ticket = (REPO / "ops" / "tickets" / "PRD-006.md").read_text()
    assert "data/leads" in ticket
    prd002 = (REPO / "ops" / "tickets" / "PRD-002.md").read_text()
    assert "data/leads" in prd002
