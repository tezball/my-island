# my-island

Product definition for a mobile directory of places in Ireland worth going to — points of interest,
experiences, campsites and B&Bs — that you tick off as you go.

**Start here: [`product/`](product/).**

## Status

Product definition, awaiting sign-off. **No code, and no technology chosen yet.**

The previous build — a camping and glamping booking platform — has been removed. It remains in git
history at tag `legacy-platform` if it is ever needed.

## Choosing a stack

The product documents deliberately state *capabilities*, not technologies. Nothing in `product/`
prescribes a language, framework, database or hosting model. Selection happens against the
requirements in [`product/MVP.md`](product/MVP.md) §3 and the `NFR-*` stories in §4 — most notably:

- Mobile-first, one-handed, installable to a phone home screen without an app-store gate
- Readable and usable offline; writes made offline queue and sync idempotently
- Interactive within 2.5s on a mid-range Android phone over 4G
- Map-heavy, with clustering and location awareness
- A curator-facing content tool alongside the public app
- WCAG 2.2 AA, GDPR export and erasure from day one
