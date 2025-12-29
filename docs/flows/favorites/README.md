# Favorites Flow

The favorites flow allows users to save and manage their favorite campsites for easy access.

## Screens

| # | Screen | File | Description |
|---|--------|------|-------------|
| 1 | Favorites List | `01-favorites.png` | Saved campsites grid |

## User Stories

### US-FAV-001: View Saved Favorites
**As a** user
**I want to** see all my saved campsites
**So that** I can quickly access places I'm interested in

**Acceptance Criteria:**
- Grid or list of favorited campsites
- Each card shows: image, name, location, price, rating
- Sorted by date added (most recent first)
- Empty state with prompt to explore if no favorites
- Tapping card navigates to campsite detail

---

### US-FAV-002: Save Campsite to Favorites
**As a** user
**I want to** save a campsite I like
**So that** I can find it easily later

**Acceptance Criteria:**
- Heart icon on campsite cards and detail page
- Tap to toggle favorite status
- Filled heart = favorited
- Visual feedback on tap (animation)
- Requires login (prompt if not logged in)
- Synced across devices

---

### US-FAV-003: Remove from Favorites
**As a** user
**I want to** remove a campsite from favorites
**So that** I can keep my list relevant

**Acceptance Criteria:**
- Tap heart icon to unfavorite
- Can remove from favorites screen or detail page
- No confirmation required (easy undo)
- Undo option shown briefly (toast)
- Card removed from favorites list immediately

---

### US-FAV-004: Search Within Favorites
**As a** user with many favorites
**I want to** search my saved campsites
**So that** I can find a specific one quickly

**Acceptance Criteria:**
- Search field at top of favorites screen
- Filters favorites by name or location
- Results update as user types
- Clear search to show all

---

### US-FAV-005: Filter Favorites
**As a** user
**I want to** filter my favorites by type
**So that** I can find campsites matching my current needs

**Acceptance Criteria:**
- Filter chips (All, Tent, RV, Cabin, Glamping)
- Tapping chip filters the list
- Active filter visually indicated
- Count shown for each filter option

---

### US-FAV-006: Quick Book from Favorites
**As a** user
**I want to** start a booking from my favorites list
**So that** I can book faster

**Acceptance Criteria:**
- "Book" button on favorite cards
- Navigates to booking flow for that campsite
- Pre-selects campsite in booking context

---

## Flow Diagram

```
┌─────────────┐
│ Bottom Nav: │
│  Favorites  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│          Favorites              │
│  ┌─────────────────────────┐   │
│  │ Search favorites...      │   │
│  └─────────────────────────┘   │
│                                 │
│  [All] [Tent] [RV] [Cabin] ... │
│                                 │
│  ┌──────────┐ ┌──────────┐    │
│  │ Campsite │ │ Campsite │    │
│  │  Card    │ │  Card    │    │
│  │  [♥]     │ │  [♥]     │    │
│  └──────────┘ └──────────┘    │
│                                 │
│  ┌──────────┐ ┌──────────┐    │
│  │ Campsite │ │ Campsite │    │
│  │  Card    │ │  Card    │    │
│  └──────────┘ └──────────┘    │
└──────────────┬──────────────────┘
               │ Tap Card
               ▼
        ┌─────────────┐
        │  Campsite   │
        │   Detail    │
        └──────┬──────┘
               │
               ▼
        ┌─────────────┐
        │   Booking   │
        │    Flow     │
        └─────────────┘
```

## Related Pages

- `src/pages/FavoritesPage.tsx`
- `src/pages/CampsiteDetailPage.tsx`
- `src/components/campsite/CampsiteCard.tsx`
- `src/types/index.ts` (User.savedCampsites)

## Notes

- Favorites should sync across devices for logged-in users
- Consider offline access to favorite campsite basic info
- Limit max favorites to prevent abuse (e.g., 100)
- Track favorite metrics for personalization
