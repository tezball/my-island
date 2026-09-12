#!/usr/bin/env python3
"""Build POI leads from curated rows + Wikidata/Commons (PRD-002).

Resolve Q-ids via wbsearchentities (curated qid is only a hint).
Stdlib only. Does not scrape tourism sites. Does not invent coordinates.
"""
from __future__ import annotations

import json
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ROWS_PATH = REPO / "ops" / "scripts" / "poi_seed_rows.json"
JSONL = REPO / "data" / "leads" / "places.jsonl"
USER_AGENT = "my-island-poi-seed/1.0 (https://github.com/tezball/my-island; research leads)"
WD_API = "https://www.wikidata.org/w/api.php"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
FETCHED_AT = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
FREE_LICENCE = re.compile(
    r"(CC0|CC BY(?!-NC)|CC-BY(?!-NC)|Public domain|PD|PDM)",
    re.IGNORECASE,
)
IRELAND_QIDS = {"Q27", "Q26", "Q145"}  # IE, NI, UK (NI places often P17=UK)


def http_json(url: str, timeout: float = 60.0) -> dict:
    req = urllib.request.Request(
        url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode())


def chunks(items: list, size: int):
    for i in range(0, len(items), size):
        yield items[i : i + size]


def search_qid(name: str, hint: str | None) -> str | None:
    params = {
        "action": "wbsearchentities",
        "format": "json",
        "language": "en",
        "type": "item",
        "limit": "8",
        "search": name,
    }
    data = http_json(WD_API + "?" + urllib.parse.urlencode(params))
    ids = [hit["id"] for hit in data.get("search", [])]
    if hint and hint in ids:
        return hint
    return ids[0] if ids else hint


def fetch_entities(qids: list[str]) -> dict[str, dict]:
    out: dict[str, dict] = {}
    for batch in chunks(qids, 40):
        params = {
            "action": "wbgetentities",
            "format": "json",
            "ids": "|".join(batch),
            "props": "claims|labels",
            "languages": "en",
        }
        data = http_json(WD_API + "?" + urllib.parse.urlencode(params), timeout=90.0)
        out.update(data.get("entities", {}))
        time.sleep(0.25)
    return out


def claim_values(entity: dict, pid: str) -> list:
    out = []
    for claim in entity.get("claims", {}).get(pid, []):
        snak = claim.get("mainsnak") or {}
        if snak.get("snaktype") != "value":
            continue
        out.append(snak["datavalue"]["value"])
    return out


def globecoordinate(entity: dict) -> tuple[float, float] | None:
    for val in claim_values(entity, "P625"):
        if isinstance(val, dict) and "latitude" in val and "longitude" in val:
            return float(val["latitude"]), float(val["longitude"])
    return None


def commons_file(entity: dict) -> str | None:
    for val in claim_values(entity, "P18"):
        if isinstance(val, str) and val:
            return val
    return None


def official_website(entity: dict) -> str | None:
    for val in claim_values(entity, "P856"):
        if isinstance(val, str) and val.startswith("http"):
            return val
    return None


def country_qids(entity: dict) -> set[str]:
    ids = set()
    for val in claim_values(entity, "P17"):
        if isinstance(val, dict) and "id" in val:
            ids.add(val["id"])
    return ids


def fetch_commons(filenames: list[str]) -> dict[str, dict]:
    out: dict[str, dict] = {}
    titles = [f"File:{name}" for name in filenames if name]
    for batch in chunks(titles, 40):
        params = {
            "action": "query",
            "format": "json",
            "prop": "imageinfo",
            "iiprop": "url|extmetadata",
            "iiurlwidth": "1280",
            "titles": "|".join(batch),
        }
        data = http_json(COMMONS_API + "?" + urllib.parse.urlencode(params), timeout=60.0)
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            title = page.get("title", "")
            info = (page.get("imageinfo") or [{}])[0]
            meta = info.get("extmetadata") or {}
            licence = (meta.get("LicenseShortName") or {}).get("value") or ""
            artist = (meta.get("Artist") or {}).get("value") or ""
            artist = re.sub(r"<[^>]+>", "", artist).strip()
            if not FREE_LICENCE.search(licence):
                continue
            thumb = info.get("thumburl") or info.get("url")
            if not thumb:
                continue
            out[title] = {
                "image_url": thumb,
                "image_credit": artist or "Wikimedia Commons",
                "image_licence": licence,
                "file_page": "https://commons.wikimedia.org/wiki/"
                + urllib.parse.quote(title.replace(" ", "_")),
            }
        time.sleep(0.3)
    return out


def slug_county(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower())
    slug = re.sub(r"^-+|-+$", "", slug)
    return "derry" if slug == "londonderry" else slug


def build_lead(row: dict, entity: dict, commons: dict) -> dict | None:
    coords = globecoordinate(entity)
    if coords is None:
        return None
    lat, lng = coords
    if not (51.2 <= lat <= 55.6 and -11.0 <= lng <= -5.2):
        return None
    county_slug = slug_county(row["county"])
    lead = {
        "id": row["id"],
        "name": row["name"],
        "place_type": "poi",
        "county": row["county"],
        "country": row["country"],
        "town": row["town"],
        "lat": round(lat, 6),
        "lng": round(lng, 6),
        "notes_original": row["notes_original"][:280],
        "description": row["description"][:800],
        "source_url": f"https://www.wikidata.org/wiki/{entity['id']}",
        "source_name": "Wikidata",
        "fetched_at": FETCHED_AT,
        "licence": "CC0",
        "status": "reviewed",
        "dedupe_key": f"poi:{county_slug}:{row['id']}",
        "raw_refs": [f"https://www.wikidata.org/wiki/{entity['id']}"],
    }
    website = official_website(entity) or row.get("website")
    if website:
        lead["website"] = website
    if row.get("price_band"):
        lead["price_band"] = row["price_band"]
    if row.get("facility_ids"):
        lead["facility_ids"] = row["facility_ids"]
    filename = commons_file(entity)
    if filename:
        meta = commons.get(f"File:{filename}")
        if meta:
            lead["image_url"] = meta["image_url"]
            lead["image_credit"] = meta["image_credit"][:200]
            lead["image_licence"] = meta["image_licence"]
            lead["raw_refs"] = list(dict.fromkeys(lead["raw_refs"] + [meta["file_page"]]))
    return lead


def load_jsonl(path: Path) -> list[dict]:
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]


def main() -> int:
    rows = json.loads(ROWS_PATH.read_text())
    qids = []
    resolved: dict[str, str] = {}
    for row in rows:
        qid = search_qid(row["name"], row.get("qid"))
        time.sleep(0.15)
        if not qid:
            sys.stderr.write(f"no-qid: {row['id']}\n")
            continue
        resolved[row["id"]] = qid
        qids.append(qid)
        sys.stderr.write(f"qid {row['id']} {qid}\n")
    sys.stderr.write(f"entities {len(qids)}\n")
    entities = fetch_entities(list(dict.fromkeys(qids)))
    filenames = []
    for qid in qids:
        ent = entities.get(qid) or {}
        name = commons_file(ent)
        if name:
            filenames.append(name)
    sys.stderr.write(f"commons {len(filenames)} files\n")
    commons = fetch_commons(filenames)
    leads = []
    skipped = []
    for row in rows:
        qid = resolved.get(row["id"])
        ent = entities.get(qid or "") if qid else None
        if not ent or "missing" in ent:
            skipped.append(row["id"])
            continue
        lead = build_lead(row, ent, commons)
        if lead is None:
            skipped.append(row["id"])
            continue
        leads.append(lead)
    existing = load_jsonl(JSONL)
    campsites = [r for r in existing if r.get("place_type") != "poi"]
    by_id = {r["id"]: r for r in campsites}
    for lead in leads:
        by_id[lead["id"]] = lead
    out = list(by_id.values())
    JSONL.write_text(
        "".join(json.dumps(rec, ensure_ascii=False, separators=(",", ":")) + "\n" for rec in out)
    )
    with_image = sum(1 for r in leads if "image_url" in r)
    sys.stderr.write(
        f"ok: poi={len(leads)} image={with_image} skip={len(skipped)} campsite={len(campsites)}\n"
    )
    if skipped:
        sys.stderr.write("skip: " + ", ".join(skipped) + "\n")
    return 0 if len(leads) >= 40 else 1


if __name__ == "__main__":
    raise SystemExit(main())
