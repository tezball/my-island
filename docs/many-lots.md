# Many lots

The host form starts with one lot and an Add a lot button. Each lot has a name, a sleep count, and an optional EUR price. Save sends `lots` as a list on the stay. The listing page prints every lot on that stay. There is no separate page per lot or room.

The API already accepted a list. The form was the gap: it used to send one lot.

Tools: the existing `lot` table, the host page served by Ktor.
