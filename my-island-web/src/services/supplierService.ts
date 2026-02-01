import type { Lot } from '../types/booking';

// API configuration
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// Logging utility with structured output
const log = {
    info: (message: string, data?: Record<string, unknown>) => {
        console.log(`[SupplierService] ${message}`, data ? JSON.stringify(data) : '');
    },
    error: (message: string, error?: unknown, data?: Record<string, unknown>) => {
        console.error(`[SupplierService] ERROR: ${message}`, {
            error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
            ...data,
        });
    },
    debug: (message: string, data?: Record<string, unknown>) => {
        if (import.meta.env.DEV) {
            console.debug(`[SupplierService] DEBUG: ${message}`, data ? JSON.stringify(data) : '');
        }
    },
};

// Metrics tracking
interface ApiMetrics {
    endpoint: string;
    method: string;
    durationMs: number;
    status: 'success' | 'error';
    statusCode?: number;
    errorType?: string;
    timestamp: string;
}

const metrics = {
    history: [] as ApiMetrics[],
    maxHistory: 100,

    record(metric: Omit<ApiMetrics, 'timestamp'>) {
        const entry: ApiMetrics = { ...metric, timestamp: new Date().toISOString() };
        this.history.push(entry);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        log.debug('API metric recorded', entry as unknown as Record<string, unknown>);
    },

    getStats() {
        const total = this.history.length;
        const errors = this.history.filter(m => m.status === 'error').length;
        const avgDuration = total > 0
            ? this.history.reduce((sum, m) => sum + m.durationMs, 0) / total
            : 0;
        return { total, errors, errorRate: total > 0 ? errors / total : 0, avgDurationMs: avgDuration };
    },
};

// Custom error classes
export class SupplierServiceError extends Error {
    readonly code: string;
    readonly statusCode?: number;
    readonly details?: Record<string, unknown>;

    constructor(
        message: string,
        code: string,
        statusCode?: number,
        details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'SupplierServiceError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
    }
}

export class NetworkError extends SupplierServiceError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'NETWORK_ERROR', undefined, details);
        this.name = 'NetworkError';
    }
}

export class AuthenticationError extends SupplierServiceError {
    constructor(message: string = 'Authentication required') {
        super(message, 'AUTH_ERROR', 401);
        this.name = 'AuthenticationError';
    }
}

export class ApiError extends SupplierServiceError {
    constructor(message: string, statusCode: number, details?: Record<string, unknown>) {
        super(message, 'API_ERROR', statusCode, details);
        this.name = 'ApiError';
    }
}

// Types - keeping frontend-compatible types
export type OfferCategory = 'FOOD' | 'ACTIVITIES' | 'GEAR' | 'ATTRACTIONS' | 'TRANSPORT';
export type PropertyType = 'campsite' | 'glamping' | 'caravan-park' | 'mixed';

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

// API Response Types
interface SupplierApiResponse {
    id: number;
    businessName: string;
    category: string;
    description: string;
    county: string;
    town: string;
    address: string;
    phone: string;
    website: string;
    logoUrl: string;
    isVerified: boolean;
    offerCount: number;
}

interface OfferApiResponse {
    id: number;
    supplierId: number;
    supplierName: string;
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

interface DashboardApiResponse {
    activeOffers: number;
    totalOffers: number;
    pendingClaims: number;
    totalRedeemed: number;
    recentClaims: OfferClaimApiResponse[];
}

// Helper function for API calls
async function apiRequest<T>(
    endpoint: string,
    options: {
        method?: string;
        body?: unknown;
    } = {}
): Promise<T> {
    const { method = 'GET', body } = options;
    const startTime = performance.now();

    log.info(`${method} ${endpoint}`, body ? { hasBody: true } : undefined);

    const token = localStorage.getItem('token');
    if (!token) {
        log.error('No auth token found', undefined, { endpoint });
        metrics.record({
            endpoint,
            method,
            durationMs: performance.now() - startTime,
            status: 'error',
            errorType: 'AUTH_ERROR',
        });
        throw new AuthenticationError('No authentication token found. Please sign in.');
    }

    let response: Response;
    try {
        log.debug('Making API request', { url: `${API_BASE}${endpoint}` });
        response = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers: getAuthHeaders(),
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch (error) {
        const durationMs = performance.now() - startTime;
        log.error('Network error during fetch', error, { endpoint, durationMs });
        metrics.record({
            endpoint,
            method,
            durationMs,
            status: 'error',
            errorType: 'NETWORK_ERROR',
        });
        throw new NetworkError(
            'Unable to connect to the server. Please check your internet connection.',
            { originalError: error instanceof Error ? error.message : String(error) }
        );
    }

    const durationMs = performance.now() - startTime;

    if (!response.ok) {
        let errorBody: string | undefined;
        try {
            errorBody = await response.text();
        } catch {
            // Ignore error reading body
        }

        log.error('API returned error response', undefined, {
            endpoint,
            statusCode: response.status,
            statusText: response.statusText,
            durationMs,
            errorBody,
        });

        metrics.record({
            endpoint,
            method,
            durationMs,
            status: 'error',
            statusCode: response.status,
            errorType: 'API_ERROR',
        });

        if (response.status === 401) {
            throw new AuthenticationError('Session expired. Please sign in again.');
        }
        if (response.status === 403) {
            throw new ApiError('You do not have permission to access this resource.', 403);
        }
        if (response.status === 404) {
            throw new ApiError('Resource not found.', 404, { errorBody });
        }
        if (response.status >= 500) {
            throw new ApiError('Server error. Please try again later.', response.status, { errorBody });
        }

        throw new ApiError(
            `Request failed: ${response.statusText}`,
            response.status,
            { errorBody }
        );
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
        metrics.record({
            endpoint,
            method,
            durationMs,
            status: 'success',
            statusCode: response.status,
        });
        return undefined as T;
    }

    let data: T;
    try {
        data = await response.json();
        log.debug('API response received', { endpoint });
    } catch (error) {
        log.error('Failed to parse API response', error, { endpoint, durationMs });
        metrics.record({
            endpoint,
            method,
            durationMs,
            status: 'error',
            errorType: 'PARSE_ERROR',
        });
        throw new ApiError('Invalid response from server. Please try again.', response.status, {
            parseError: error instanceof Error ? error.message : String(error),
        });
    }

    metrics.record({
        endpoint,
        method,
        durationMs,
        status: 'success',
        statusCode: response.status,
    });

    log.info(`${method} ${endpoint} completed`, { durationMs: Math.round(durationMs) });

    return data;
}

// Map API category to frontend category
function mapCategory(apiCategory: string): OfferCategory {
    const categoryMap: Record<string, OfferCategory> = {
        'FOOD': 'FOOD',
        'ACTIVITIES': 'ACTIVITIES',
        'SERVICES': 'GEAR',
        'EXPERIENCES': 'ATTRACTIONS',
    };
    return categoryMap[apiCategory] || 'FOOD';
}

// Transform functions
function transformSupplier(api: SupplierApiResponse): Supplier {
    return {
        id: String(api.id),
        userId: '',
        businessName: api.businessName,
        description: api.description ?? '',
        logo: api.logoUrl ?? '',
        category: mapCategory(api.category),
        location: `${api.town}, Co. ${api.county}`,
        contactEmail: '',
        contactPhone: api.phone ?? '',
        active: true,
        createdAt: '',
    };
}

function transformOffer(api: OfferApiResponse): Offer {
    // Map discountType + discountValue to discountPercent
    // If PERCENTAGE, use discountValue as percent; if FIXED_AMOUNT, estimate as 10%
    const discountPercent = api.discountType === 'PERCENTAGE'
        ? api.discountValue
        : 10; // Default estimate for fixed amounts

    return {
        id: String(api.id),
        supplierId: String(api.supplierId),
        title: api.title,
        description: api.description ?? '',
        category: 'FOOD', // Default - API doesn't have category on offer
        discountPercent,
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
    // Map status to lowercase
    const statusMap: Record<string, 'claimed' | 'redeemed' | 'expired'> = {
        'CLAIMED': 'claimed',
        'REDEEMED': 'redeemed',
        'EXPIRED': 'expired',
    };

    return {
        id: api.claimCode || String(api.id), // Use claimCode as ID if available
        offerId: String(api.offerId),
        userId: String(api.userId),
        userName: api.userName,
        claimedAt: api.claimedAt,
        redeemedAt: api.redeemedAt,
        status: statusMap[api.status] || 'claimed',
        isTest: api.isTest,
    };
}

export const supplierService = {
    async getSupplierProfile(_userId: string): Promise<Supplier | null> {
        try {
            const api = await apiRequest<SupplierApiResponse>('/supplier/profile');
            return transformSupplier(api);
        } catch (error) {
            if (error instanceof ApiError && error.statusCode === 404) {
                return null;
            }
            throw error;
        }
    },

    async updateSupplierProfile(_id: string, updates: Partial<Supplier>): Promise<void> {
        // Map frontend category back to API category
        const categoryMap: Record<string, string> = {
            'FOOD': 'FOOD',
            'ACTIVITIES': 'ACTIVITIES',
            'GEAR': 'SERVICES',
            'ATTRACTIONS': 'EXPERIENCES',
            'TRANSPORT': 'SERVICES',
        };

        await apiRequest<SupplierApiResponse>('/supplier/profile', {
            method: 'PUT',
            body: {
                businessName: updates.businessName,
                category: updates.category ? categoryMap[updates.category] : undefined,
                description: updates.description,
                phone: updates.contactPhone,
                logoUrl: updates.logo,
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
        } catch {
            return null;
        }
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
        await apiRequest<void>(`/supplier/offers/${id}`, {
            method: 'DELETE',
        });
    },

    async getDashboardStats(_supplierId: string): Promise<SupplierDashboardStats> {
        const api = await apiRequest<DashboardApiResponse>('/supplier/dashboard');
        return {
            activeOffers: api.activeOffers,
            totalClaims: api.pendingClaims + api.totalRedeemed,
            thisMonthClaims: api.pendingClaims, // Approximate with pending
            recentClaims: api.recentClaims.map(transformClaim),
        };
    },

    async getOfferClaims(offerId: string): Promise<OfferClaim[]> {
        const apiClaims = await apiRequest<OfferClaimApiResponse[]>(`/supplier/offers/${offerId}/claims`);
        return apiClaims.map(transformClaim);
    },

    // Guest voucher functions
    async getUserVouchers(userId: string): Promise<(OfferClaim & { offer: Offer; supplier: Supplier })[]> {
        // TODO: Connect to GET /api/user/vouchers when available
        log.debug('getUserVouchers called', { userId });
        return [];
    },

    async claimOffer(offerId: string, _userId: string, _userName: string): Promise<OfferClaim> {
        const api = await apiRequest<OfferClaimApiResponse>(`/marketplace/offers/${offerId}/claim`, {
            method: 'POST',
        });
        return transformClaim(api);
    },

    async getAllActiveOffers(): Promise<(Offer & { supplier: Supplier })[]> {
        const apiOffers = await apiRequest<OfferApiResponse[]>('/marketplace/offers');
        return apiOffers.map(o => ({
            ...transformOffer(o),
            supplier: {
                id: String(o.supplierId),
                userId: '',
                businessName: o.supplierName,
                description: '',
                logo: '',
                category: 'FOOD' as OfferCategory,
                location: '',
                contactEmail: '',
                contactPhone: '',
                active: true,
                createdAt: '',
            },
        }));
    },

    // Property functions (for onboarding)
    async createProperty(params: CreatePropertyParams): Promise<Property> {
        // TODO: Connect to real API when available
        log.info('createProperty called', { params: params.propertyName });
        const newProperty: Property = {
            id: `property-${Math.random().toString(36).substr(2, 9)}`,
            userId: params.userId,
            propertyName: params.propertyName,
            county: params.county,
            town: params.town,
            description: params.description,
            coverImageUrl: params.coverImageUrl,
            propertyType: params.propertyType,
            createdAt: new Date().toISOString(),
        };
        return newProperty;
    },

    async createBulkLots(params: CreateBulkLotsParams): Promise<Lot[]> {
        // TODO: Connect to real API when available
        log.info('createBulkLots called', { userId: params.userId });
        return [];
    },

    async createSupplierBusiness(params: CreateSupplierBusinessParams): Promise<Supplier> {
        // TODO: Connect to real API when available
        log.info('createSupplierBusiness called', { businessName: params.businessName });
        const newSupplier: Supplier = {
            id: `supplier-${Math.random().toString(36).substr(2, 9)}`,
            userId: params.userId,
            businessName: params.businessName,
            description: params.description,
            logo: params.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(params.businessName)}&background=8b5cf6&color=fff`,
            category: 'FOOD',
            location: `${params.town}, Co. ${params.county}`,
            contactEmail: params.contactEmail,
            contactPhone: params.contactPhone,
            active: true,
            createdAt: new Date().toISOString(),
        };
        return newSupplier;
    },

    async getActiveOffersDetail(_supplierId: string): Promise<ActiveOffersDetailResponse> {
        // Compute from offers
        const offers = await this.getOffers(_supplierId);
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const activeOffers = offers.filter(o => o.active);
        const offerDetails: ActiveOfferDetail[] = activeOffers.map(o => {
            const validUntil = new Date(o.validUntil);
            const nearLimit = o.maxClaims ? o.claimCount >= o.maxClaims * 0.8 : false;
            const expiringSoon = validUntil <= weekFromNow;

            return {
                id: o.id,
                title: o.title,
                category: o.category,
                discountPercent: o.discountPercent,
                validFrom: o.validFrom,
                validUntil: o.validUntil,
                claimCount: o.claimCount,
                maxClaims: o.maxClaims,
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
        // Get all claims from API
        const apiClaims = await apiRequest<OfferClaimApiResponse[]>('/supplier/claims');
        let claims = apiClaims.map(transformClaim);

        if (period === 'month') {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            claims = claims.filter(c => new Date(c.claimedAt) >= monthAgo);
        }

        const claimDetails: ClaimDetail[] = claims.map(c => ({
            id: c.id,
            userName: c.userName,
            offerTitle: '', // Would need to join with offers
            offerId: c.offerId,
            claimedAt: c.claimedAt,
            redeemedAt: c.redeemedAt,
            status: c.status,
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
        const api = await apiRequest<OfferClaimApiResponse>(`/supplier/redeem/${claimId}`, {
            method: 'POST',
        });
        return transformClaim(api);
    },

    async getClaimById(claimId: string): Promise<{
        claim: OfferClaim;
        offer: Offer;
        supplier: Supplier;
    } | null> {
        try {
            const api = await apiRequest<OfferClaimApiResponse>(`/supplier/redeem/validate/${claimId}`);
            const claim = transformClaim(api);

            const offers = await this.getOffers('');
            const offer = offers.find(o => o.id === claim.offerId);
            if (!offer) return null;

            const profile = await this.getSupplierProfile('');
            if (!profile) return null;

            return {
                claim,
                offer,
                supplier: profile,
            };
        } catch {
            return null;
        }
    },

    async claimOfferAsTest(offerId: string, _supplier: Supplier): Promise<OfferClaim> {
        const api = await apiRequest<OfferClaimApiResponse>(`/supplier/offers/${offerId}/test-claim`, {
            method: 'POST',
        });
        return transformClaim(api);
    },

    async resetTestClaim(_claimId: string): Promise<void> {
        // Test claims reset - not implemented in backend yet
        log.info('resetTestClaim called - not implemented');
    },

    // Expose metrics for debugging/monitoring
    getMetrics() {
        return metrics.getStats();
    },

    getMetricsHistory() {
        return [...metrics.history];
    },
};
