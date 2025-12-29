# Discovery Flow

The discovery flow allows users to explore and find campsites through map view, search, filtering, and detailed campsite information.

## Screens

| # | Screen | File | Description |
|---|--------|------|-------------|
| 1 | Home / Map View | `01-home-map.png` | Map-based campsite discovery |
| 2 | Search | `02-search.png` | Search with filters |
| 3 | Campsite Detail 1 | `03-campsite-detail-1.png` | Campsite info (top section) |
| 4 | Campsite Detail 2 | `04-campsite-detail-2.png` | Campsite info (facilities, lots) |

## User Stories

### US-DISC-001: View Campsites on Map
**As a** user
**I want to** see campsites plotted on a map
**So that** I can discover locations near places I want to visit

**Acceptance Criteria:**
- Interactive map displays on home screen
- Campsite markers show location and basic info
- Tapping marker shows preview card with name, price, rating
- Map is pannable and zoomable
- Current location option available (with permission)
- Clusters shown when zoomed out to prevent overcrowding

---

### US-DISC-002: View Campsites as List
**As a** user
**I want to** view campsites in a scrollable list
**So that** I can browse options without using the map

**Acceptance Criteria:**
- Toggle between map and list view
- List shows campsite cards with image, name, location, price, rating
- Cards are tappable to view details
- Infinite scroll or pagination for large results
- Sort options (price, rating, distance)

---

### US-DISC-003: Search for Campsites
**As a** user
**I want to** search for campsites by location or name
**So that** I can find specific places

**Acceptance Criteria:**
- Search input field with clear button
- Search by campsite name
- Search by location/area name
- Autocomplete suggestions as user types
- Recent searches shown when field is focused
- Results update map and/or list view

---

### US-DISC-004: Filter Campsites
**As a** user
**I want to** filter campsites by type, price, amenities, and rating
**So that** I can find places that match my preferences

**Acceptance Criteria:**
- Filter button opens filter modal/sheet
- Filter by accommodation type (tent, RV, cabin, glamping)
- Filter by price range (min/max slider)
- Filter by minimum rating (3+, 3.5+, 4+, 4.5+)
- Filter by amenities (WiFi, showers, pets, pool, etc.)
- Active filters shown as chips
- Clear all filters option
- Results count updates in real-time

---

### US-DISC-005: View Campsite Details
**As a** user
**I want to** view detailed information about a campsite
**So that** I can decide if it's right for my trip

**Acceptance Criteria:**
- Hero image with photo gallery access
- Campsite name, location, rating, review count
- Price per night displayed
- Description/about section
- Facilities grid with icons
- Available lots/units with pricing
- Location on map
- Host/owner info with Superhost badge if applicable
- Reviews summary
- "Book Now" CTA button

---

### US-DISC-006: View Photo Gallery
**As a** user
**I want to** browse all photos of a campsite
**So that** I can see what the place looks like

**Acceptance Criteria:**
- Tap hero image to open gallery
- Full-screen image viewer
- Swipe left/right to navigate
- Thumbnail strip for quick navigation
- Pinch to zoom on images
- Close button returns to detail screen
- Photo count indicator (e.g., "3 of 12")

---

### US-DISC-007: View Campsite Location
**As a** user
**I want to** see the exact location of a campsite on a map
**So that** I can plan my travel

**Acceptance Criteria:**
- Map section on detail page shows pin
- Address displayed in text
- "Get Directions" button opens maps app
- Nearby points of interest shown (optional)

---

### US-DISC-008: Save Campsite to Favorites
**As a** user
**I want to** save a campsite to my favorites
**So that** I can easily find it later

**Acceptance Criteria:**
- Heart/favorite icon on campsite card and detail page
- Tapping toggles favorite state
- Visual feedback (filled heart = saved)
- Saved campsites accessible from Favorites tab
- Works for logged-in users only (prompt login if not)

---

### US-DISC-009: Share Campsite
**As a** user
**I want to** share a campsite with friends
**So that** we can plan trips together

**Acceptance Criteria:**
- Share button on detail page
- Opens native share sheet
- Shareable link or deep link generated
- Preview includes campsite name and image

---

### US-DISC-010: View Available Lot Types
**As a** user
**I want to** see what types of lots are available
**So that** I can choose the right accommodation

**Acceptance Criteria:**
- Lots section on detail page
- Each lot shows: name, type, max guests, size, price
- Visual indicator for lot type (tent, RV, cabin, glamping)
- Availability status (if known)
- Tapping lot may show more details or start booking

---

## Flow Diagram

```
┌─────────────┐
│    Home     │
│  (Map View) │◄────────────────────────────────┐
└──────┬──────┘                                 │
       │                                        │
       ├────────────┬────────────┐              │
       ▼            ▼            ▼              │
┌─────────────┐ ┌─────────┐ ┌─────────┐        │
│   Search    │ │  Filter │ │  List   │        │
│   Input     │ │  Modal  │ │  View   │        │
└──────┬──────┘ └────┬────┘ └────┬────┘        │
       │             │           │              │
       └─────────────┴───────────┘              │
                     │                          │
                     ▼                          │
              ┌─────────────┐                   │
              │  Campsite   │                   │
              │   Detail    │───────────────────┤
              └──────┬──────┘                   │
                     │                          │
       ┌─────────────┼─────────────┐           │
       ▼             ▼             ▼           │
┌─────────────┐ ┌─────────┐ ┌─────────┐       │
│   Photo     │ │  Save   │ │  Share  │       │
│  Gallery    │ │Favorite │ │         │       │
└─────────────┘ └─────────┘ └─────────┘       │
                                               │
                     │                         │
                     ▼                         │
              ┌─────────────┐                  │
              │   Book Now  │──────────────────┘
              │   (→Booking)│      (Back)
              └─────────────┘
```

## Related Pages

- `src/pages/HomePage.tsx`
- `src/pages/SearchPage.tsx`
- `src/pages/ListViewPage.tsx`
- `src/pages/CampsiteDetailPage.tsx`
- `src/pages/PhotoGalleryPage.tsx`
- `src/components/campsite/CampsiteCard.tsx`
- `src/components/campsite/FacilitiesGrid.tsx`
- `src/components/ui/FilterModal.tsx`

## Notes

- Map uses Leaflet with OpenStreetMap tiles
- Consider caching campsite data for offline viewing
- Image lazy loading for performance
- Search should debounce API calls
