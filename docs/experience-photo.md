# Seeded experience photo

A new experience with no PNG or JPEG stays hidden. `kayak-cork` is the seeded public experience, so it has to obey that rule too.

Flyway `V5__launch.sql` stores the same small PNG used for a passing stay, when the name and description are plain text and the pin is on the island. The row stays public, and `GET /listings/kayak-cork/photo` returns that PNG. If those checks failed, the migration would hide `kayak-cork` instead.

`bike-galway` and `boat-antrim` stay hidden. They are seeded, not saved by a guide, and they are not in the review deck.

Tools: Flyway, PostgreSQL `bytea`, the existing public photo route.
