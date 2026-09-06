from __future__ import annotations

import io
import json
from pathlib import Path

import import_leads as imp

REPO = Path(__file__).resolve().parents[2]
SEED = REPO / "data" / "leads" / "places.jsonl"

COUNTIES = [
    {"id": "carlow", "name": "Carlow", "countryCode": "IE", "ni": False},
    {"id": "cavan", "name": "Cavan", "countryCode": "IE", "ni": False},
    {"id": "clare", "name": "Clare", "countryCode": "IE", "ni": False},
    {"id": "cork", "name": "Cork", "countryCode": "IE", "ni": False},
    {"id": "donegal", "name": "Donegal", "countryCode": "IE", "ni": False},
    {"id": "dublin", "name": "Dublin", "countryCode": "IE", "ni": False},
    {"id": "galway", "name": "Galway", "countryCode": "IE", "ni": False},
    {"id": "kerry", "name": "Kerry", "countryCode": "IE", "ni": False},
    {"id": "kildare", "name": "Kildare", "countryCode": "IE", "ni": False},
    {"id": "kilkenny", "name": "Kilkenny", "countryCode": "IE", "ni": False},
    {"id": "laois", "name": "Laois", "countryCode": "IE", "ni": False},
    {"id": "leitrim", "name": "Leitrim", "countryCode": "IE", "ni": False},
    {"id": "limerick", "name": "Limerick", "countryCode": "IE", "ni": False},
    {"id": "longford", "name": "Longford", "countryCode": "IE", "ni": False},
    {"id": "louth", "name": "Louth", "countryCode": "IE", "ni": False},
    {"id": "mayo", "name": "Mayo", "countryCode": "IE", "ni": False},
    {"id": "meath", "name": "Meath", "countryCode": "IE", "ni": False},
    {"id": "monaghan", "name": "Monaghan", "countryCode": "IE", "ni": False},
    {"id": "offaly", "name": "Offaly", "countryCode": "IE", "ni": False},
    {"id": "roscommon", "name": "Roscommon", "countryCode": "IE", "ni": False},
    {"id": "sligo", "name": "Sligo", "countryCode": "IE", "ni": False},
    {"id": "tipperary", "name": "Tipperary", "countryCode": "IE", "ni": False},
    {"id": "waterford", "name": "Waterford", "countryCode": "IE", "ni": False},
    {"id": "westmeath", "name": "Westmeath", "countryCode": "IE", "ni": False},
    {"id": "wexford", "name": "Wexford", "countryCode": "IE", "ni": False},
    {"id": "wicklow", "name": "Wicklow", "countryCode": "IE", "ni": False},
    {"id": "antrim", "name": "Antrim", "countryCode": "IE", "ni": True},
    {"id": "armagh", "name": "Armagh", "countryCode": "IE", "ni": True},
    {"id": "down", "name": "Down", "countryCode": "IE", "ni": True},
    {"id": "fermanagh", "name": "Fermanagh", "countryCode": "IE", "ni": True},
    {"id": "derry", "name": "Derry", "countryCode": "IE", "ni": True},
    {"id": "tyrone", "name": "Tyrone", "countryCode": "IE", "ni": True},
]


def _lead(**overrides: object) -> dict:
    row = {
        "id": "fixture-campsite",
        "name": "Fixture Campsite",
        "place_type": "campsite",
        "county": "Galway",
        "country": "IE",
        "lat": 53.27,
        "lng": -9.05,
        "website": "https://example.test/fixture",
        "phone_public": "+353 91 000000",
        "address": "do not map",
        "eircode": "H91 AAAA",
        "email_public": "info@example.test",
        "notes_original": "do not map notes",
        "source_url": "https://example.test/source",
        "source_name": "example.test",
        "fetched_at": "2026-09-06T16:00:00Z",
        "licence": "internal-research",
        "status": "reviewed",
        "dedupe_key": "campsite:galway:fixture-campsite",
        "raw_refs": ["https://example.test/ref"],
    }
    row.update(overrides)
    return row


def test_slugify_matches_place_service() -> None:
    assert imp.slugify("Skellig Michael") == "skellig-michael"
    assert imp.slugify("  Dún Aonghasa  ") == "d-n-aonghasa"


def test_map_lead_uses_landed_keys_only() -> None:
    payload = imp.map_lead(_lead(), COUNTIES)
    assert payload["name"] == "Fixture Campsite"
    assert payload["slug"] == "fixture-campsite"
    assert payload["categoryId"] == "campsite"
    assert payload["countyId"] == "galway"
    assert payload["latitude"] == 53.27
    assert payload["longitude"] == -9.05
    assert payload["website"] == "https://example.test/fixture"
    assert payload["phone"] == "+353 91 000000"
    assert payload["sourceUrl"] == "https://example.test/source"
    assert payload["sourceName"] == "example.test"
    assert payload["licence"] == "internal-research"
    assert payload["leadDedupeKey"] == "campsite:galway:fixture-campsite"
    assert payload["published"] is False
    for forbidden in (
        "address",
        "eircode",
        "email_public",
        "notes_original",
        "fetched_at",
        "raw_refs",
        "country",
        "place_type",
        "phone_public",
        "source_url",
        "source_name",
        "dedupe_key",
    ):
        assert forbidden not in payload


def test_omit_lat_lng_when_absent() -> None:
    lead = _lead()
    del lead["lat"]
    del lead["lng"]
    payload = imp.map_lead(lead, COUNTIES)
    assert "latitude" not in payload
    assert "longitude" not in payload


def test_skip_non_reviewed_and_other_and_unknown_county() -> None:
    assert imp.skip_reason(_lead(status="lead"), COUNTIES) == "status=lead"
    assert imp.skip_reason(_lead(status="rejected"), COUNTIES) == "status=rejected"
    assert imp.skip_reason(_lead(status="promoted"), COUNTIES) == "status=promoted"
    assert imp.skip_reason(_lead(place_type="other"), COUNTIES) == "place_type=other"
    assert imp.skip_reason(_lead(county="Narnia"), COUNTIES) == "county"
    missing = _lead()
    del missing["county"]
    assert imp.skip_reason(missing, COUNTIES) == "county"
    assert imp.skip_reason(_lead(), COUNTIES) is None


def test_londonderry_alias_and_ni_antrim() -> None:
    assert imp.match_county("Londonderry", COUNTIES) == "derry"
    assert imp.match_county("londonderry", COUNTIES) == "derry"
    antrim = next(c for c in COUNTIES if c["id"] == "antrim")
    assert antrim["ni"] is True
    ni_lead = _lead(
        id="ni-camp",
        county="Antrim",
        country="NI",
        dedupe_key="campsite:antrim:ni-camp",
    )
    payload = imp.map_lead(ni_lead, COUNTIES)
    assert payload["countyId"] == "antrim"
    ie_lead = _lead(county="Kerry", country="IE")
    assert imp.map_lead(ie_lead, COUNTIES)["countyId"] == "kerry"


def test_seed_jsonl_imports_zero_places() -> None:
    records = imp.load_jsonl(SEED)
    assert records
    planned = imp.plan_import(records, COUNTIES)
    payloads = [p for _lead_row, p, reason in planned if p is not None]
    assert payloads == []
    assert all(reason and reason.startswith("status=") for _l, _p, reason in planned)


def test_reject_writes_jsonl_and_does_not_post(tmp_path: Path) -> None:
    path = tmp_path / "leads.jsonl"
    kept = _lead(id="keep-me", status="reviewed")
    target = _lead(id="drop-me", status="reviewed")
    imp.write_jsonl(path, [kept, target])
    posted: list[dict] = []

    def post(_base: str, payload: dict) -> tuple[int, dict]:
        posted.append(payload)
        return 201, {"id": "should-not-happen"}

    buf = io.StringIO()
    code = imp.run(
        file=path,
        base_url="http://127.0.0.1:8081",
        dry_run=False,
        reject_id="drop-me",
        counties=COUNTIES,
        post=post,
        out=buf,
    )
    assert code == 0
    assert posted == []
    rows = imp.load_jsonl(path)
    by_id = {r["id"]: r for r in rows}
    assert by_id["drop-me"]["status"] == "rejected"
    assert by_id["keep-me"]["status"] == "reviewed"
    assert "no Place write" in buf.getvalue()


def test_dry_run_prints_payload_without_posting(tmp_path: Path) -> None:
    path = tmp_path / "reviewed.jsonl"
    imp.write_jsonl(path, [_lead()])
    posted: list[dict] = []

    def post(_base: str, payload: dict) -> tuple[int, dict]:
        posted.append(payload)
        return 201, {"id": "nope"}

    buf = io.StringIO()
    code = imp.run(
        file=path,
        base_url="http://127.0.0.1:8081",
        dry_run=True,
        reject_id=None,
        counties=COUNTIES,
        post=post,
        out=buf,
    )
    assert code == 0
    assert posted == []
    out = buf.getvalue()
    assert "dry-run: fixture-campsite" in out
    assert '"published": false' in out
    assert "sourceUrl" in out
    assert "import=1" in out


def test_import_posts_unpublished_create_request(tmp_path: Path) -> None:
    path = tmp_path / "reviewed.jsonl"
    imp.write_jsonl(path, [_lead(), _lead(id="still-lead", status="lead")])
    posted: list[dict] = []

    def post(_base: str, payload: dict) -> tuple[int, dict]:
        posted.append(payload)
        return 201, {"id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee", "published": False}

    buf = io.StringIO()
    code = imp.run(
        file=path,
        base_url="http://127.0.0.1:9",
        dry_run=False,
        reject_id=None,
        counties=COUNTIES,
        post=post,
        out=buf,
    )
    assert code == 0
    assert len(posted) == 1
    assert posted[0]["published"] is False
    assert posted[0]["leadDedupeKey"] == "campsite:galway:fixture-campsite"
    assert "skip: still-lead (status=lead)" in buf.getvalue()


def test_cli_defaults() -> None:
    parser = imp.build_parser()
    args = parser.parse_args([])
    assert args.base_url == "http://127.0.0.1:8081"
    assert args.file == imp.DEFAULT_FILE
    assert args.dry_run is False
    assert args.reject is None
