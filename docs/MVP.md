# MVP

Web only. Phone first. A desktop browser gets the same screens, stacked for a narrow phone and widened when there is room.

## In

- A public list and map of places, stays, and experiences on the island of Ireland, Republic and Northern Ireland.
- One page per listing, and that page can list many lots or rooms.
- A signed-in person can check off a place they have been. That check-off is theirs.
- A host can sign up, add many listings, and edit each listing on its page.
- Kinds of stay in the MVP: campsite, glamping, bed and breakfast.
- An admin screen for `tezball86@gmail.com` to see listings and hosts.
- A listing stays hidden from the public until an automatic review finishes clean. An edit hides it again until review passes.
- Gatling simulations for the public browse, the check-off, the host edit, and the admin view.
- A pipeline from a commit on `main` to a deploy and a Gatling run against that deploy.

## Out

- Android and iOS binaries.
- Location notifications, deals, and “near me” alerts.
- Card payments, fees, refunds, and a pay button.
- Host approval of a booking. That is the slice after the MVP.
- Hotels.
- A separate public page per lot or room.

## Done

A person on a phone can open the site, find a place, check it off, and a host can change their stay. The change is not public until review passes. `main` deploys itself and the Gatling run against that deploy is green.
