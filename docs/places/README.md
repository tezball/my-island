# Places

These 101 rows are the reviewed places of interest from the old repo file `data/leads/places.jsonl` at commit `6677c9c3fb1cdd993fc77eb6016d15eada9db4a3`, extracted after main was restarted. The old word in the file is `poi`; the current domain word is Place. Campsite lead rows were left out.

The rows are in [pois.jsonl](pois.jsonl), in source file order, with fields unchanged.

Fields: `id`, `name`, `place_type`, `county`, `country`, `town`, `lat`, `lng`, `notes_original`, `description`, `source_url`, `source_name`, `fetched_at`, `licence`, `status`, `dedupe_key`, `raw_refs`, `website`, `price_band`, `facility_ids`, `image_url`, `image_credit`, `image_licence`.

Every row has the fields through `price_band`. Eight rows omit `facility_ids`. Two rows omit `image_url`, `image_credit`, and `image_licence`.

Count by county:

| County | Count |
|---|---|
| Kerry | 9 |
| Clare | 8 |
| Galway | 8 |
| Cork | 7 |
| Antrim | 6 |
| Donegal | 6 |
| Dublin | 5 |
| Kilkenny | 4 |
| Mayo | 4 |
| Meath | 4 |
| Sligo | 4 |
| Westmeath | 4 |
| Wicklow | 4 |
| Armagh | 2 |
| Down | 2 |
| Fermanagh | 2 |
| Kildare | 2 |
| Laois | 2 |
| Leitrim | 2 |
| Limerick | 2 |
| Tipperary | 2 |
| Waterford | 2 |
| Carlow | 1 |
| Cavan | 1 |
| Derry | 1 |
| Longford | 1 |
| Louth | 1 |
| Monaghan | 1 |
| Offaly | 1 |
| Roscommon | 1 |
| Tyrone | 1 |
| Wexford | 1 |
