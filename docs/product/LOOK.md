---
title: Look and feel
type: product
status: draft
owner: Product
created: 2026-09-13
---

# Look and feel

Working visual brief for the **phone-first directory PWA**. Not signed. Public name is still unset — [`NAMING.md`](NAMING.md), [`ops/company/BRAND.md`](../ops/company/BRAND.md). Constraints: [`MVP.md`](MVP.md) §3.

Feed the blocks below to Claude Design (or another visual designer). Do not print `my-island` on a customer surface.

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

### Colour — green, but quiet

Green is the brand colour. It must **not** dominate.

- A **soft Irish green**: moss, sage, lichen, Atlantic pine — not Kelly, not emerald, not “St Patrick’s Day”
- Green is for: wordmark accent, selected chips, map category, the check-off when ticked, focus rings, small labels
- Most of the UI is **warm paper / stone / mist / cream**. Large fills of green are wrong
- Photographs carry the colour of the landscape; the chrome stays quiet so the photos punch
- One restrained gold/gorse accent only if needed (locate FAB, “near me”) — never competing with green
- Dark ink for type. High contrast outdoors (WCAG 2.2 AA). Legible in Irish daylight and in a car park at dusk

Suggest a small token set: paper, ink, moss (primary), mist (hairline), sheet (surfaces), gorse (rare accent), danger.

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
   Search, category/county filters (reachable without scrolling), result count. Photo-led place cards: large image, name, category, county, distance, **check-off on the card**. Mix POI / campsite / B&B so the image language for each is obvious.
2. **Explore — map**
   Ireland-centred, clustered pins coloured/iconed by category. Ticked places look different. Tap pin → **bottom sheet**: big photo, name, category, one-tap tick, “Open place”. “Search this area” after pan. Locate control.
3. **Place detail**
   Hero photograph that could be a postcard of Ireland. Name, category, county/town, short original description, practical chips (parking, dogs, season, € / free), mini-map, nearby places, share. Sticky bottom: Directions + **Been here**. For a B&B or campsite, show **Stayed** as a sibling of visited — still one tap.
4. **My Places**
   Personal record: total count, **32 counties** as the motivating number, category breakdown, photo grid or list of ticked places, personal map. Feels like a journal you are proud of, not a settings page.
5. **Optional fifth:** empty / first-run (“near me” with location off) and a quiet Google/Apple sign-in chip — never a wall of auth before browsing.

Also deliver: **colour tokens, type pairing, component notes** (card, chip, sheet, tab bar, check-off states, map pin). Check-off: empty → ticked, instant, satisfying, not a cartoon badge dump.

### Type

Headlines: a distinctive serif or Irish-inflected display that can sit on a photograph (place names like *Skellig Michael*, *Fanad Lighthouse*). UI: a humanist sans. Keep the pairing calm. Place names do the romance; the chrome stays workwear.

### What to avoid

- Tourism-board pastiche, shamrocks, harps as decoration, claddagh, “céad míle fáilte” as a headline
- Marketplace / booking chrome (dates, guests, “from €89”, Superhost)
- Tiny thumbnails that waste Ireland
- Saturated green backgrounds, neon CTAs, dark-mode-first (light, outdoor, paper)
- Designing desktop first and shrinking it

### Output

High-fidelity **mobile** frames for the screens above, plus a one-page visual system (tokens, type, card anatomy, check-off, map pin, photography crop rules). If you show desktop, it is a 2-column Explore (list | map) using the same mobile components — not a different product.

Tone of the finished UI: **quiet chrome, loud landscape**. Green as a whisper. Ireland as the photograph.

---

## One screen at a time (Claude Design)

Paste **Shared system** once, then one screen prompt per generation. Keep the same tokens across screens.

### Shared system

Phone-first Irish place directory PWA. 390×844. Quiet warm paper chrome; **soft moss/sage green as accent only** — never a green fill. Photography is the product: cinematic Ireland, weather allowed. No shamrocks, no Fáilte / Discover Ireland / Wild Atlantic Way branding, no booking chrome. 44px targets, bottom tab bar, one-thumb. Categories: POI, experience, campsite, B&B. One-tap check-off on every place surface.

Tokens: paper (warm cream), ink (near-black green-grey), moss (selected / ticked / links), mist (hairlines), sheet (cards), gorse (rare locate accent). Serif for place names, humanist sans for UI.

### 1 — Explore list

Design the Explore **list**. Search + category/county chips without scrolling. Result count. Full-bleed photo cards (not 112px thumbs) for: Cliffs of Moher (POI), a Kerry campsite, a Dingle B&B, Fanad Lighthouse, Glendalough. Each card: huge photo, name, category, county, distance, check-off control. Mix ticked and unticked. Bottom tabs: Explore / Map / My Places.

### 2 — Explore map

Same system. Ireland map, clustered pins by category, ticked pins distinct. Locate FAB (gorse, once). After pan: “Search this area”. One pin open as a **bottom sheet**: big photo of Skellig Michael in mist, name, Kerry, one-tap Been here, Open place. Sheet over the map; tab bar still visible.

### 3 — Place detail

Same system. Hero is a postcard crop of Great Blasket cottages by the sea (or Fanad Lighthouse). Back control on the photo. Name in serif, category pill in moss, county/town, short direct description, chips for parking / dogs / season / free or €. Mini-map. Nearby photo-led cards. Sticky bottom: Directions + Been here (Stayed as well if this were a B&B). Safe area above the tab bar.

### 4 — My Places

Same system. Feels like a journal. Hero number: **counties visited of 32**. Total places + breakdown (POI / experience / campsite / B&B). Photo grid of ticked places (Moher, Newgrange, a campsite stay, a B&B). Toggle to a personal map of coverage. No settings-page energy. Check-offs already ticked, moss.

### 5 — Visual system sheet (optional)

One frame: token swatches, type pairing, list-card anatomy (photo crop rules), check-off empty/ticked, map pin set (four categories + ticked), bottom tab bar, chip selected/unselected. Caption: quiet chrome, loud landscape.
