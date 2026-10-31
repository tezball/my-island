# Stored photos

A PNG or JPEG on a stay or an experience is stored on that row (`image` bytea and `image_type`). The public listing page shows it with `/listings/{id}/photo` when the row is public. A hidden row does not serve that URL. The admin review card can still load the bytes while the row is hidden.

The same size cap as the rest of the app applies before the bytes are kept. An invalid file is not stored. A valid file is kept even when another part of automatic review hides the row, so the admin can see it.

Tools: JDK Base64, PostgreSQL bytea, Ktor `respondBytes`, Flyway `V4__harden.sql`.
