# Discovery

## Status
Implemented

## Overview
Points of interest (POI) system for showcasing local attractions, beaches, museums, activities, and experiences near campsites. Guests can browse POIs on the map and track visits as part of their travel journal.

## Key Entities

- **PointOfInterest** — A local attraction with name, description, category, location (lat/lng), and images.
- **UserPoiVisit** — Tracks a guest's visit to a POI. Used for the travel journal/experience feature.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/discovery/pois` | Browse points of interest |
| GET | `/api/discovery/pois/{id}` | Get POI details |
| POST | `/api/discovery/visits` | Log a POI visit |
| GET | `/api/discovery/visits` | Get user's visit history |
| PUT | `/api/discovery/visits/{id}` | Update visit notes |

## Frontend Pages

- **ExplorePage** — POIs displayed as markers on the map alongside campsites and suppliers
- **JournalPage** — Travel journal showing visited POIs

## Implementation Notes
- POIs are displayed in the `ExplorePoiPopup` component on the map.
- Location-based filtering uses lat/lng coordinates.
- Seed data includes beaches, museums, and activity locations across Ireland (V1032-V1036).
