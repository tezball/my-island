#!/usr/bin/env python3
"""Happy-path place listing sim: create → list → get.

Assumes `./scripts/dev up` (no chaos). Stdlib only.

  python3 ops/scripts/sim_place_listing.py
  python3 ops/scripts/sim_place_listing.py --iterations 10
  ./scripts/sim-place-listing.sh --no-prometheus
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
import uuid
from typing import Any

DEFAULT_BASES = ("http://127.0.0.1:8081", "http://catalog:8080")
HEALTH_PATH = "/actuator/health"
PROMETHEUS_PATH = "/actuator/prometheus"
PLACES_PATH = "/api/v1/places"


class SimError(Exception):
    """Assertion failure against a reachable catalog."""


class CatalogUnreachable(Exception):
    """Catalog HTTP did not answer."""


def env_flag(name: str, default: bool) -> bool:
    raw = os.environ.get(name)
    if raw is None:
        return default
    return raw.strip().lower() not in {"0", "false", "no", "off"}


def request(
    method: str,
    url: str,
    *,
    json_body: dict[str, Any] | None = None,
    timeout: float = 10.0,
) -> tuple[int, str, float]:
    headers = {"Accept": "*/*"}
    data = None
    if json_body is not None:
        data = json.dumps(json_body).encode()
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    started = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode()
            return int(resp.status), body, (time.perf_counter() - started) * 1000
    except urllib.error.HTTPError as exc:
        body = exc.read().decode() if exc.fp else ""
        return int(exc.code), body, (time.perf_counter() - started) * 1000
    except urllib.error.URLError as exc:
        raise CatalogUnreachable(f"{method} {url}: {exc.reason}") from exc
    except TimeoutError as exc:
        raise CatalogUnreachable(f"{method} {url}: timeout") from exc


def parse_json(body: str) -> Any:
    try:
        return json.loads(body) if body else None
    except json.JSONDecodeError as exc:
        raise SimError(f"response is not JSON: {body[:200]!r}") from exc


def discover_base(candidates: list[str], timeout: float) -> str:
    errors: list[str] = []
    for base in candidates:
        url = base.rstrip("/") + HEALTH_PATH
        try:
            status, body, _ms = request("GET", url, timeout=min(timeout, 3.0))
        except CatalogUnreachable as exc:
            errors.append(str(exc))
            continue
        if status == 200:
            return base.rstrip("/")
        errors.append(f"{url} -> HTTP {status}")
    hint = "Start happy path: ./scripts/dev up"
    detail = "; ".join(errors) if errors else "no candidates"
    raise CatalogUnreachable(f"catalog not reachable ({detail}). {hint}")


def payload_for(iteration: int) -> dict[str, Any]:
    token = uuid.uuid4().hex[:12]
    slug = f"sim-{iteration}-{token}"
    return {
        "name": f"Sim place {iteration} {token}",
        "slug": slug,
        "description": "WF-019 happy-path sim (not product content)",
        "categoryId": "poi",
        "countyId": "kerry",
        "town": "Portmagee",
        "latitude": 51.7708,
        "longitude": -10.5406,
        "published": True,
    }


def check_health(base: str, timeout: float) -> tuple[str, float]:
    status, body, ms = request("GET", base + HEALTH_PATH, timeout=timeout)
    if status != 200:
        raise SimError(f"health HTTP {status}: {body[:200]}")
    data = parse_json(body)
    if not isinstance(data, dict) or data.get("status") != "UP":
        raise SimError(f"health not UP: {body[:200]}")
    return body, ms


def check_prometheus(base: str, timeout: float) -> tuple[int, float]:
    status, body, ms = request("GET", base + PROMETHEUS_PATH, timeout=timeout)
    if status != 200:
        raise SimError(f"prometheus HTTP {status}: {body[:200]}")
    if "jvm_memory_used_bytes" not in body and "http_server_requests" not in body:
        raise SimError("prometheus scrape missing expected metric names")
    return len(body), ms


def create_place(base: str, payload: dict[str, Any], timeout: float) -> tuple[str, str, float]:
    status, body, ms = request(
        "POST", base + PLACES_PATH, json_body=payload, timeout=timeout
    )
    if status != 201:
        raise SimError(f"create HTTP {status}: {body[:300]}")
    data = parse_json(body)
    if not isinstance(data, dict) or not data.get("id"):
        raise SimError(f"create missing id: {body[:200]}")
    place_id = str(data["id"])
    slug = str(data.get("slug") or payload["slug"])
    return place_id, slug, ms


def list_contains(base: str, place_id: str, timeout: float) -> tuple[int, float]:
    status, body, ms = request("GET", base + PLACES_PATH, timeout=timeout)
    if status != 200:
        raise SimError(f"list HTTP {status}: {body[:300]}")
    data = parse_json(body)
    if not isinstance(data, list):
        raise SimError(f"list is not an array: {body[:200]}")
    ids = {str(item.get("id")) for item in data if isinstance(item, dict)}
    if place_id not in ids:
        raise SimError(f"list missing created id {place_id} (n={len(data)})")
    return len(data), ms


def get_place(base: str, place_id: str, timeout: float) -> tuple[dict[str, Any], float]:
    status, body, ms = request("GET", f"{base}{PLACES_PATH}/{place_id}", timeout=timeout)
    if status != 200:
        raise SimError(f"get HTTP {status}: {body[:300]}")
    data = parse_json(body)
    if not isinstance(data, dict) or str(data.get("id")) != place_id:
        raise SimError(f"get id mismatch: {body[:200]}")
    return data, ms


def one_iteration(base: str, iteration: int, timeout: float) -> dict[str, Any]:
    payload = payload_for(iteration)
    place_id, slug, create_ms = create_place(base, payload, timeout)
    count, list_ms = list_contains(base, place_id, timeout)
    got, get_ms = get_place(base, place_id, timeout)
    if got.get("slug") != slug:
        raise SimError(f"get slug {got.get('slug')!r} != create slug {slug!r}")
    return {
        "iteration": iteration,
        "id": place_id,
        "slug": slug,
        "create_ms": create_ms,
        "list_ms": list_ms,
        "get_ms": get_ms,
        "list_count": count,
    }


def run(
    *,
    bases: list[str],
    iterations: int,
    timeout: float,
    check_prom: bool,
    out=None,
) -> int:
    if out is None:
        out = sys.stdout
    if iterations < 1:
        raise SimError("--iterations must be >= 1")
    base = discover_base(bases, timeout)
    print(f"catalog: {base}", file=out)
    _health_body, health_ms = check_health(base, timeout)
    print(f"health: 200 UP ({health_ms:.0f}ms)", file=out)
    if check_prom:
        nbytes, prom_ms = check_prometheus(base, timeout)
        print(f"prometheus: 200 ({nbytes} bytes, {prom_ms:.0f}ms)", file=out)
    else:
        print("prometheus: skipped", file=out)

    results: list[dict[str, Any]] = []
    for i in range(1, iterations + 1):
        row = one_iteration(base, i, timeout)
        results.append(row)
        print(
            f"iter {i}/{iterations} create=201 {row['create_ms']:.0f}ms "
            f"list=200 {row['list_ms']:.0f}ms get=200 {row['get_ms']:.0f}ms "
            f"id={row['id']} slug={row['slug']}",
            file=out,
        )
    print(f"ok: {len(results)}/{iterations} create→list→get", file=out)
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Repeatable catalog create/list/get sim (happy path, no chaos)."
    )
    parser.add_argument(
        "--base",
        default=os.environ.get("CATALOG_BASE", ""),
        help="Catalog origin (default: CATALOG_BASE or 127.0.0.1:8081 then catalog:8080)",
    )
    parser.add_argument(
        "--iterations",
        type=int,
        default=int(os.environ.get("SIM_ITERATIONS", "3")),
        help="Create→list→get loops (default 3, env SIM_ITERATIONS)",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=float(os.environ.get("SIM_TIMEOUT", "10")),
        help="HTTP timeout seconds (default 10)",
    )
    parser.add_argument(
        "--no-prometheus",
        action="store_true",
        help="Skip GET /actuator/prometheus",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    bases = [args.base] if args.base else list(DEFAULT_BASES)
    check_prom = (not args.no_prometheus) and env_flag("SIM_CHECK_PROMETHEUS", True)
    try:
        return run(
            bases=bases,
            iterations=args.iterations,
            timeout=args.timeout,
            check_prom=check_prom,
        )
    except CatalogUnreachable as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    except SimError as exc:
        print(f"fail: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
