import { MOCK_DB } from './mockData';

export type OfferCategory = 'FOOD' | 'ACTIVITIES' | 'GEAR' | 'ATTRACTIONS' | 'TRANSPORT';

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
}

export interface SupplierDashboardStats {
    activeOffers: number;
    totalClaims: number;
    thisMonthClaims: number;
    recentClaims: OfferClaim[];
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const supplierService = {
    async getSupplierProfile(userId: string): Promise<Supplier | null> {
        await delay(500);
        const supplier = MOCK_DB.suppliers?.find(s => s.userId === userId);
        return supplier || null;
    },

    async updateSupplierProfile(id: string, updates: Partial<Supplier>): Promise<void> {
        await delay(600);
        const index = MOCK_DB.suppliers?.findIndex(s => s.id === id);
        if (index !== undefined && index !== -1 && MOCK_DB.suppliers) {
            MOCK_DB.suppliers[index] = { ...MOCK_DB.suppliers[index], ...updates };
        }
    },

    async getOffers(supplierId: string): Promise<Offer[]> {
        await delay(500);
        return MOCK_DB.offers?.filter(o => o.supplierId === supplierId) || [];
    },

    async addOffer(offer: Omit<Offer, 'id' | 'claimCount' | 'createdAt'>): Promise<Offer> {
        await delay(800);
        const newOffer: Offer = {
            ...offer,
            id: Math.random().toString(36).substr(2, 9),
            claimCount: 0,
            createdAt: new Date().toISOString()
        };
        MOCK_DB.offers?.push(newOffer);
        return newOffer;
    },

    async updateOffer(id: string, updates: Partial<Offer>): Promise<void> {
        await delay(600);
        const index = MOCK_DB.offers?.findIndex(o => o.id === id);
        if (index !== undefined && index !== -1 && MOCK_DB.offers) {
            MOCK_DB.offers[index] = { ...MOCK_DB.offers[index], ...updates };
        }
    },

    async deleteOffer(id: string): Promise<void> {
        await delay(400);
        const index = MOCK_DB.offers?.findIndex(o => o.id === id);
        if (index !== undefined && index !== -1 && MOCK_DB.offers) {
            MOCK_DB.offers.splice(index, 1);
        }
    },

    async getDashboardStats(supplierId: string): Promise<SupplierDashboardStats> {
        await delay(500);
        const offers = MOCK_DB.offers?.filter(o => o.supplierId === supplierId) || [];
        const offerIds = offers.map(o => o.id);
        const claims = MOCK_DB.offerClaims?.filter(c => offerIds.includes(c.offerId)) || [];

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthClaims = claims.filter(c => new Date(c.claimedAt) >= startOfMonth);

        return {
            activeOffers: offers.filter(o => o.active).length,
            totalClaims: claims.length,
            thisMonthClaims: thisMonthClaims.length,
            recentClaims: claims.slice(0, 5)
        };
    },

    async getOfferClaims(offerId: string): Promise<OfferClaim[]> {
        await delay(400);
        return MOCK_DB.offerClaims?.filter(c => c.offerId === offerId) || [];
    },

    // Guest voucher functions
    async getUserVouchers(userId: string): Promise<(OfferClaim & { offer: Offer; supplier: Supplier })[]> {
        await delay(500);
        const claims = MOCK_DB.offerClaims?.filter(c => c.userId === userId) || [];

        return claims.map(claim => {
            const offer = MOCK_DB.offers?.find(o => o.id === claim.offerId);
            const supplier = MOCK_DB.suppliers?.find(s => s.id === offer?.supplierId);
            return {
                ...claim,
                offer: offer!,
                supplier: supplier!
            };
        }).filter(v => v.offer && v.supplier);
    },

    async claimOffer(offerId: string, userId: string, userName: string): Promise<OfferClaim> {
        await delay(600);
        const newClaim: OfferClaim = {
            id: `claim-${Date.now()}`,
            offerId,
            userId,
            userName,
            claimedAt: new Date().toISOString(),
            redeemedAt: null,
            status: 'claimed'
        };
        MOCK_DB.offerClaims?.push(newClaim);

        // Increment claim count on offer
        const offerIndex = MOCK_DB.offers?.findIndex(o => o.id === offerId);
        if (offerIndex !== undefined && offerIndex !== -1 && MOCK_DB.offers) {
            MOCK_DB.offers[offerIndex].claimCount++;
        }

        return newClaim;
    },

    async getAllActiveOffers(): Promise<(Offer & { supplier: Supplier })[]> {
        await delay(500);
        const now = new Date();
        const activeOffers = MOCK_DB.offers?.filter(o =>
            o.active &&
            new Date(o.validFrom) <= now &&
            new Date(o.validUntil) >= now &&
            (o.maxClaims === null || o.claimCount < o.maxClaims)
        ) || [];

        return activeOffers.map(offer => {
            const supplier = MOCK_DB.suppliers?.find(s => s.id === offer.supplierId);
            return {
                ...offer,
                supplier: supplier!
            };
        }).filter(o => o.supplier);
    }
};
