import { MOCK_DB } from './mockData';
import type { Lot } from './adminService';
import mockOwnersData from '../data/mockOwners.json';

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
    glamping: number;
    rv: number;
    cabin: number;
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

        // Check if this supplier has pre-defined stats in mockOwners.json
        const mockSupplier = mockOwnersData.suppliers.find(s => s.id === supplierId);
        if (mockSupplier?.stats) {
            return {
                activeOffers: mockSupplier.stats.activeOffers,
                totalClaims: mockSupplier.stats.totalClaims,
                thisMonthClaims: mockSupplier.stats.thisMonthClaims,
                recentClaims: claims.slice(0, 5) // Still use actual claims for recent list
            };
        }

        // Calculate from MOCK_DB for newly created suppliers
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
    },

    async createProperty(params: CreatePropertyParams): Promise<Property> {
        await delay(800);
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

        // In a real app, this would be persisted to a database
        // For now, we create a supplier entry as well
        const newSupplier: Supplier = {
            id: `supplier-${newProperty.id}`,
            userId: params.userId,
            businessName: params.propertyName,
            description: params.description,
            logo: params.coverImageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(params.propertyName) + '&background=10b981&color=fff',
            category: 'FOOD', // Default category
            location: `${params.town}, Co. ${params.county}`,
            contactEmail: '',
            contactPhone: '',
            active: true,
            createdAt: newProperty.createdAt,
        };

        MOCK_DB.suppliers?.push(newSupplier);
        return newProperty;
    },

    async createBulkLots(params: CreateBulkLotsParams): Promise<Lot[]> {
        await delay(1000);
        const createdLots: Lot[] = [];

        const LOT_TYPE_IMAGES: Record<string, string[]> = {
            tent: [
                'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&q=80&w=800',
            ],
            glamping: [
                'https://images.unsplash.com/photo-1618767689160-da3fb810aad7?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800',
            ],
            rv: [
                'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800',
            ],
            cabin: [
                'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=800',
            ],
        };

        const LOT_TYPE_NAMES: Record<string, string> = {
            tent: 'Tent Pitch',
            glamping: 'Glamping Unit',
            rv: 'Caravan Spot',
            cabin: 'Cabin',
        };

        const AMENITY_LABELS: Record<string, string> = {
            wifi: 'WiFi',
            showers: 'Free Showers',
            toilets: 'Toilets',
            kitchen: 'Shared Kitchen',
            laundry: 'Laundry',
            store: 'Camp Store',
            playground: 'Playground',
            fishing: 'Fishing',
            hiking: 'Hiking Trails',
            pets: 'Pet Friendly',
            bbq: 'BBQ Area',
            'fire-pit': 'Fire Pit',
            electric: 'Electric Hookup',
            water: 'Water Hookup',
            'picnic-table': 'Picnic Table',
            shade: 'Shaded Pitch',
        };

        const mapAmenities = (ids: string[]): string[] => {
            return ids.map(id => AMENITY_LABELS[id] || id);
        };

        (Object.keys(params.lotCounts) as Array<keyof LotCounts>).forEach(type => {
            const count = params.lotCounts[type];
            if (count === 0) return;

            const images = LOT_TYPE_IMAGES[type] || LOT_TYPE_IMAGES.tent;
            const typeName = LOT_TYPE_NAMES[type];
            const price = params.typePricing?.[type] ?? params.basePricePerNight;

            for (let i = 1; i <= count; i++) {
                const newLot: Lot = {
                    id: `${params.userId}-${type}-${i}`,
                    ownerId: params.userId,
                    name: `${typeName} ${i}`,
                    type: type === 'glamping' ? 'cabin' : type as Lot['type'], // Map glamping to cabin type
                    pricePerNight: price,
                    description: `${typeName} ${i} with all standard amenities.`,
                    lotAmenities: mapAmenities(params.lotAmenities),
                    campsiteAmenities: mapAmenities(params.campsiteAmenities),
                    isAvailable: true,
                    imageUrl: images[(i - 1) % images.length],
                };

                MOCK_DB.lots.push(newLot);
                createdLots.push(newLot);
            }
        });

        return createdLots;
    },

    async createSupplierBusiness(params: CreateSupplierBusinessParams): Promise<Supplier> {
        await delay(800);

        const CATEGORY_MAP: Record<string, OfferCategory> = {
            'food': 'FOOD',
            'activities': 'ACTIVITIES',
            'rentals': 'GEAR',
            'wellness': 'ACTIVITIES',
            'transport': 'TRANSPORT',
            'retail': 'FOOD',
        };

        const newSupplier: Supplier = {
            id: `supplier-${Math.random().toString(36).substr(2, 9)}`,
            userId: params.userId,
            businessName: params.businessName,
            description: params.description,
            logo: params.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(params.businessName)}&background=8b5cf6&color=fff`,
            category: CATEGORY_MAP[params.businessType] || 'FOOD',
            location: `${params.town}, Co. ${params.county}`,
            contactEmail: params.contactEmail,
            contactPhone: params.contactPhone,
            active: true,
            createdAt: new Date().toISOString(),
        };

        MOCK_DB.suppliers?.push(newSupplier);
        return newSupplier;
    }
};
