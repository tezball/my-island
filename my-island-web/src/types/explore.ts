import type { CampsiteProfile } from './campsite';
import type { Supplier, OfferCategory } from './supplier';

export interface MapMarker {
    id: string;
    type: 'campsite' | 'supplier';
    name: string;
    latitude: number;
    longitude: number;
    county: string;
    town: string;
    // Campsite-specific
    propertyType?: string;
    lotCount?: number;
    rating?: number | null;
    reviewCount?: number;
    amenities?: string[];
    // Supplier-specific
    category?: OfferCategory;
    businessName?: string;
    location?: string;
    offerCount?: number;
    logo?: string;
}

export interface ExploreFilters {
    showCampsites: boolean;
    showSuppliers: boolean;
    propertyType: string;
    supplierCategory: string;
    county: string;
    searchText: string;
}

export function campsiteToMarker(c: CampsiteProfile): MapMarker | null {
    if (c.latitude == null || c.longitude == null) return null;
    return {
        id: c.id,
        type: 'campsite',
        name: c.propertyName || c.name || 'Campsite',
        latitude: c.latitude,
        longitude: c.longitude,
        county: c.county || '',
        town: c.town || '',
        propertyType: c.propertyType,
        lotCount: c.lotCount,
        rating: c.rating,
        reviewCount: c.reviewCount,
        amenities: c.amenities,
    };
}

export function supplierToMarker(s: Supplier): MapMarker | null {
    if (s.latitude == null || s.longitude == null) return null;
    return {
        id: s.id,
        type: 'supplier',
        name: s.businessName,
        latitude: s.latitude,
        longitude: s.longitude,
        county: s.location?.split('Co. ')[1] || '',
        town: s.location?.split(',')[0] || '',
        category: s.category,
        businessName: s.businessName,
        location: s.location,
        logo: s.logo,
        rating: s.rating,
        reviewCount: s.reviewCount,
    };
}
