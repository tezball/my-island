#!/usr/bin/env python3
"""Cut fishing-journals.com Caddy over to my-island at the apex (WF-032)."""
from __future__ import annotations

import argparse
import re
from pathlib import Path

WEB_APP_HEADERS = """(web_app_headers) {
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
        Permissions-Policy "geolocation=(self), microphone=(), camera=(), payment=(), usb=()"
        Content-Security-Policy "default-src 'self'; img-src 'self' data: https: blob:; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.gstatic.com https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.gstatic.com https://fonts.gstatic.com https://accounts.google.com https://tile.openstreetmap.org https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com; frame-src https://accounts.google.com; worker-src 'self' blob:; base-uri 'self'; form-action 'self'"
        -Server
    }
}
"""

APEX_SITE = """{$DOMAIN} {
    handle /api/v1* {
        reverse_proxy island-catalog:8080
    }

    handle /api/auth* {
        reverse_proxy island-catalog:8080
    }

    handle /actuator/health {
        reverse_proxy island-catalog:8080
    }

    @explore path /explore /explore/*
    redir @explore / 308

    handle {
        reverse_proxy island-web:80
    }

    import web_app_headers

    request_body {
        max_size 50MB
    }
}
"""

APP_SITE = """app.{$DOMAIN} {
    handle /api/v1* {
        reverse_proxy island-catalog:8080
    }
    handle /api/auth* {
        reverse_proxy island-catalog:8080
    }
    handle /actuator/health {
        reverse_proxy island-catalog:8080
    }
    handle {
        reverse_proxy island-web:80
    }

    import web_app_headers

    request_body {
        max_size 50MB
    }
}
"""

ADMIN_SITE = """admin.{$DOMAIN} {
    redir https://{$DOMAIN}{uri} permanent
}
"""

VENUES_SITE = """venues.{$DOMAIN} {
    redir https://{$DOMAIN}{uri} permanent
}
"""


def _block_span(text: str, header: str) -> tuple[int, int] | None:
    pattern = re.compile(r"(?m)^" + re.escape(header.rstrip()) + r"\s*\{")
    m = pattern.search(text)
    if not m:
        return None
    start = m.start()
    brace = m.end() - 1
    depth = 0
    i = brace
    while i < len(text):
        ch = text[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                if end < len(text) and text[end] == "\n":
                    end += 1
                return start, end
        i += 1
    raise ValueError(f"Unbalanced braces for {header}")


def replace_site(text: str, header: str, new_block: str) -> str:
    span = _block_span(text, header)
    block = new_block if new_block.endswith("\n") else new_block + "\n"
    if span is None:
        return text.rstrip() + "\n\n" + block
    start, end = span
    return text[:start] + block + text[end:]


def replace_snippet(text: str, header: str, new_block: str) -> str:
    return replace_site(text, header, new_block)


def apply(text: str) -> str:
    updated = replace_snippet(text, "(web_app_headers)", WEB_APP_HEADERS)
    updated = replace_site(updated, "{$DOMAIN}", APEX_SITE)
    updated = replace_site(updated, "admin.{$DOMAIN}", ADMIN_SITE)
    updated = replace_site(updated, "venues.{$DOMAIN}", VENUES_SITE)
    updated = replace_site(updated, "app.{$DOMAIN}", APP_SITE)
    return updated


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("caddyfile", type=Path)
    args = parser.parse_args()
    original = args.caddyfile.read_text()
    updated = apply(original)
    if updated == original:
        print("Caddyfile already at apex cutover")
        return
    bak = args.caddyfile.with_suffix(args.caddyfile.suffix + ".bak.apex-cutover")
    if not bak.exists():
        bak.write_text(original)
        print(f"backed up {bak}")
    args.caddyfile.write_text(updated)
    print(f"patched {args.caddyfile}")


if __name__ == "__main__":
    main()
