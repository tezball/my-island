export type OfferCategory = 'FOOD' | 'ACTIVITIES' | 'GEAR' | 'ATTRACTIONS' | 'TRANSPORT';
export type PropertyType = 'campsite' | 'glamping' | 'caravan-park' | 'mixed';

export interface Supplier {
    id: string;
    userId: string;
    businessName: string;
    description: string;
    logo: string;
    category: OfferCategory;
    location: string;
    contactEmail: string;
    contactPhone: string;
    active: boolean;
    latitude?: number;
    longitude?: number;
    createdAt: string;
}

export interface Offer {
    id: string;
    supplierId: string;
    title: string;
    description: string;
    category: OfferCategory;
    discountPercent: number;
    validFrom: string;
    validUntil: string;
    maxClaims: number | null;
    claimCount: number;
    terms: string;
    active: boolean;
    imageUrl?: string;
    createdAt: string;
}

export interface OfferClaim {
    id: string;
    offerId: string;
    userId: string;
    userName: string;
    claimedAt: string;
    redeemedAt: string | null;
    status: 'claimed' | 'redeemed' | 'expired';
    isTest?: boolean;
}

export interface SupplierDashboardStats {
    activeOffers: number;
    totalClaims: number;
    thisMonthClaims: number;
    recentClaims: OfferClaim[];
}

export interface Property {
    id: string;
    userId: string;
    propertyName: string;
    county: string;
    town: string;
    description: string;
    coverImageUrl: string;
    propertyType: PropertyType;
    createdAt: string;
}

export interface CreatePropertyParams {
    userId: string;
    propertyName: string;
    county: string;
    town: string;
    description: string;
    coverImageUrl: string;
    propertyType: PropertyType;
}

export interface LotCounts {
    tent: number;
    touring: number;
    glamping: number;
    cabin: number;
    'mobile-home': number;
}

export interface CreateBulkLotsParams {
    userId: string;
    lotCounts: LotCounts;
    campsiteAmenities: string[];
    lotAmenities: string[];
    basePricePerNight: number;
    typePricing?: Record<string, number>;
}

export interface CreateSupplierBusinessParams {
    userId: string;
    businessName: string;
    businessType: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
    logoUrl: string;
    county: string;
    town: string;
    servicesOffered: string[];
}

export interface ActiveOfferDetail {
    id: string;
    title: string;
    category: OfferCategory;
    discountPercent: number;
    validFrom: string;
    validUntil: string;
    claimCount: number;
    maxClaims: number | null;
    status: 'active' | 'expiring_soon' | 'near_limit';
}

export interface ClaimDetail {
    id: string;
    userName: string;
    offerTitle: string;
    offerId: string;
    claimedAt: string;
    redeemedAt: string | null;
    status: 'claimed' | 'redeemed' | 'expired';
}

export interface ActiveOffersDetailResponse {
    offers: ActiveOfferDetail[];
    summary: {
        total: number;
        expiringSoon: number;
        nearClaimLimit: number;
    };
}

export interface ClaimsDetailResponse {
    claims: ClaimDetail[];
    summary: {
        total: number;
        redeemed: number;
        pending: number;
        expired: number;
    };
}
