# Implementation Plan: Phases 1 + 2

**Date:** 2026-01-06
**Scope:** Critical Bug Fixes + Property Selector Component
**Estimated Effort:** 6-7 hours

---

## Overview

This plan addresses the critical issues identified in the Owner Dashboard review for multi-property owners. It combines:
- **Phase 1:** Fix data loading bugs and show all properties' data
- **Phase 2:** Add consistent property selector across owner pages

---

## Phase 1: Critical Bug Fixes

### 1.1 Fix Bookings Page Data Loading

**Problem:** `OwnerBookingsPage.tsx` calls `bookingsApi.list()` which fetches `/api/bookings` (guest bookings), not the owner's property bookings.

**Solution:**
1. Add `getOwnerBookings()` method to `src/lib/api/owner.ts`
2. Update `OwnerBookingsPage.tsx` to use `ownerApi.getOwnerBookings()`

**Files to Modify:**
- `src/lib/api/owner.ts` - Add new API method
- `src/pages/owner/OwnerBookingsPage.tsx` - Use correct API

**Backend Endpoint (already exists):**
```
GET /api/owner/bookings?status={status}&page={page}&size={size}
```

---

### 1.2 Fix Lots Page - Show All Properties

**Problem:** `ManageLotsPage.tsx` only fetches lots for `campsites[0]`, ignoring other properties.

**Solution:**
1. Fetch ALL campsites for the owner
2. Fetch lots for EACH campsite
3. Combine into single list with campsite reference
4. Add campsite name to lot display

**Files to Modify:**
- `src/pages/owner/ManageLotsPage.tsx`

**Changes:**
```typescript
// Before: Only first campsite
const lotsData = await ownerApi.getLotsByCampsite(campsites[0].id)

// After: All campsites
const allLots = await Promise.all(
  campsites.map(c => ownerApi.getLotsByCampsite(c.id))
)
```

---

### 1.3 Add Campsite Name to Bookings List

**Problem:** Bookings don't show which property they belong to.

**Solution:** Display campsite name in booking card.

**Files to Modify:**
- `src/pages/owner/OwnerBookingsPage.tsx` - Add campsite name display

---

## Phase 2: Property Selector Component

### 2.1 Create PropertySelector Component

**Purpose:** Reusable dropdown for selecting a property or "All Properties"

**Location:** `src/components/owner/PropertySelector.tsx`

**Props:**
```typescript
interface PropertySelectorProps {
  campsites: CampsiteResponse[]
  selectedId: string | 'all'
  onSelect: (id: string | 'all') => void
  label?: string
  showAllOption?: boolean
}
```

**Features:**
- Dropdown with property names
- "All Properties" option when `showAllOption=true`
- Shows property count badge
- Consistent styling with existing selects

---

### 2.2 Create PropertyContext

**Purpose:** Share selected property state across owner pages

**Location:** `src/context/PropertyContext.tsx`

**State:**
```typescript
interface PropertyContextValue {
  campsites: CampsiteResponse[]
  selectedCampsiteId: string | 'all'
  selectedCampsite: CampsiteResponse | null
  setSelectedCampsiteId: (id: string | 'all') => void
  isLoading: boolean
}
```

**Features:**
- Fetches owner's campsites on mount
- Persists selection to localStorage
- Syncs selection to URL params (optional)

---

### 2.3 Add PropertySelector to Owner Pages

**Pages to Update:**

| Page | File | Behavior |
|------|------|----------|
| Dashboard | `OwnerDashboardPage.tsx` | Show multi-property status toggles |
| Bookings | `OwnerBookingsPage.tsx` | Filter bookings by property |
| Calendar | `OwnerCalendarPage.tsx` | Filter calendar by property |
| Lots | `ManageLotsPage.tsx` | Filter lots by property |

**Implementation Pattern:**
```tsx
const { selectedCampsiteId, campsites } = useProperty()

// Filter data based on selection
const filteredBookings = selectedCampsiteId === 'all'
  ? allBookings
  : allBookings.filter(b => b.campsite.id === selectedCampsiteId)
```

---

## File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `src/components/owner/PropertySelector.tsx` | Reusable property dropdown |
| `src/context/PropertyContext.tsx` | Property selection state |

### Modified Files
| File | Changes |
|------|---------|
| `src/lib/api/owner.ts` | Add `getOwnerBookings()` method |
| `src/pages/owner/OwnerBookingsPage.tsx` | Fix API, add property filter, add campsite column |
| `src/pages/owner/ManageLotsPage.tsx` | Fetch all properties' lots, add property filter |
| `src/pages/owner/OwnerDashboardPage.tsx` | Add PropertyContext, multi-property toggles |
| `src/pages/owner/OwnerCalendarPage.tsx` | Add property filter |
| `src/pages/owner/OwnerStatsPage.tsx` | Use PropertyContext for consistency |
| `src/App.tsx` | Wrap owner routes with PropertyProvider |

---

## Implementation Order

1. **owner.ts** - Add `getOwnerBookings()` API method
2. **PropertyContext.tsx** - Create context (needed by other components)
3. **PropertySelector.tsx** - Create reusable component
4. **OwnerBookingsPage.tsx** - Fix bug + add property filter
5. **ManageLotsPage.tsx** - Fix bug + add property filter
6. **OwnerDashboardPage.tsx** - Add multi-property support
7. **OwnerCalendarPage.tsx** - Add property filter
8. **App.tsx** - Add PropertyProvider wrapper
9. **Test all changes** - Verify with Sean O'Donnell account

---

## Testing Checklist

### Phase 1 Tests
- [ ] Bookings page shows all owner's bookings (not 0)
- [ ] Bookings show correct campsite name
- [ ] Lots page shows lots from ALL properties
- [ ] Lot cards show which campsite they belong to

### Phase 2 Tests
- [ ] PropertySelector appears on all owner pages
- [ ] "All Properties" shows combined data
- [ ] Selecting specific property filters data correctly
- [ ] Selection persists across page navigation
- [ ] Works for single-property owners (no selector needed)

---

## Dependencies

- Backend `/api/owner/bookings` endpoint (exists)
- Backend `/api/owner/campsites` endpoint (exists)
- No new backend changes required

---

## Ready to Implement

I have sufficient context to complete both phases end-to-end:

✅ Backend API endpoints identified and verified
✅ Frontend file structure understood
✅ Current bugs root-caused
✅ Implementation approach designed
✅ No blocking questions

**Proceed with implementation? Yes**
