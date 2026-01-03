// Supplier categories for local businesses (matches backend enum)
export type SupplierCategory =
  | 'RESTAURANT'
  | 'PUB'
  | 'FARM_SHOP'
  | 'GROCERY'
  | 'OUTDOOR_GEAR'
  | 'KAYAK_RENTAL'
  | 'BIKE_RENTAL'
  | 'FISHING'
  | 'CONVENIENCE'

export interface Supplier {
  id: string
  name: string
  category: SupplierCategory
  description: string
  location: {
    address: string
    county: string
    lat: number
    lng: number
  }
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  hours?: {
    weekday: string
    weekend: string
  }
  images: string[]
  rating: number
  reviewCount: number
  featured?: boolean
}

// Material Symbol icon names for each category
export const supplierCategoryIcons: Record<SupplierCategory, string> = {
  RESTAURANT: 'restaurant',
  PUB: 'sports_bar',
  FARM_SHOP: 'storefront',
  GROCERY: 'shopping_cart',
  OUTDOOR_GEAR: 'backpack',
  KAYAK_RENTAL: 'kayaking',
  BIKE_RENTAL: 'directions_bike',
  FISHING: 'phishing',
  CONVENIENCE: 'convenience_store',
}

// Colors for each category (used in map markers)
export const supplierCategoryColors: Record<SupplierCategory, string> = {
  RESTAURANT: '#FF6B6B',   // coral
  PUB: '#8B4513',          // brown
  FARM_SHOP: '#228B22',    // forest green
  GROCERY: '#4169E1',      // royal blue
  OUTDOOR_GEAR: '#FF8C00', // dark orange
  KAYAK_RENTAL: '#00CED1', // dark cyan
  BIKE_RENTAL: '#9370DB',  // medium purple
  FISHING: '#2E8B57',      // sea green
  CONVENIENCE: '#708090',  // slate gray
}

// Human-readable labels for each category
export const supplierCategoryLabels: Record<SupplierCategory, string> = {
  RESTAURANT: 'Restaurant',
  PUB: 'Pub',
  FARM_SHOP: 'Farm Shop',
  GROCERY: 'Grocery Store',
  OUTDOOR_GEAR: 'Outdoor Gear',
  KAYAK_RENTAL: 'Kayak Rental',
  BIKE_RENTAL: 'Bike Rental',
  FISHING: 'Fishing Supplies',
  CONVENIENCE: 'Convenience Store',
}

// Helper function to get icon for a category
export function getSupplierIcon(category: SupplierCategory): string {
  return supplierCategoryIcons[category]
}

// Helper function to get color for a category
export function getSupplierColor(category: SupplierCategory): string {
  return supplierCategoryColors[category]
}

// Helper function to get label for a category
export function getSupplierLabel(category: SupplierCategory): string {
  return supplierCategoryLabels[category]
}

// All categories for iteration
export const allSupplierCategories: SupplierCategory[] = [
  'RESTAURANT',
  'PUB',
  'FARM_SHOP',
  'GROCERY',
  'OUTDOOR_GEAR',
  'KAYAK_RENTAL',
  'BIKE_RENTAL',
  'FISHING',
  'CONVENIENCE',
]
