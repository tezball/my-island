#!/usr/bin/env python3
"""Import curator-reviewed leads as draft Places (PRD-008).

Stdlib only. POSTs CreatePlaceRequest JSON at the catalog stub.
Does not scrape, does not publish, does not invent a lead DTO.

  python3 ops/scripts/import_leads.py --dry-run
  python3 ops/scripts/import_leads.py --file path/to/reviewed.jsonl
  python3 ops/scripts/import_leads.py --reject <lead-id>
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[2]
DEFAULT_FILE = REPO / "data" / "leads" / "places.jsonl"
DEFAULT_BASE_URL = "http://127.0.0.1:8081"
COUNTIES_PATH = "/api/v1/counties"
PLACES_PATH = "/api/v1/places"
IMPORTABLE_STATUS = "reviewed"
CATEGORIES = frozenset({"poi", "experience", "campsite", "bnb"})
COUNTY_ALIASES = {"londonderry": "derry"}


class LeadImportError(Exception):
    """CLI failure (bad file, unknown lead id, catalog HTTP)."""


def slugify(value: str) -> str:
    """Same idea as PlaceService.slugify (lower, non-alnum → hyphen, trim)."""
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower())
    return re.sub(r"^-+|-+$", "", slug)


def match_county(raw: str | None, counties: list[dict[str, Any]]) -> str | None:
    if raw is None:
        return None
    text = str(raw).strip()
    if not text:
        return None
    slug = COUNTY_ALIASES.get(slugify(text), slugify(text))
    by_id = {str(c.get("id", "")): c for c in counties}
    if slug in by_id:
        return slug
    lowered = text.lower()
    for county in counties:
        name = str(county.get("name", ""))
        if name.lower() == lowered:
            return str(county["id"])
    return None


def skip_reason(lead: dict[str, Any], counties: list[dict[str, Any]]) -> str | None:
    status = lead.get("status")
    if status != IMPORTABLE_STATUS:
        return f"status={status}"
    place_type = lead.get("place_type")
    if place_type not in CATEGORIES:
        return f"place_type={place_type}"
    county_id = match_county(lead.get("county"), counties)
    if county_id is None:
        return "county"
    return None


def map_lead(lead: dict[str, Any], counties: list[dict[str, Any]]) -> dict[str, Any]:
    county_id = match_county(lead.get("county"), counties)
    if county_id is None:
        raise LeadImportError("cannot map lead without a county match")
    payload: dict[str, Any] = {
        "name": lead["name"],
        "slug": lead["id"],
        "categoryId": lead["place_type"],
        "countyId": county_id,
        "published": False,
        "sourceUrl": lead["source_url"],
        "sourceName": lead["source_name"],
        "licence": lead["licence"],
        "leadDedupeKey": lead["dedupe_key"],
    }
    if "lat" in lead:
        payload["latitude"] = lead["lat"]
    if "lng" in lead:
        payload["longitude"] = lead["lng"]
    if "website" in lead:
        payload["website"] = lead["website"]
    if "phone_public" in lead:
        payload["phone"] = lead["phone_public"]
    return payload


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    text = path.read_text()
    lines = text.splitlines()
    records: list[dict[str, Any]] = []
    for i, line in enumerate(lines, start=1):
        if not line.strip():
            continue
        try:
            rec = json.loads(line)
        except json.JSONDecodeError as exc:
            raise LeadImportError(f"{path}:{i} is not JSON") from exc
        if not isinstance(rec, dict):
            raise LeadImportError(f"{path}:{i} is not an object")
        records.append(rec)
    return records


def write_jsonl(path: Path, records: list[dict[str, Any]]) -> None:
    body = "".join(json.dumps(rec, ensure_ascii=False, separators=(",", ":")) + "\n" for rec in records)
    path.write_text(body)


def reject_lead(path: Path, lead_id: str) -> dict[str, Any]:
    records = load_jsonl(path)
    found: dict[str, Any] | None = None
    for rec in records:
        if rec.get("id") == lead_id:
            rec["status"] = "rejected"
            found = rec
            break
    if found is None:
        raise LeadImportError(f"lead id not found: {lead_id}")
    write_jsonl(path, records)
    return found


def request_json(
    method: str,
    url: str,
    *,
    json_body: dict[str, Any] | None = None,
    timeout: float = 10.0,
) -> tuple[int, Any]:
    headers = {"Accept": "application/json"}
    data = None
    if json_body is not None:
        data = json.dumps(json_body).encode()
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read().decode()
            body = json.loads(raw) if raw else None
            return int(resp.status), body
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode() if exc.fp else ""
        try:
            body = json.loads(raw) if raw else None
        except json.JSONDecodeError:
            body = raw
        return int(exc.code), body
    except urllib.error.URLError as exc:
        raise LeadImportError(f"{method} {url}: {exc.reason}") from exc
    except TimeoutError as exc:
        raise LeadImportError(f"{method} {url}: timeout") from exc


def fetch_counties(base_url: str, timeout: float = 10.0) -> list[dict[str, Any]]:
    status, body = request_json("GET", base_url.rstrip("/") + COUNTIES_PATH, timeout=timeout)
    if status != 200 or not isinstance(body, list):
        raise LeadImportError(f"GET /api/v1/counties HTTP {status}")
    return body


def post_place(base_url: str, payload: dict[str, Any], timeout: float = 10.0) -> tuple[int, Any]:
    return request_json(
        "POST",
        base_url.rstrip("/") + PLACES_PATH,
        json_body=payload,
        timeout=timeout,
    )


def plan_import(
    records: list[dict[str, Any]], counties: list[dict[str, Any]]
) -> list[tuple[dict[str, Any], dict[str, Any] | None, str | None]]:
    """(lead, payload or None, skip reason or None) for each record."""
    out: list[tuple[dict[str, Any], dict[str, Any] | None, str | None]] = []
    for lead in records:
        reason = skip_reason(lead, counties)
        if reason:
            out.append((lead, None, reason))
        else:
            out.append((lead, map_lead(lead, counties), None))
    return out


def run(
    *,
    file: Path,
    base_url: str,
    dry_run: bool,
    reject_id: str | None,
    counties: list[dict[str, Any]] | None = None,
    post=post_place,
    out=None,
) -> int:
    if out is None:
        out = sys.stdout
    if reject_id:
        rec = reject_lead(file, reject_id)
        print(f"rejected: {rec['id']} (no Place write)", file=out)
        return 0
    records = load_jsonl(file)
    if counties is None:
        counties = fetch_counties(base_url)
    planned = plan_import(records, counties)
    imported = 0
    skipped = 0
    failed = 0
    for lead, payload, reason in planned:
        ident = lead.get("id", "?")
        if reason:
            skipped += 1
            print(f"skip: {ident} ({reason})", file=out)
            continue
        assert payload is not None
        if dry_run:
            imported += 1
            print(f"dry-run: {ident} {json.dumps(payload, ensure_ascii=False)}", file=out)
            continue
        status, body = post(base_url, payload)
        if status not in {200, 201}:
            failed += 1
            print(f"fail: {ident} HTTP {status} {body!r}"[:400], file=out)
            continue
        imported += 1
        place_id = body.get("id") if isinstance(body, dict) else None
        print(f"import: {ident} HTTP {status} place={place_id} published=false", file=out)
    print(
        f"ok: import={imported} skip={skipped} fail={failed} dry_run={dry_run}",
        file=out,
    )
    return 1 if failed else 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Import reviewed leads as unpublished Places (PRD-008)."
    )
    parser.add_argument(
        "--file",
        type=Path,
        default=DEFAULT_FILE,
        help=f"JSONL path (default {DEFAULT_FILE})",
    )
    parser.add_argument(
        "--base-url",
        default=DEFAULT_BASE_URL,
        help=f"Catalog origin (default {DEFAULT_BASE_URL})",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print CreatePlaceRequest payloads; do not POST",
    )
    parser.add_argument(
        "--reject",
        metavar="LEAD_ID",
        help="Set that lead status=rejected and do not POST",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        return run(
            file=args.file,
            base_url=args.base_url,
            dry_run=args.dry_run,
            reject_id=args.reject,
        )
    except LeadImportError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
