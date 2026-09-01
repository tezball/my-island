# Product

Product definition for the rebuild. Start here.

| Document | What it is |
|---|---|
| [`BRIEFING.md`](BRIEFING.md) | CEO briefing — what the repo is, what we are building, what was built before, open decisions |
| [`VISION.md`](VISION.md) | What we are building and why. Principles, roles, decisions made, open questions for the business |
| [`MVP.md`](MVP.md) | Release 1 — the checkable directory. 92 stories, data model, success criteria, definition of done |
| [`EXPANSION.md`](EXPANSION.md) | Everything after, in 10 chunks. Each with the question it answers and the evidence needed to start it |
| [`NAMING.md`](NAMING.md) | Candidate names, trademark landmines to avoid, and the selection criteria |
| [`STACK.md`](STACK.md) | House technology: Java / Spring; logs, metrics and alerts via MCP (OSS first) |
| [`ENGINEERING.md`](ENGINEERING.md) | CTO review — MCP-accessible AI engineer loop, recommended choices, open questions |
| [`READINESS.md`](READINESS.md) | Can a team implement yet? What is enough, what forks, what to freeze |

Day-to-day engineering is not this folder. Tickets and the agent loop live in [`../ops/`](../ops/).

## The short version

A mobile directory of places in Ireland worth going to — points of interest, experiences, campsites
and B&Bs — that you tick off as you go.

The MVP tests one thing: **will people bother to record where they have been?** Everything else is
gated on the answer.

## Status

Draft, awaiting sign-off. **Nothing built.** Backend is a **Java / Spring house**;
logs, metrics and alerts are queried through MCP, OSS first — see [`STACK.md`](STACK.md).
Client framework, database and host are still open against `MVP.md` §3 and the
`NFR-*` stories.

The previous camping-platform build has had its code removed from the working tree; its
documentation is retained in `../docs/` for reference. That material describes a booking platform
and is superseded by this directory — read it as history, not as requirements. The full previous
codebase remains in git history at tag `legacy-platform`.
