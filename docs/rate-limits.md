# Rate limits

Sign-in and create are capped in memory for the life of the process.

Sign-in (`/sessions` and `/sessions/google`) allows 120 attempts per minute for one email and 400 per minute for one client address. Create allows 20 per minute for one account, and 20 per minute for one client address on `/accounts`. Create here is a new account, a new stay, a new experience, a new place, or more images on a place. An edit is not a create. The extra attempt gets HTTP 429.

The numbers sit above the catalog load, which signs in the guest and the admin 100 times and lets each of 100 hosts create one stay. `SIGN_IN_LIMIT`, `SIGN_IN_IP_LIMIT`, and `CREATE_LIMIT` override them. Tests set the Ktor config keys `island.signInLimit`, `island.signInIpLimit`, and `island.createLimit`.

Tools: an in-process window (`HitWindow`) inside the Ktor application. Nothing is written to the database for the cap.
