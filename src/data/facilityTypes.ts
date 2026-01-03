// Facility types for campsites (matches backend enum and types.ts)
import type { Facility } from './types'

// Material Symbol icon names for each facility
export const facilityIcons: Record<Facility, string> = {
  wifi: 'wifi',
  electric: 'bolt',
  water: 'water_drop',
  toilet: 'wc',
  shower: 'shower',
  laundry: 'local_laundry_service',
  shop: 'store',
  restaurant: 'restaurant',
  playground: 'toys',
  beach: 'beach_access',
  fishing: 'phishing',
  hiking: 'hiking',
  cycling: 'directions_bike',
  pets: 'pets',
}

// Colors for each facility (used in filter icons)
export const facilityColors: Record<Facility, string> = {
  wifi: '#3B82F6',      // blue
  electric: '#F59E0B',  // amber
  water: '#06B6D4',     // cyan
  toilet: '#6366F1',    // indigo
  shower: '#0EA5E9',    // sky
  laundry: '#8B5CF6',   // violet
  shop: '#10B981',      // emerald
  restaurant: '#EF4444', // red
  playground: '#F97316', // orange
  beach: '#FBBF24',     // yellow
  fishing: '#14B8A6',   // teal
  hiking: '#22C55E',    // green
  cycling: '#A855F7',   // purple
  pets: '#EC4899',      // pink
}

// Human-readable labels for each facility
export const facilityLabels: Record<Facility, string> = {
  wifi: 'WiFi',
  electric: 'Electric',
  water: 'Water',
  toilet: 'Toilets',
  shower: 'Showers',
  laundry: 'Laundry',
  shop: 'Shop',
  restaurant: 'Restaurant',
  playground: 'Playground',
  beach: 'Beach',
  fishing: 'Fishing',
  hiking: 'Hiking',
  cycling: 'Cycling',
  pets: 'Pets Allowed',
}

// All facilities for iteration (most common first)
export const allFacilities: Facility[] = [
  'wifi',
  'electric',
  'shower',
  'toilet',
  'water',
  'pets',
  'beach',
  'hiking',
  'fishing',
  'cycling',
  'restaurant',
  'shop',
  'playground',
  'laundry',
]

// Helper functions
export function getFacilityIcon(facility: Facility): string {
  return facilityIcons[facility]
}

export function getFacilityColor(facility: Facility): string {
  return facilityColors[facility]
}

export function getFacilityLabel(facility: Facility): string {
  return facilityLabels[facility]
}
