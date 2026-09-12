# Lead sources (intended)

Research may collect **leads** from public aggregator and open lists. This is not a scrape-how-to and not a publish licence. Read [`LEGAL.md`](LEGAL.md) first.

| Source | Why | Notes |
|---|---|---|
| [Camping Ireland](https://www.campingireland.ie) | Irish Caravan & Camping Council; Fáilte-approved parks | Prefer as a *finder*, then record the operator site as `source_url` when possible |
| [Pitchup Ireland](https://www.pitchup.com/en-ie/) | Aggregated Irish pitches | Aggregator ToS/database-right risk is high — leads-only |
| Fáilte Ireland / tourism lists | Official-style directories and county pages | Same: facts + provenance, not copied blurbs |
| Glamping directories (e.g. [glampinginireland.com](https://glampinginireland.com)) | Glamping / pod sites missing from caravan lists | Leads-only |
| Wikidata | Coordinates (P625), official website (P856), Commons file (P18) | Facts are CC0. Do not paste Wikipedia prose |
| Wikimedia Commons | Place stills with a free licence | Attribution + licence on the Place; no tourism-site hotlink |

Starter archaeology (already migrated): [`docs/leads/CAMPSITE_LEADS.md`](../../leads/CAMPSITE_LEADS.md).

Wave 1 landed 2026-09-06 from [Camping Ireland](https://www.campingireland.ie/parks/) (county and park pages) plus the Fáilte Ireland Q3 2026 registered caravan & camping list linked from [accommodation registers](https://www.failteireland.ie/en/quality-assured-accommodation/accommodation-registers). `places.jsonl` keeps those 114 campsite **leads**. 2026-09-12 added ~100 POI rows from Wikidata + Commons for the directory demo — not a scrape of Fáilte, Camping Ireland, or Pitchup.

Do not add a source that requires login, paywall bypass, or CAPTCHA solving. Record the public URL and stop.
