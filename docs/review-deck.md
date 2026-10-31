# Review deck

`GET /admin/review/next` returns one hidden stay, hidden experience, or unapproved guide account that a person just saved and that has no reject reason yet. Approve and Reject-with-reason are unchanged.

Seed stays, Gatling rows titled `Load camp N`, and the seeded experiences stay out of the deck. A seed row stays hidden when it fails the review bar. Saving from `POST /host/stays`, `POST /host/stays/{id}`, `POST /supplier/experiences`, or `POST /supplier/experiences/{id}` sets `saved_by_person`. A `Load camp N` title does not. The deck query requires that flag, plus `hidden` and a null `review_reason`, and it skips `Load camp N` titles.

The screen says guide for an account whose role is still `supplier`. The approve and reject URLs still use `supplier`.

Tools: Flyway `V5__launch.sql`, PostgreSQL, Ktor HTML.
