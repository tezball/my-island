from __future__ import annotations

import caddy_apex


SAMPLE = """
(web_app_headers) {
    header {
        Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=()"
        Content-Security-Policy "default-src 'self'; connect-src 'self' https://accounts.google.com"
        -Server
    }
}

{$DOMAIN} {
    handle /explore* {
        reverse_proxy island-web:80
    }
    handle /api/* {
        reverse_proxy api:8080
    }
    handle {
        reverse_proxy website:80
    }
}

admin.{$DOMAIN} {
    handle {
        reverse_proxy admin-console:80
    }
}

venues.{$DOMAIN} {
    handle {
        reverse_proxy venues-portal:80
    }
}

app.{$DOMAIN} {
    handle /api/* {
        reverse_proxy api:8080
    }
    handle {
        root * /srv/app
        file_server
    }
}

grafana.{$DOMAIN} {
    reverse_proxy grafana:3000
}
"""


def test_apex_cutover_routes_and_keeps_grafana() -> None:
    out = caddy_apex.apply(SAMPLE)
    assert "reverse_proxy island-web:80" in out
    assert "handle /api/auth*" in out
    assert "handle /api/v1*" in out
    assert "redir @explore / 308" in out
    assert "reverse_proxy website:80" not in out
    assert "reverse_proxy api:8080" not in out
    assert "admin-console" not in out
    assert "venues-portal" not in out
    assert "admin.{$DOMAIN} {\n    redir https://{$DOMAIN}{uri} permanent" in out
    assert "app.{$DOMAIN}" in out
    assert "reverse_proxy island-catalog:8080" in out
    assert "handle /actuator/health" in out
    assert "handle /actuator/info" in out
    assert "handle /actuator/prometheus" not in out
    assert "grafana.{$DOMAIN}" in out
    assert "geolocation=(self)" in out
    assert "basemaps.cartocdn.com" in out
    # GIS paths stay at POST /api/auth/google (Caddy prefix /api/auth*)
    assert "handle /api/auth*" in out


def test_apply_is_idempotent() -> None:
    once = caddy_apex.apply(SAMPLE)
    assert caddy_apex.apply(once) == once
