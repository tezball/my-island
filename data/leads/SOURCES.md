# Lead sources (intended)

Research may collect **leads** from public aggregator and open lists. This is not a scrape-how-to and not a publish licence. Read [`LEGAL.md`](LEGAL.md) first.

| Source | Why | Notes |
|---|---|---|
| [Camping Ireland](https://www.campingireland.ie) | Irish Caravan & Camping Council; Fáilte-approved parks | Prefer as a *finder*, then record the operator site as `source_url` when possible |
| [Pitchup Ireland](https://www.pitchup.com/en-ie/) | Aggregated Irish pitches | Aggregator ToS/database-right risk is high — leads-only |
| Fáilte Ireland / tourism lists | Official-style directories and county pages | Same: facts + provenance, not copied blurbs |
| Glamping directories (e.g. [glampinginireland.com](https://glampinginireland.com)) | Glamping / pod sites missing from caravan lists | Leads-only |
| County / local tourism pages | Coverage gaps by county | Prefer operator contact pages over scraped HTML |

Starter archaeology (already migrated): [`docs/leads/CAMPSITE_LEADS.md`](../../docs/leads/CAMPSITE_LEADS.md).

Wave 1 landed 2026-09-06 from [Camping Ireland](https://www.campingireland.ie/parks/) (county and park pages) plus the Fáilte Ireland Q3 2026 registered caravan & camping list linked from [accommodation registers](https://www.failteireland.ie/en/quality-assured-accommodation/accommodation-registers). `places.jsonl` is 114 campsite leads: 29 starter rows kept, 20 of those enriched, 85 new. Facts and provenance only — not a scrape how-to and not a publish licence.

Do not add a source that requires login, paywall bypass, or CAPTCHA solving. Record the public URL and stop.
