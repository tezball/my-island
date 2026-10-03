---
title: Host and Stay
type: product
status: active
owner: Product
created: 2026-10-03
cssclasses:
  - product
---

# Host and Stay

Terry, 2026-10-03. Ticket [[ops/tickets/PRD-036]]. This is the thin slice. It does not mark [[ops/tickets/PRD-034]] done. Dates, payment, messages, and hotels are out. The parked checkout program stays in [[product/BOOKING-SITE]].

House: [[product/STACK]]. Public host: https://fishing-journals.com. Agents never SSH. No GitHub Environment named `production`, no `compose.prod`, no prod SSH path.

## Locked rules

- **Host** is a role on the signed-in account. A host adds one or more **Stays**. A Stay is a new place, not a claim on the 101 POIs.
- Kinds, stored and shown with these words: **campsite**, **bed and breakfast**, **apartment**, **glamping**, **lodge**. No hotels.
- One page per Stay. Not a page per pitch or room.
- Wizard: kind, title, description (required), images (1 to 8; cover cropped to 1600×900, others to 1200×800), cost optional EUR, phone optional, email optional, website optional, location required (drop a pin or enter latitude and longitude; county comes from the pin and is one of the 32 Irish counties).
- Hidden from the public until automatic review finishes clean. Any edit hides it again until review passes. Review error or timeout keeps it hidden.
- Review order, fail-closed:
  1. Tech. Store text as plain text. Reject script and non-photo files. A website, if present, must be a normal http(s) URL.
  2. Fit. Required fields, Ireland pin, and a website if present must load and read as a place to stay. A down site fails review until it loads.
  3. Conduct. Weak or off-topic content is feedback to fix and resubmit. Ban only for an attack or illegal content: script or markup in the text, a file that is not a photo, malware, or illegal material.
- A ban hides every Stay of that host and blocks new submissions. They can still sign in and read the reason. Fit failures are feedback, not a ban.
- Phone and email show on the public page when present.
- Admin is the Google account `tezball86@gmail.com`, checked on the server. That account is also a host and is not pre-filled with a Stay. Console shows all Stays, Stays stuck in review (submitted, no pass or fail), and banned accounts. Actions: run review again, unban. Unban does not publish. There is no hand-publish button.
- Public Place POST stays closed. Host writes go through the authenticated host API.

## Demo password accounts

These are not the Google admin. The password is the existing seed Guest password (`CATALOG_SEED_GUEST_PASSWORD`, `guest` in local compose). Not a new secret.

| Username | What you see |
|---|---|
| `host-campsite` | A public campsite Stay |
| `host-submitted` | A Stay stuck in review |
| `host-rejected` | A rejected Stay and the feedback the host would see |
| `host-banned` | A banned host, the ban reason, and their Stay hidden |

## Out of this slice

Dates, payment, messages, hotels.
