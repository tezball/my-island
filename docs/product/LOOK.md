---
title: Look and feel
type: product
status: draft
owner: Product
created: 2026-09-13
---

# Look and feel

Working visual brief for the **phone-first directory PWA**. Not signed. Public name is still unset — [`NAMING.md`](NAMING.md), [`ops/company/BRAND.md`](../ops/company/BRAND.md). Constraints: [`MVP.md`](MVP.md) §3.

The live screens follow Terry’s Google Stitch export `explore_heritage_scenic_spots.html` (Drive, 2026-10-01): [explore_heritage_scenic_spots.html](https://drive.google.com/file/d/1SpNv7fPzBC9EWYrDyeny5V7LvPsUvR-B/view). Do not print `my-island` on a customer surface.

Mood reference (place names only, not their marketing): [`Clippings/35 Bucket List Experiences in Ireland.md`](../Clippings/35%20Bucket%20List%20Experiences%20in%20Ireland.md).

---

## Full brief (paste this)

You are an experienced product and visual designer (10+ years). Design a **fresh look and feel** for a phone-first Irish travel directory. This is **not** a booking site, not Airbnb, not a campsite-only brand, and not a Fáilte Ireland / Discover Ireland clone.

Produce high-fidelity mobile screens first (390×844). Desktop is a later, wider layout of the same components — never the design target.

### Product

A curated directory of places in Ireland worth going to. Four categories:

- **Point of interest** (cliffs, islands, castles, lighthouses, trails)
- **Experience** (kayak, trad session, cable car, hike)
- **Campsite**
- **B&B**

People browse a **list and a map**, open a place, and **tick it off in one tap** (“been here” / for campsites and B&Bs also “stayed”). Ticked places become **My Places** (list, map, counts — especially how many of Ireland’s 32 counties you have set foot in). Nothing is bookable. Nothing is paid for.

Working name: leave the wordmark as a simple **wordmark + small Irish subtitle**, not a fake tourism authority. Do **not** use: Fáilte, Wild Atlantic Way, Discover Ireland, Tourism Ireland, Camp*, Pitch*, or *-bnb.

Voice: direct, outdoor, Ireland-specific **without pastiche**. No leprechauns, no shamrock wallpaper, no Celtic knot chrome.

### The job of the photography

**The photograph is the product.** For every POI, campsite, and B&B, the image must feel like the best Ireland has to offer — cinematic, weather-true, place-specific. Cards and heroes should be **photo-led**, not a small thumbnail beside a wall of type.

Treat images as editorial landscape photography:

- Full-bleed or near full-bleed on list cards and place heroes
- Strong crop, atmosphere, scale of landscape vs people
- Weather is allowed: mist, Atlantic light, wet rock, long dusk. Not stock-blue sky every time
- Overlay type only when contrast is honest (scrim / gradient). Never pale grey text on a bright cliff
- Distinct visual rhythm per category so a campsite, a B&B, and a cliff are not interchangeable tiles

Use these as the **mood and subject set** (real Irish bucket-list places). Invent plausible names/copy in that register; do not invent a tourism-board logo.

**Natural wonders:** Doolough Valley road, Cliffs of Moher, Skellig Michael in mist, Slieve League, Shannon cruise, sunset at Dún Aonghasa / Inishmore, Mizen Head bridge.

**Ireland’s past:** Valentia Island lighthouse and rock, Carrowmore megaliths, Newgrange at winter light, Kilkenny Castle grounds.

**Unique Ireland:** Slea Head / Dingle, Dursey Island cable car, Connemara pine island, Kenmare park hotel, night kayak, Trinity Old Library, Wild Nephin boardwalk.

**Outdoors:** Carrauntoohil summit, Gap of Dunloe, Lahinch surf, Glendalough, Forty Foot, Great Western Greenway, Ballyhoura mountain biking.

**Culture:** Sean’s Bar Athlone, Guinness Storehouse pint-pull (as an *experience*, not a beer ad).

**Overnight:** Waterford Castle hotel, Great Blasket white cottages by the sea, Fanad Lighthouse.

Photography feeling: Discover Ireland *quality of place*, Airbnb *image dominance*, National Geographic *honesty* — without copying any of those brands.

### Colour — forest, paper, amber accent

One palette, taken from the Stitch export. The phone UI is a pale paper field, white cards, and near-black forest for type and primary actions. Amber is an accent, not the button fill.

| Role | Hex |
|---|---|
| Page background | `#f4fbf6` |
| Cards and sheets | `#ffffff` |
| Text | `#161d1a` |
| Primary (wordmark, selected chips, Directions, map pins, favicon) | `#002217` |
| Primary container (field-note banner) | `#0f382a` |
| Search field | `#eef5f0` |
| County badge background / text | `#e8f0ec` / `#0f382a` |
| Secondary amber (icons, count badge, locate) | `#904d00` |
| Secondary container (locate fill, pulse) | `#fe932c` |
| Amber text on a light status | `#92400e` |

- The header is translucent paper (`#f4fbf6` at 90%) with forest type. It is not a solid green bar. The wordmark is Newsreader in `#002217`. The explore mark is amber `#904d00`.
- Selected chips, the floating map pill, Directions, and map pins use primary `#002217` with white type.
- Cards are white. The page behind them is `#f4fbf6`. Search sits on `#eef5f0`.
- Text is `#161d1a`. Secondary text is `#414844`.
- Amber `#fe932c` and `#904d00` mark counts, the locate control, and paid/status dots. Brown `#c98400` and the old header green `#1f7a4d` are not in this UI. Directions is not amber.
- Hairlines are `#e2e5e1`. Photographs still carry the landscape.
- High contrast outdoors (WCAG 2.2 AA). Legible in Irish daylight and in a car park at dusk.

### Mobile-first, non-negotiable

Design for **one thumb**. Rural 3G, mid-range Android, installable PWA.

- Primary actions in the **bottom third**. Bottom tab bar. Bottom sheets, not top modals
- Tap targets **44px minimum**. No hover-only behaviour
- The **tick is always reachable** on the list card, the map pin sheet, and the place page — one tap, no confirmation modal
- Explore is **map and list as equals**, not a map buried in a tab
- Safe areas (notch + home indicator). Sticky bottom actions must clear the tab bar
- Light UI: photography is heavy; chrome is not. Generous type, little decoration

### Screens to design (mobile first)

1. **Explore — list**
   Sticky pill search, horizontal county chips, result count, Curated / A–Z. Forest field-note banner. Horizontal cards: photo, county badge, Newsreader name, status, View map, been / want / never when signed in. Floating map pill. Bottom tabs: Explore, Map, Saved, Profile.
2. **Explore — map**
   Ireland-centred pins in `#002217`. Locate in `#fe932c`. After pan: “Search this area”. Tap pin → bottom sheet with photo, name, visit marks, Open place.
3. **Place detail**
   Hero photograph, back control, county badge, Newsreader name, description, facility chips, mini-map, nearby cards. Sticky Directions in `#002217`, above the tab bar.
4. **Saved** (`/lists`)
   Been / want / never, same cards, optional personal map. Profile is the sign-in sheet. County totals stay off this screen.
5. **Empty / signed out**
   Near-me off is a quiet hint. Profile holds sign-in. Browsing does not require an account.

Also deliver: **colour tokens, type pairing, component notes** (card, chip, sheet, tab bar, check-off states, map pin). Check-off: empty → ticked, instant, satisfying, not a cartoon badge dump.

### Type

Headlines: **Newsreader** (place names, the Explore wordmark, the field-note title). UI: **Source Sans 3**. Icons: Material Symbols Outlined. Place names do the romance; the chrome stays workwear.

### What to avoid

- Tourism-board pastiche, shamrocks, harps as decoration, claddagh, “céad míle fáilte” as a headline
- Marketplace / booking chrome (dates, guests, “from €89”, Superhost)
- A solid green header bar, or amber as the Directions fill
- Neon CTAs or a dark-mode-first chrome. The UI stays the light paper field with forest primary actions above
- Designing desktop first and shrinking it

### Output

High-fidelity **mobile** frames for the screens above, plus a one-page visual system (tokens, type, card anatomy, check-off, map pin, photography crop rules). If you show desktop, it is a 2-column Explore (list | map) using the same mobile components — not a different product.

Tone of the finished UI: **paper header, white cards, forest primary actions, amber accents**. Ireland as the photograph. The Explore screen matches the Stitch frame: sticky search, a horizontal county chip rail (catalog counties, not invented heritage kinds), a forest field-note banner, horizontal photo cards, a floating map pill, and a bottom tab bar (Explore, Map, Saved, Profile).

---

## One screen at a time (Claude Design)

Paste **Shared system** once, then one screen prompt per generation. Keep the same tokens across screens.

### Shared system

Phone-first Irish place directory PWA. 390×844. Page `#f4fbf6`, white cards, text `#161d1a`, primary `#002217`, field note `#0f382a`, amber accent `#904d00` / `#fe932c`. Header is translucent paper, not a solid green bar. Photography is the product: cinematic Ireland, weather allowed. No shamrocks, no Fáilte / Discover Ireland / Wild Atlantic Way branding, no booking chrome. 44px targets, bottom tab bar (Explore, Map, Saved, Profile), one-thumb. Categories stay the catalog’s. County chips filter the list. Visit marks stay been / want / never.

Tokens: page `#f4fbf6`, cards `#ffffff`, text `#161d1a`, primary `#002217`, Directions the same primary, amber `#fe932c` for locate and small accents. Newsreader for place names, Source Sans 3 for UI.

### 1 — Explore list

Design the Explore **list** as the Stitch frame. Translucent header (explore mark, Newsreader “Explore”, search, bookmark, profile). Pill search. Horizontal county chips, All selected in `#002217` with an amber count. “Showing N places” plus a Curated / A–Z sort. Forest field-note banner. Horizontal cards: ~96px photo, county badge, Newsreader name, place line, status, View map. Floating “Interactive map view” pill. Bottom tabs: Explore / Map / Saved / Profile.

### 2 — Explore map

Same system. Ireland map, pins in `#002217`. Locate control in amber `#fe932c`. After pan: “Search this area”. One pin open as a **bottom sheet**: photo, name, county, visit marks, Open place. Sheet over the map; tab bar still visible. Phone reaches this from the floating map pill or the Map tab (`/?view=map`).

### 3 — Place detail

Same system. Hero photograph. Back control on the photo. County badge, name in Newsreader, category pill, short description, facility chips, mini-map, nearby cards in the same horizontal card. Sticky bottom, above the tab bar: Share, and Directions in primary `#002217` (white type). Visit marks stay been / want / never.

### 4 — My Places

Same system, on `/lists`, titled **Saved**. Been / want / never chips in the same rail as Explore. Cards match Explore. A “Your map” control opens the personal pins. Profile is the existing sign-in sheet, not a new account API. No county-total journal (that stays blocked on PRD-013).

### 5 — Visual system sheet (optional)

One frame: token swatches, Newsreader + Source Sans 3, horizontal card anatomy, map pin in `#002217`, bottom tab bar, chip selected/unselected. Caption: paper header, white cards, forest actions, amber accents.
