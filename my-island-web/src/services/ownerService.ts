import { apiRequest, API_BASE, NotFoundError } from './apiClient';
import type { Lot, Booking, BlockedPeriod, CreateBlockedPeriodRequest, SeasonalPricingRule, CreateSeasonalPricingRuleRequest, ModificationRequest } from '../types/booking';
import type {
    Owner, OwnerStats, OwnerDashboardData,
    CreateLotRequest, UpdateLotRequest,
    ImportLotsResult,
    LotsDetailResponse, BookingsDetailResponse,
    RevenueDetailResponse, OccupancyDetailResponse,
} from '../types/owner';

// Re-export types for backward compatibility with existing imports
export type {
    Owner, OwnerStats, OwnerDashboardData,
    CreateLotRequest, UpdateLotRequest,
    ImportLotsResult,
    LotsDetailResponse, BookingsDetailResponse,
    RevenueDetailResponse, OccupancyDetailResponse,
} from '../types/owner';
export type {
    LotDetail, BookingDetail,
} from '../types/owner';

// --- API response types (internal) ---

interface DashboardApiResponse {
    totalLots: number;
    activeLots: number;
    upcomingBookings: number;
    monthlyRevenue: number;
    recentBookings: Array<{
        id: number;
        lotName: string;
        guestName: string;
        checkIn: string;
        checkOut: string;
        status: string;
    }>;
}

interface OwnerProfileApiResponse {
    id: number;
    propertyName: string;
    county: string;
    town: string;
    propertyType: string;
    description: string;
    latitude: number | null;
    longitude: number | null;
    phone: string | null;
    website: string | null;
    amenities: Array<{ id: number; name: string; icon: string }>;
    lotCount: number;
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
    minStay: number;
    isActive: boolean;
    imageUrl: string | null;
    amenities: Array<{ id: number; name: string; icon: string }>;
    images?: Array<{ id: number; url: string; altText: string | null; displayOrder: number; isPrimary: boolean }>;
}

interface BookingApiResponse {
    id: number;
    userId: number | null;
    userName: string;
    lotId: number;
    lotName: string;
    campsiteName: string;
    checkInDate: string;
    checkOutDate: string;
    numGuests: number;
    totalPrice: number;
    status: string;
    specialRequests: string | null;
    createdAt: string;
    guestName: string | null;
    guestEmail: string | null;
    guestPhone: string | null;
    bookingSource: string | null;
}

// --- Transform functions ---

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
        minStay: api.minStay ?? 1,
        description: api.description || '',
        lotAmenities: api.amenities.map(a => a.name),
        campsiteAmenities: [],
        isAvailable: api.isActive,
        imageUrl: api.imageUrl || undefined,
        images: api.images?.map(img => ({
            id: img.id, url: img.url, altText: img.altText,
            displayOrder: img.displayOrder, isPrimary: img.isPrimary,
        })),
    };
}

function transformBooking(api: BookingApiResponse): Booking {
    return {
        id: String(api.id),
        userId: String(api.userId ?? ''),
        userName: api.userName,
        lotId: String(api.lotId),
        lotName: api.lotName,
        startDate: api.checkInDate,
        endDate: api.checkOutDate,
        status: api.status.toLowerCase() as Booking['status'],
        totalPrice: api.totalPrice,
        details: api.specialRequests ?? undefined,
        guestName: api.guestName ?? undefined,
        guestEmail: api.guestEmail ?? undefined,
        guestPhone: api.guestPhone ?? undefined,
        bookingSource: api.bookingSource ?? undefined,
        numGuests: api.numGuests,
    };
}

function transformOwnerProfile(api: OwnerProfileApiResponse, userId: string): Owner {
    return {
        id: String(api.id),
        userId,
        propertyName: api.propertyName,
        county: api.county,
        town: api.town,
        description: api.description ?? '',
        coverImageUrl: '',
        propertyType: api.propertyType,
        selectedAccommodationTypes: [],
        contactEmail: '',
        contactPhone: api.phone ?? '',
        website: api.website ?? '',
        latitude: api.latitude ?? null,
        longitude: api.longitude ?? null,
        active: true,
        verified: true,
        createdAt: '',
        stats: {
            totalLots: api.lotCount, activeLots: api.lotCount,
            totalBookings: 0, upcomingBookings: 0,
            totalRevenue: 0, monthlyRevenue: 0, occupancyRate: 0,
        },
    };
}

// --- Blocked period transform ---

interface BlockedPeriodApiResponse {
    id: number; lotId: number; lotName: string;
    startDate: string; endDate: string; reason: string | null; createdAt: string;
}

function transformBlockedPeriod(bp: BlockedPeriodApiResponse): BlockedPeriod {
    return {
        id: String(bp.id), lotId: String(bp.lotId), lotName: bp.lotName,
        startDate: bp.startDate, endDate: bp.endDate,
        reason: bp.reason ?? undefined, createdAt: bp.createdAt,
    };
}

// --- Pricing rule transform ---

interface PricingRuleApiResponse {
    id: number; lotType: string; name: string;
    startDate: string; endDate: string; pricePerNight: number; createdAt: string;
}

function transformPricingRule(rule: PricingRuleApiResponse): SeasonalPricingRule {
    return {
        id: String(rule.id),
        lotType: rule.lotType.toLowerCase().replace('_', '-'),
        name: rule.name,
        startDate: rule.startDate, endDate: rule.endDate,
        pricePerNight: rule.pricePerNight, createdAt: rule.createdAt,
    };
}

// --- Service ---

export const ownerService = {
    async getOwnerProfile(userId: string): Promise<Owner | null> {
        try {
            const api = await apiRequest<OwnerProfileApiResponse>('/owner/profile');
            return transformOwnerProfile(api, userId);
        } catch (error) {
            if (error instanceof NotFoundError) return null;
            throw error;
        }
    },

    async getDashboardData(_userId: string): Promise<OwnerDashboardData> {
        const api = await apiRequest<DashboardApiResponse>('/owner/dashboard');

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const bookings: Booking[] = (api.recentBookings ?? []).map(b => ({
            id: String(b.id), lotId: '', lotName: b.lotName,
            userId: '', userName: b.guestName,
            startDate: b.checkIn, endDate: b.checkOut,
            status: b.status.toLowerCase() as Booking['status'],
            totalPrice: 0,
        }));

        const upcomingCheckIns = bookings.filter(b => {
            const d = new Date(b.startDate);
            return d >= today && d <= nextWeek && (b.status === 'confirmed' || b.status === 'pending');
        });

        const upcomingCheckOuts = bookings.filter(b => {
            const d = new Date(b.endDate);
            return d >= today && d <= nextWeek && b.status === 'confirmed';
        });

        const stats: OwnerStats = {
            totalLots: api.totalLots, activeLots: api.activeLots,
            totalBookings: 0, upcomingBookings: api.upcomingBookings,
            totalRevenue: 0, monthlyRevenue: api.monthlyRevenue,
            occupancyRate: api.totalLots > 0 ? Math.round((api.activeLots / api.totalLots) * 100) : 0,
        };

        const owner: Owner = {
            id: '', userId: '', propertyName: '', county: '', town: '',
            description: '', coverImageUrl: '', propertyType: '',
            selectedAccommodationTypes: [], contactEmail: '', contactPhone: '',
            website: '', latitude: null, longitude: null,
            active: true, verified: true, createdAt: '', stats,
        };

        return { owner, recentBookings: bookings, lots: [], upcomingCheckIns, upcomingCheckOuts };
    },

    async getOwnerLots(_userId: string): Promise<Lot[]> {
        const apiLots = await apiRequest<LotApiResponse[]>('/owner/lots');
        return apiLots.map(transformLot);
    },

    async getOwnerBookings(_userId: string): Promise<Booking[]> {
        const apiBookings = await apiRequest<BookingApiResponse[]>('/owner/bookings');
        return apiBookings.map(transformBooking);
    },

    async createLot(data: CreateLotRequest): Promise<Lot> {
        const api = await apiRequest<LotApiResponse>('/owner/lots', {
            method: 'POST', body: data,
        });
        return transformLot(api);
    },

    async updateLot(lotId: string, data: UpdateLotRequest): Promise<Lot> {
        const api = await apiRequest<LotApiResponse>(`/owner/lots/${lotId}`, {
            method: 'PUT', body: data,
        });
        return transformLot(api);
    },

    async deleteLot(lotId: string): Promise<void> {
        await apiRequest<void>(`/owner/lots/${lotId}`, { method: 'DELETE' });
    },

    async getLotsDetail(_ownerId: string): Promise<LotsDetailResponse> {
        return apiRequest<LotsDetailResponse>('/owner/analytics/lots');
    },

    async getBookingsDetail(_ownerId: string): Promise<BookingsDetailResponse> {
        return apiRequest<BookingsDetailResponse>('/owner/analytics/bookings');
    },

    async getRevenueDetail(_ownerId: string): Promise<RevenueDetailResponse> {
        return apiRequest<RevenueDetailResponse>('/owner/analytics/revenue');
    },

    async getOccupancyDetail(_ownerId: string): Promise<OccupancyDetailResponse> {
        return apiRequest<OccupancyDetailResponse>('/owner/analytics/occupancy');
    },

    async purchaseFeatured(duration: '7_DAYS' | '30_DAYS'): Promise<{ checkoutUrl: string }> {
        return apiRequest<{ checkoutUrl: string }>('/owner/featured/purchase', {
            method: 'POST', body: { duration },
        });
    },

    async checkInBooking(bookingId: string): Promise<Booking> {
        const api = await apiRequest<BookingApiResponse>(`/owner/bookings/${bookingId}/check-in`, { method: 'PUT' });
        return transformBooking(api);
    },

    async checkOutBooking(bookingId: string): Promise<Booking> {
        const api = await apiRequest<BookingApiResponse>(`/owner/bookings/${bookingId}/check-out`, { method: 'PUT' });
        return transformBooking(api);
    },

    async confirmBooking(bookingId: string): Promise<Booking> {
        const api = await apiRequest<BookingApiResponse>(`/owner/bookings/${bookingId}/confirm`, { method: 'PUT' });
        return transformBooking(api);
    },

    async cancelBooking(bookingId: string): Promise<Booking> {
        const api = await apiRequest<BookingApiResponse>(`/owner/bookings/${bookingId}/cancel`, { method: 'POST' });
        return transformBooking(api);
    },

    // --- Modify Booking ---

    async modifyBooking(bookingId: string, data: {
        lotId?: number;
        checkInDate?: string;
        checkOutDate?: string;
        reason?: string;
    }): Promise<Booking> {
        const api = await apiRequest<BookingApiResponse>(`/owner/bookings/${bookingId}/modify`, {
            method: 'PUT', body: data,
        });
        return transformBooking(api);
    },

    // --- Blocked Periods ---

    async getBlockedPeriods(): Promise<BlockedPeriod[]> {
        const data = await apiRequest<BlockedPeriodApiResponse[]>('/owner/blocked-periods');
        return data.map(transformBlockedPeriod);
    },

    async createBlockedPeriod(data: CreateBlockedPeriodRequest): Promise<BlockedPeriod> {
        const bp = await apiRequest<BlockedPeriodApiResponse>('/owner/blocked-periods', {
            method: 'POST', body: data,
        });
        return transformBlockedPeriod(bp);
    },

    async deleteBlockedPeriod(id: string): Promise<void> {
        await apiRequest<void>(`/owner/blocked-periods/${id}`, { method: 'DELETE' });
    },

    // --- Seasonal Pricing Rules ---

    async getPricingRules(): Promise<SeasonalPricingRule[]> {
        const data = await apiRequest<PricingRuleApiResponse[]>('/owner/pricing-rules');
        return data.map(transformPricingRule);
    },

    async createPricingRule(data: CreateSeasonalPricingRuleRequest): Promise<SeasonalPricingRule> {
        const rule = await apiRequest<PricingRuleApiResponse>('/owner/pricing-rules', {
            method: 'POST',
            body: { ...data, lotType: data.lotType.toUpperCase().replace('-', '_') },
        });
        return transformPricingRule(rule);
    },

    async deletePricingRule(id: string): Promise<void> {
        await apiRequest<void>(`/owner/pricing-rules/${id}`, { method: 'DELETE' });
    },

    // --- Today's Arrivals/Departures ---

    async getTodayMovements(): Promise<{ arrivals: Booking[]; departures: Booking[] }> {
        const data = await apiRequest<{ arrivals: BookingApiResponse[]; departures: BookingApiResponse[] }>('/owner/bookings/today');
        return {
            arrivals: data.arrivals.map(transformBooking),
            departures: data.departures.map(transformBooking),
        };
    },

    // --- Manual Booking ---

    async createManualBooking(data: {
        lotId: number;
        checkInDate: string;
        checkOutDate: string;
        numGuests: number;
        guestName: string;
        guestEmail?: string;
        guestPhone?: string;
        specialRequests?: string;
        bookingSource: string;
    }): Promise<Booking> {
        const api = await apiRequest<BookingApiResponse>('/owner/bookings', {
            method: 'POST', body: data,
        });
        return transformBooking(api);
    },

    // --- Modification Requests ---

    async getPendingModificationRequests(): Promise<ModificationRequest[]> {
        return apiRequest<ModificationRequest[]>('/owner/modification-requests');
    },

    async resolveModificationRequest(requestId: string, approve: boolean, declineReason?: string): Promise<ModificationRequest> {
        return apiRequest<ModificationRequest>(`/owner/modification-requests/${requestId}/resolve`, {
            method: 'POST',
            body: { approve, declineReason },
        });
    },

    // --- Lot Export/Import ---

    async exportLotsJson(): Promise<void> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/owner/lots/export`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) throw new Error('Export failed');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.headers.get('Content-Disposition')
            ?.match(/filename="(.+)"/)?.[1] || `lots-export-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    async importLotsJson(file: File): Promise<ImportLotsResult> {
        const text = await file.text();
        const json = JSON.parse(text);
        const lots = json.lots || json;
        return apiRequest<ImportLotsResult>('/owner/lots/import', {
            method: 'POST',
            body: { lots: Array.isArray(lots) ? lots : [lots] },
        });
    },

    // --- Profile Update ---

    async updateOwnerProfile(data: {
        propertyName?: string;
        county?: string;
        town?: string;
        propertyType?: string;
        description?: string;
        phone?: string;
        website?: string;
        latitude?: number | null;
        longitude?: number | null;
    }): Promise<void> {
        await apiRequest<OwnerProfileApiResponse>('/owner/profile', {
            method: 'PUT', body: data,
        });
    },
};
