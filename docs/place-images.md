# Place images

The admin form is where images are added to a place. A new place can include them, and an existing place id can receive more. PNG and JPEG only. A place holds at most five.

The form uses a multiple file input (`accept="image/png,image/jpeg"`). The page says "Up to five PNG or JPEG images." The server checks the same rule. A sixth image, on create or on a later add, is HTTP 400 and nothing from that request is stored. A file that is not a PNG or JPEG is HTTP 400 with "PNG or JPEG only". Each image also has to fit the photo size cap.

Bytes live in `place_image` with a position from 0 through 4. The place page shows every image, in that order, from `/listings/{id}/images/{position}`.

Adding images counts toward the create rate limit. Only `tezball86@gmail.com` can add them.

Tools: JDK Base64, PostgreSQL `place_image` in Flyway `V4__harden.sql`, the admin page in Ktor.
