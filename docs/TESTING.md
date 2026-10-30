# Tests

Every pull request and every main run includes this suite. The suite finishes in 5 minutes or less.

One PostgreSQL 17 + PostGIS Testcontainers database for the whole suite. Tests run in parallel. They do not start a second database.

`Seeder.getUsername()` is thread-safe and returns a new username on every call. The same seeder mints unique places, stays, and lots. A test does not read or write another test’s rows.

The suite covers unit, API against that database, web, and the compose stack. Gatling runs after a deploy and is not part of the 5-minute suite. A red Gatling run fails the deploy.
