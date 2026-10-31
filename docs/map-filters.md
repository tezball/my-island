# Map filters

The explore page keeps the Leaflet map, centered on Ireland at `[53.4, -7.9]` zoom 6. A control sits in the top-right corner of the map. Its boxes are on by default:

- Your places — places this account added
- Other places — the rest of the public places
- Places you have stayed — private visits
- Places you could stay — public stays

Supplier experiences stay on the map. They are not one of those four boxes. A place the person has visited is drawn when either its place box or the stayed box is on.

Signed out, your places and places stayed are empty. The control says: "Your places: none. You are not signed in." and "Places you have stayed: none. You are not signed in." Sign-in on the control stores the session token and reloads those two sets from `/me/places` and `/me/visits`.

If the browser allows geolocation and the point is on the island (latitude 51 to 55.5, longitude -11 to -5), the map centers there at zoom 12. If it is denied, or the point is off the island, the Ireland view stays.

## Pins

Each pin is an inline SVG in a Leaflet div icon. The legend in the corner uses the same colours.

| Type | Colour | Shape |
|---|---|---|
| Place | `#1B4F72` | Teardrop pin |
| Campsite | `#2E7D32` | Triangle tent |
| Glamping | `#C56A12` | Dome |
| Bed and breakfast | `#9A3412` | House |
| Supplier experience | `#0F6E8C` | Circle with a compass needle |

Stays use the campsite, glamping, or bed and breakfast pin. Places use the teardrop. Experiences use the circle.

Tools: Leaflet 1.9.4 already on the page, the browser Geolocation API, inline SVG. No new map library. Place, stay, and experience coordinates come from the existing JSON lists.
