# MVP

Web only. Phone first. A desktop browser gets the same screens, stacked for a narrow phone and widened when there is room.

## In

- A public list and map of places, stays, and experiences on the island of Ireland.
- A page for each listing.
- A signed-in person can check off a place they have been. That check-off is theirs.
- A host can sign up, add one or more stays, and edit each stay on its own page.
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
- A page per pitch or per room. One page per stay.

## Done

A person on a phone can open the site, find a place, check it off, and a host can change their stay. The change is not public until review passes. `main` deploys itself and the Gatling run against that deploy is green.
