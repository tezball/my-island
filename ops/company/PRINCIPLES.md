---
title: Principles
type: company
---

# Principles

Agents treat these as constraints, not slogans.

## Product (from canon)

Full argument: [`product/VISION.md`](../../product/VISION.md).

1. **Phone first** — one thumb, outdoors, rural 3G. Desktop is a courtesy.
2. **Check-off is one tap** — no modal, no required fields on the tick.
3. **Private by default** — sharing is opt-in. A public map must never reveal where someone lives.
4. **Directory quality before scale** — curator-seeded at launch, not a scrape dump.
5. **Ship the smallest test of the assumption** — will people record where they have been?
6. **Businesses after users** — a marketplace with one empty side is a website.
7. **Category is data** — do not hard-code “campsite” as the only listing type.

## Ops

1. **Git is the company.** Tickets, plans, run logs, and the handbook live here.
2. **One ticket, one session, one PR.**
3. **Plan before code.** Implementers need `ops/plans/<id>.md` and ticket `status: implement`.
4. **Reviewers never merge.** [[workflow/SAFETY]]
5. **No prod deploy, no prod SQL writes, Grafana read-only.**
6. **Do not rebuild Jenkins** from `docs/automation/`.
7. **Do not implement product** unless `id` is `PRD-*` and `status` is `implement`.
8. **Preserve history.** `docs/` and tag `legacy-platform` stay. Do not delete to tidy.

## Trust, safety, GDPR

- Consent before non-essential cookies.
- Export and erasure are MVP (see `product/MVP.md` ACC-07/08, ADM-04, NFR-05).
- Support and content agents escalate anything that looks like abuse, self-harm, or a data-subject request to [[agents/roles/trust-safety]] — they do not freelance a legal answer.
