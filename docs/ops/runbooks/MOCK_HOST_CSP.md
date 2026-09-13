---
title: Mock host CSP (fishing-journals.com)
type: runbook
owner: architecture
created: 2026-09-12
cssclasses:
  - runbook
---

# Mock host CSP (fishing-journals.com)

**Caddy on fishing-journals.com is patched by `ops/deploy/caddy_apex.py` (WF-032).** Local Vite (`:5173`) has no Caddy CSP.

## What was broken on the live host

- `Content-Security-Policy`: `connect-src 'self' https://accounts.google.com`
- `img-src 'self' data: https:` (Commons `<img>` URLs already allowed)
- `Permissions-Policy: geolocation=()`

MapLibre/Leaflet raster tiles: Leaflet uses `<img>` (covered by existing `img-src https:`). If you switch back to MapLibre, tile origins need `connect-src`. `geolocation=()` disables near-me.

Do **not** proxy OSM tiles or Wikimedia bytes through Spring.

## Headers the host operator must send

Keep existing Google `connect-src` if Sign-In stays on that host. Bundle MapLibre in the Vite app.

```
connect-src 'self' https://accounts.google.com https://tile.openstreetmap.org https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com;
img-src 'self' data: blob: https:;
worker-src 'self' blob:;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
Permissions-Policy: geolocation=(self)
```

Merge with the host’s existing `script-src` / `style-src`. Do not paste a full replacement from this note.

## In-repo check

Loopback PWA + seeded POIs with both `latitude` and `longitude` → tiles + pins. Mock-prod apex: [[MOCK_PROD_DEPLOY]].
