---
title: Mock host CSP (fishing-journals.com)
type: runbook
owner: architecture
created: 2026-09-12
cssclasses:
  - runbook
---

# Mock host CSP (fishing-journals.com)

**This repo cannot apply these headers.** `fishing-journals.com` is a mock/public Caddy host outside `tezball/my-island`. Deploy remains blocked ([[ops/tickets/WF-013]], [[ops/tickets/WF-032]]). Local Vite (`:5173`) has no Caddy CSP — that is the demo.

## What is broken on the live host

- `Content-Security-Policy`: `connect-src 'self' https://accounts.google.com`
- `img-src 'self' data: https:` (Commons `<img>` URLs already allowed)
- `Permissions-Policy: geolocation=()`

MapLibre raster tiles use **fetch**, so they need tile origins on `connect-src`. Pins with coordinates still fail to paint tiles. `geolocation=()` disables near-me.

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

Loopback PWA + seeded POIs with both `latitude` and `longitude` → tiles + pins. That does **not** certify fishing-journals.com.
