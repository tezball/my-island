import { apiRequest, ApiError } from './apiClient';
import type { Lot } from '../types/booking';
import type {
    Supplier, Offer, OfferClaim, OfferCategory,
    SupplierDashboardStats, Property, LotCounts,
    CreatePropertyParams, CreateBulkLotsParams, CreateSupplierBusinessParams,
    ActiveOfferDetail, ClaimDetail,
    ActiveOffersDetailResponse, ClaimsDetailResponse,
} from '../types/supplier';

// Re-export types for backward compatibility
export type {
    Supplier, Offer, OfferClaim, OfferCategory,
    SupplierDashboardStats, Property, PropertyType, LotCounts,
    CreatePropertyParams, CreateBulkLotsParams, CreateSupplierBusinessParams,
    ActiveOfferDetail, ClaimDetail,
    ActiveOffersDetailResponse, ClaimsDetailResponse,
} from '../types/supplier';

// --- API response types (internal) ---

interface SupplierApiResponse {
    id: number;
    businessName: string;
    category: string;
    description: string;
    county: string;
    town: string;
    address: string;
    phone: string;
    contactEmail: string | null;
    website: string;
    logoUrl: string;
    isVerified: boolean;
    latitude?: number;
    longitude?: number;
    offerCount: number;
    rating?: number | null;
    reviewCount?: number;
}

interface OfferApiResponse {
    id: number;
    supplierId: number;
    supplierName: string;
    supplierCategory: string | null;
    title: string;
    description: string;
    discountType: string;
    discountValue: number;
    minPurchase: number | null;
    termsConditions: string;
    validFrom: string;
    validUntil: string;
    maxClaims: number | null;
    currentClaims: number;
    isActive: boolean;
    isAvailable: boolean;
    imageUrl: string | null;
}

interface OfferClaimApiResponse {
    id: number;
    offerId: number;
    offerTitle: string;
    supplierName: string;
    userId: number;
    userName: string;
    bookingId: number | null;
    claimCode: string;
    status: string;
    isTest: boolean;
    claimedAt: string;
    redeemedAt: string | null;
    expiresAt: string;
    isValid: boolean;
}

interface LotApiResponse {
    id: number;
    ownerId: number;
    ownerPropertyName: string;
    name: string;
    lotType: string;
    description: string;
    pricePerNight: number;
    maxGuests: number;
    isActive: boolean;
    imageUrl: string | null;
    amenities: Array<{ id: number; name: string; icon: string }>;
}

interface DashboardApiResponse {
    activeOffers: number;
    totalOffers: number;
    pendingClaims: number;
    totalRedeemed: number;
    recentClaims: OfferClaimApiResponse[];
}

// --- Transform functions ---

// Backend SupplierCategory → Frontend OfferCategory
const CATEGORY_MAP: Record<string, OfferCategory> = {
    'FOOD': 'FOOD', 'FARM_SHOP': 'FOOD', 'RESTAURANT': 'FOOD',
    'CAFE': 'FOOD', 'PUB': 'FOOD', 'GROCERY': 'FOOD',
    'ACTIVITIES': 'ACTIVITIES', 'ACTIVITY_PROVIDER': 'ACTIVITIES', 'TOUR_OPERATOR': 'ACTIVITIES',
    'EQUIPMENT_RENTAL': 'GEAR', 'SERVICES': 'GEAR', 'ARTISAN': 'GEAR',
    'SPA': 'ATTRACTIONS', 'EXPERIENCES': 'ATTRACTIONS',
    'OTHER': 'FOOD',
};

const CATEGORY_REVERSE_MAP: Record<string, string> = {
    'FOOD': 'FOOD', 'ACTIVITIES': 'ACTIVITIES',
    'GEAR': 'SERVICES', 'ATTRACTIONS': 'EXPERIENCES', 'TRANSPORT': 'SERVICES',
};

function transformSupplier(api: SupplierApiResponse): Supplier {
    return {
        id: String(api.id),
        userId: '',
        businessName: api.businessName,
        description: api.description ?? '',
        logo: api.logoUrl ?? '',
        category: CATEGORY_MAP[api.category] || 'FOOD',
        location: `${api.town}, Co. ${api.county}`,
        contactEmail: api.contactEmail ?? '',
        contactPhone: api.phone ?? '',
        active: true,
        latitude: api.latitude,
        longitude: api.longitude,
        website: api.website ?? undefined,
        address: api.address ?? undefined,
        isVerified: api.isVerified ?? false,
        rating: api.rating ?? undefined,
        reviewCount: api.reviewCount ?? undefined,
        createdAt: '',
    };
}

function transformOffer(api: OfferApiResponse): Offer {
    return {
        id: String(api.id),
        supplierId: String(api.supplierId),
        title: api.title,
        description: api.description ?? '',
        category: CATEGORY_MAP[api.supplierCategory ?? ''] || 'FOOD',
        discountPercent: api.discountType === 'PERCENTAGE' ? api.discountValue : 10,
        validFrom: api.validFrom,
        validUntil: api.validUntil,
        maxClaims: api.maxClaims,
        claimCount: api.currentClaims,
        terms: api.termsConditions ?? '',
        active: api.isActive,
        imageUrl: api.imageUrl ?? undefined,
        createdAt: '',
    };
}

function transformClaim(api: OfferClaimApiResponse): OfferClaim {
    const statusMap: Record<string, OfferClaim['status']> = {
        'CLAIMED': 'claimed', 'REDEEMED': 'redeemed', 'EXPIRED': 'expired',
    };
    return {
        id: api.claimCode || String(api.id),
        offerId: String(api.offerId),
        userId: String(api.userId),
        userName: api.userName,
        claimedAt: api.claimedAt,
        redeemedAt: api.redeemedAt,
        status: statusMap[api.status] || 'claimed',
        isTest: api.isTest,
    };
}

const LOT_TYPE_MAP: Record<string, Lot['type']> = {
    'TENT': 'tent', 'TOURING': 'touring', 'GLAMPING': 'glamping',
    'CABIN': 'cabin', 'MOBILE_HOME': 'mobile-home',
};

function transformLot(api: LotApiResponse): Lot {
    return {
        id: String(api.id),
        ownerId: String(api.ownerId),
        name: api.name,
        type: LOT_TYPE_MAP[api.lotType] || 'tent',
        pricePerNight: api.pricePerNight,
        description: api.description || '',
        lotAmenities: api.amenities.map(a => a.name),
        campsiteAmenities: [],
        isAvailable: api.isActive,
        imageUrl: api.imageUrl || undefined,
    };
}

// --- Service ---

export const supplierService = {
    async getAllSuppliers(): Promise<Supplier[]> {
        const data = await apiRequest<SupplierApiResponse[]>('/marketplace/suppliers', { requiresAuth: false });
        return data.map(transformSupplier);
    },

    async getPublicSupplier(id: string): Promise<Supplier | null> {
        try {
            const api = await apiRequest<SupplierApiResponse>(`/marketplace/suppliers/${id}`, { requiresAuth: false });
            return transformSupplier(api);
        } catch (error) {
            if (error instanceof ApiError && error.statusCode === 404) return null;
            throw error;
        }
    },

    async getPublicSupplierOffers(id: string): Promise<Offer[]> {
        const apiOffers = await apiRequest<OfferApiResponse[]>(`/marketplace/suppliers/${id}/offers`, { requiresAuth: false });
        return apiOffers.map(transformOffer);
    },

    async getSupplierProfile(_userId: string): Promise<Supplier | null> {
        try {
            const api = await apiRequest<SupplierApiResponse>('/supplier/profile');
            return transformSupplier(api);
        } catch (error) {
            if (error instanceof ApiError && error.statusCode === 404) return null;
            throw error;
        }
    },

    async updateSupplierProfile(_id: string, updates: Partial<Supplier>): Promise<void> {
        await apiRequest<SupplierApiResponse>('/supplier/profile', {
            method: 'PUT',
            body: {
                businessName: updates.businessName,
                category: updates.category ? CATEGORY_REVERSE_MAP[updates.category] : undefined,
                description: updates.description,
                phone: updates.contactPhone,
                logoUrl: updates.logo,
                latitude: updates.latitude,
                longitude: updates.longitude,
            },
        });
    },

    async getOffers(_supplierId: string): Promise<Offer[]> {
        const apiOffers = await apiRequest<OfferApiResponse[]>('/supplier/offers');
        return apiOffers.map(transformOffer);
    },

    async getOfferById(offerId: string): Promise<Offer | null> {
        try {
            const offers = await this.getOffers('');
            return offers.find(o => o.id === offerId) ?? null;
        } catch { return null; }
    },

    async addOffer(offer: Omit<Offer, 'id' | 'claimCount' | 'createdAt'>): Promise<Offer> {
        const api = await apiRequest<OfferApiResponse>('/supplier/offers', {
            method: 'POST',
            body: {
                title: offer.title,
                description: offer.description,
                discountType: 'PERCENTAGE',
                discountValue: offer.discountPercent,
                termsConditions: offer.terms,
                validFrom: offer.validFrom,
                validUntil: offer.validUntil,
                maxClaims: offer.maxClaims,
                imageUrl: offer.imageUrl,
            },
        });
        return transformOffer(api);
    },

    async updateOffer(id: string, updates: Partial<Offer>): Promise<void> {
        await apiRequest<OfferApiResponse>(`/supplier/offers/${id}`, {
            method: 'PUT',
            body: {
                title: updates.title,
                description: updates.description,
                discountType: 'PERCENTAGE',
                discountValue: updates.discountPercent,
                termsConditions: updates.terms,
                validFrom: updates.validFrom,
                validUntil: updates.validUntil,
                maxClaims: updates.maxClaims,
                isActive: updates.active,
                imageUrl: updates.imageUrl,
            },
        });
    },

    async deleteOffer(id: string): Promise<void> {
        await apiRequest<void>(`/supplier/offers/${id}`, { method: 'DELETE' });
    },

    async getDashboardStats(_supplierId: string): Promise<SupplierDashboardStats> {
        const api = await apiRequest<DashboardApiResponse>('/supplier/dashboard');
        const now = new Date();
        const thisMonthClaims = api.recentClaims.filter(c => {
            const d = new Date(c.claimedAt);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;
        return {
            activeOffers: api.activeOffers,
            totalClaims: api.pendingClaims + api.totalRedeemed,
            thisMonthClaims,
            recentClaims: api.recentClaims.map(transformClaim),
        };
    },

    async getOfferClaims(offerId: string): Promise<OfferClaim[]> {
        const apiClaims = await apiRequest<OfferClaimApiResponse[]>(`/supplier/offers/${offerId}/claims`);
        return apiClaims.map(transformClaim);
    },

    async getUserVouchers(_userId: string): Promise<(OfferClaim & { offer: Offer; supplier: Supplier })[]> {
        const apiClaims = await apiRequest<OfferClaimApiResponse[]>('/marketplace/claims');
        if (apiClaims.length === 0) return [];

        const apiOffers = await apiRequest<OfferApiResponse[]>('/marketplace/offers');
        const offersMap = new Map(apiOffers.map(o => [o.id, o]));

        return apiClaims.map(claim => {
            const offerApi = offersMap.get(claim.offerId);
            const offer: Offer = offerApi
                ? transformOffer(offerApi)
                : {
                    id: String(claim.offerId), supplierId: '', title: claim.offerTitle,
                    description: '', category: 'FOOD', discountPercent: 0,
                    validFrom: '', validUntil: claim.expiresAt,
                    maxClaims: null, claimCount: 0, terms: '', active: true,
                    createdAt: '',
                };

            const supplier: Supplier = {
                id: offerApi ? String(offerApi.supplierId) : '',
                userId: '', businessName: claim.supplierName,
                description: '', logo: '', category: 'FOOD',
                location: '', contactEmail: '', contactPhone: '',
                active: true, createdAt: '',
            };

            return { ...transformClaim(claim), offer, supplier };
        });
    },

    async claimOffer(offerId: string, _userId: string, _userName: string): Promise<OfferClaim> {
        const api = await apiRequest<OfferClaimApiResponse>('/marketplace/offers/claim', {
            method: 'POST', body: { offerId: parseInt(offerId, 10) },
        });
        return transformClaim(api);
    },

    async getAllActiveOffers(): Promise<(Offer & { supplier: Supplier })[]> {
        const apiOffers = await apiRequest<OfferApiResponse[]>('/marketplace/offers');
        return apiOffers.map(o => ({
            ...transformOffer(o),
            supplier: {
                id: String(o.supplierId), userId: '', businessName: o.supplierName,
                description: '', logo: '',
                category: CATEGORY_MAP[o.supplierCategory ?? ''] || 'FOOD',
                location: '', contactEmail: '', contactPhone: '',
                active: true, createdAt: '',
            },
        }));
    },

    // --- Onboarding ---

    async createProperty(params: CreatePropertyParams): Promise<Property> {
        const propertyTypeMap: Record<string, string> = {
            'campsite': 'CAMPSITE', 'glamping': 'GLAMPING',
            'caravan-park': 'CARAVAN_PARK', 'mixed': 'MIXED',
        };

        const response = await apiRequest<{
            token: string;
            user: { id: number; isOwner: boolean };
        }>('/auth/upgrade/owner', {
            method: 'POST',
            body: {
                propertyName: params.propertyName,
                county: params.county, town: params.town,
                propertyType: propertyTypeMap[params.propertyType] || 'CAMPSITE',
                description: params.description,
            },
        });

        if (response.token) localStorage.setItem('token', response.token);

        return {
            id: String(response.user.id), userId: params.userId,
            propertyName: params.propertyName,
            county: params.county, town: params.town,
            description: params.description, coverImageUrl: params.coverImageUrl,
            propertyType: params.propertyType,
            createdAt: new Date().toISOString(),
        };
    },

    async createBulkLots(params: CreateBulkLotsParams): Promise<Lot[]> {
        const lotTypes: Array<{ type: keyof LotCounts; apiType: string }> = [
            { type: 'tent', apiType: 'TENT' }, { type: 'touring', apiType: 'TOURING' },
            { type: 'glamping', apiType: 'GLAMPING' }, { type: 'cabin', apiType: 'CABIN' },
            { type: 'mobile-home', apiType: 'MOBILE_HOME' },
        ];

        const createdLots: Lot[] = [];
        for (const { type, apiType } of lotTypes) {
            const count = params.lotCounts[type] || 0;
            const price = params.typePricing?.[type] ?? params.basePricePerNight;
            for (let i = 1; i <= count; i++) {
                try {
                    const response = await apiRequest<LotApiResponse>('/owner/lots', {
                        method: 'POST',
                        body: {
                            name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i}`,
                            lotType: apiType,
                            description: `${type.charAt(0).toUpperCase() + type.slice(1)} pitch ${i}`,
                            pricePerNight: price,
                            maxGuests: type === 'tent' ? 4 : type === 'glamping' ? 2 : 6,
                        },
                    });
                    createdLots.push(transformLot(response));
                } catch {
                    // Continue with other lots if one fails
                }
            }
        }
        return createdLots;
    },

    async createSupplierBusiness(params: CreateSupplierBusinessParams): Promise<Supplier> {
        const categoryMap: Record<string, string> = {
            'food': 'FARM_SHOP', 'farm_shop': 'FARM_SHOP',
            'restaurant': 'RESTAURANT', 'cafe': 'CAFE', 'pub': 'PUB',
            'activities': 'ACTIVITY_PROVIDER', 'activity_provider': 'ACTIVITY_PROVIDER',
            'tour_operator': 'TOUR_OPERATOR', 'services': 'EQUIPMENT_RENTAL',
            'equipment_rental': 'EQUIPMENT_RENTAL', 'rentals': 'EQUIPMENT_RENTAL',
            'experiences': 'TOUR_OPERATOR', 'spa': 'SPA', 'wellness': 'SPA',
            'artisan': 'ARTISAN', 'grocery': 'GROCERY', 'retail': 'ARTISAN',
            'transport': 'OTHER', 'other': 'OTHER',
        };

        const response = await apiRequest<{
            token: string;
            user: { id: number; isSupplier: boolean };
        }>('/auth/upgrade/supplier', {
            method: 'POST',
            body: {
                businessName: params.businessName,
                category: categoryMap[params.businessType.toLowerCase()] || 'OTHER',
                description: params.description,
                county: params.county, town: params.town,
                phone: params.contactPhone, website: params.website,
            },
        });

        if (response.token) localStorage.setItem('token', response.token);

        return {
            id: String(response.user.id), userId: '',
            businessName: params.businessName,
            description: params.description,
            logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(params.businessName)}&background=8b5cf6&color=fff`,
            category: 'FOOD',
            location: `${params.town}, Co. ${params.county}`,
            contactEmail: params.contactEmail, contactPhone: params.contactPhone,
            active: true, createdAt: new Date().toISOString(),
        };
    },

    // --- Analytics ---

    async getActiveOffersDetail(_supplierId: string): Promise<ActiveOffersDetailResponse> {
        const offers = await this.getOffers(_supplierId);
        const today = new Date().toISOString().split('T')[0];
        const cutoff = new Date(new Date(today).getTime() + 31 * 24 * 60 * 60 * 1000)
            .toISOString().split('T')[0];

        const activeOffers = offers.filter(o => o.active);
        const offerDetails: ActiveOfferDetail[] = activeOffers.map(o => {
            const nearLimit = o.maxClaims ? o.claimCount >= o.maxClaims * 0.8 : false;
            const expiringSoon = o.validUntil <= cutoff;
            return {
                id: o.id, title: o.title, category: o.category,
                discountPercent: o.discountPercent,
                validFrom: o.validFrom, validUntil: o.validUntil,
                claimCount: o.claimCount, maxClaims: o.maxClaims,
                status: nearLimit ? 'near_limit' : expiringSoon ? 'expiring_soon' : 'active',
            };
        });

        return {
            offers: offerDetails,
            summary: {
                total: offerDetails.length,
                expiringSoon: offerDetails.filter(o => o.status === 'expiring_soon').length,
                nearClaimLimit: offerDetails.filter(o => o.status === 'near_limit').length,
            },
        };
    },

    async getClaimsDetail(_supplierId: string, period: 'all' | 'month'): Promise<ClaimsDetailResponse> {
        const apiClaims = await apiRequest<OfferClaimApiResponse[]>('/supplier/claims');
        let claims = apiClaims.map(transformClaim);

        if (period === 'month') {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            claims = claims.filter(c => new Date(c.claimedAt) >= monthAgo);
        }

        const claimDetails: ClaimDetail[] = claims.map(c => ({
            id: c.id, userName: c.userName, offerTitle: '',
            offerId: c.offerId, claimedAt: c.claimedAt,
            redeemedAt: c.redeemedAt, status: c.status,
        }));

        return {
            claims: claimDetails,
            summary: {
                total: claimDetails.length,
                redeemed: claimDetails.filter(c => c.status === 'redeemed').length,
                pending: claimDetails.filter(c => c.status === 'claimed').length,
                expired: claimDetails.filter(c => c.status === 'expired').length,
            },
        };
    },

    async redeemClaim(claimId: string): Promise<OfferClaim> {
        const api = await apiRequest<OfferClaimApiResponse>(`/supplier/redeem/${claimId}`, { method: 'POST' });
        return transformClaim(api);
    },

    async getClaimById(claimId: string): Promise<{ claim: OfferClaim; offer: Offer; supplier: Supplier } | null> {
        try {
            const api = await apiRequest<OfferClaimApiResponse>(`/supplier/redeem/validate/${claimId}`);
            const claim = transformClaim(api);
            const offers = await this.getOffers('');
            const offer = offers.find(o => o.id === claim.offerId);
            if (!offer) return null;
            const profile = await this.getSupplierProfile('');
            if (!profile) return null;
            return { claim, offer, supplier: profile };
        } catch { return null; }
    },

    async claimOfferAsTest(offerId: string, _supplier: Supplier): Promise<OfferClaim> {
        const api = await apiRequest<OfferClaimApiResponse>(`/supplier/offers/${offerId}/test-claim`, { method: 'POST' });
        return transformClaim(api);
    },

    async resetTestClaim(claimCode: string): Promise<void> {
        await apiRequest<void>(`/supplier/claims/test/${claimCode}`, { method: 'DELETE' });
    },

    async purchaseFeatured(duration: '7_DAYS' | '30_DAYS'): Promise<{ checkoutUrl: string }> {
        return apiRequest<{ checkoutUrl: string }>('/supplier/featured/purchase', {
            method: 'POST', body: { duration },
        });
    },
};
