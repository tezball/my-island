# Seed review

A seeded stay is public only when it passes the review bar: plain text, a PNG or JPEG, and a pin on the island (latitude 51.0 to 55.5, longitude -11.0 to -5.0). A website would also have to return 2xx. The seed has no websites.

Every seeded stay already has plain text and a pin on the island. The photo is the remaining check. Flyway `V5__launch.sql` attaches a small PNG to the titles whose number does not divide by 4, then publishes those rows. Titles 004, 008, and so on get no photo, so the bar leaves them hidden. That is 75 public stays and 25 hidden stays across the 100 hosts.

Gatling rows titled `Load camp N` stay hidden and out of the review deck. A seeded stay that fails the bar is not published.

Tools: Flyway `V5__launch.sql`, PostgreSQL.
