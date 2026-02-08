import { apiRequest, NotFoundError } from './apiClient';
import type { Lot, Booking } from '../types/booking';
import type { CampsiteProfile } from '../types/campsite';

// Re-export for backward compatibility
export type { CampsiteProfile } from '../types/campsite';

// --- API response types (internal) ---

interface OwnerApiResponse {
    id: number;
    propertyName: string;
    county: string;
    town: string;
    propertyType: 'CAMPSITE' | 'GLAMPING' | 'CARAVAN_PARK' | 'MIXED';
    description: string;
    latitude: number | null;
    longitude: number | null;
    phone: string | null;
    website: string | null;
    amenities: Array<{ id: number; name: string; category: string }>;
    lotCount: number;
    isFeatured: boolean;
    featuredUntil: string | null;
    isAcceptingBookings: boolean;
    rating: number | null;
    reviewCount: number;
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
    amenities: Array<{ id: number; name: string; category: string }>;
    images?: Array<{ id: number; url: string; altText: string | null; displayOrder: number; isPrimary: boolean }>;
}

interface BookingApiResponse {
    id: number;
    userId: number;
    userName: string;
    lotId: number;
    lotName: string;
    campsiteName: string;
    checkInDate: string;
    checkOutDate: string;
    numGuests: number;
    totalPrice: number;
    serviceFee: number | null;
    chargeTotal: number | null;
    status: string;
    paymentStatus: string | null;
    specialRequests: string | null;
    createdAt: string;
}

// --- Transform functions ---

const LOT_TYPE_MAP: Record<string, Lot['type']> = {
    'TENT': 'tent', 'TOURING': 'touring', 'GLAMPING': 'glamping',
    'CABIN': 'cabin', 'MOBILE_HOME': 'mobile-home',
};

function transformCampsite(api: OwnerApiResponse): CampsiteProfile {
    return {
        id: String(api.id),
        email: '',
        name: api.propertyName,
        propertyName: api.propertyName,
        county: api.county,
        town: api.town,
        propertyType: api.propertyType,
        description: api.description,
        amenities: api.amenities.map(a => a.name),
        lotCount: api.lotCount,
        latitude: api.latitude,
        longitude: api.longitude,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(api.propertyName)}&background=059669&color=fff`,
        isFeatured: api.isFeatured,
        featuredUntil: api.featuredUntil ?? undefined,
        isAcceptingBookings: api.isAcceptingBookings,
        phone: api.phone,
        website: api.website,
        rating: api.rating,
        reviewCount: api.reviewCount,
    };
}

function transformLot(api: LotApiResponse): Lot {
    const lotAmenityCategories = ['PITCH', 'UNIT'];
    return {
        id: String(api.id),
        ownerId: String(api.ownerId),
        name: api.name,
        type: LOT_TYPE_MAP[api.lotType] || 'tent',
        pricePerNight: api.pricePerNight,
        description: api.description || '',
        lotAmenities: api.amenities.filter(a => lotAmenityCategories.includes(a.category)).map(a => a.name),
        campsiteAmenities: api.amenities.filter(a => !lotAmenityCategories.includes(a.category)).map(a => a.name),
        isAvailable: api.isActive,
        imageUrl: api.imageUrl || undefined,
        images: api.images?.map(img => ({
            id: img.id, url: img.url, altText: img.altText,
            displayOrder: img.displayOrder, isPrimary: img.isPrimary,
        })),
    };
}

function transformBooking(api: BookingApiResponse): Booking {
    const statusMap: Record<string, Booking['status']> = {
        'PENDING_PAYMENT': 'pending_payment', 'PENDING': 'pending',
        'CONFIRMED': 'confirmed', 'CANCELLED': 'cancelled',
        'COMPLETED': 'completed', 'PAYMENT_FAILED': 'payment_failed',
    };
    const paymentStatusMap: Record<string, Booking['paymentStatus']> = {
        'NONE': 'none', 'AUTHORIZED': 'authorized', 'CAPTURED': 'captured',
        'RELEASED': 'released', 'REFUNDED': 'refunded', 'FAILED': 'failed',
    };

    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}/${date.getFullYear()}`;
    };

    return {
        id: String(api.id),
        userId: String(api.userId),
        userName: api.userName,
        lotId: String(api.lotId),
        lotName: `${api.lotName} at ${api.campsiteName}`,
        startDate: formatDate(api.checkInDate),
        endDate: formatDate(api.checkOutDate),
        status: statusMap[api.status] || 'pending',
        totalPrice: api.totalPrice,
        serviceFee: api.serviceFee ?? undefined,
        chargeTotal: api.chargeTotal ?? undefined,
        paymentStatus: api.paymentStatus ? paymentStatusMap[api.paymentStatus] : undefined,
        details: api.specialRequests || undefined,
    };
}

// --- Service ---

export const campsiteService = {
    async getAllCampsites(): Promise<CampsiteProfile[]> {
        const data = await apiRequest<OwnerApiResponse[]>('/campsites', { requiresAuth: false });
        return data.map(transformCampsite);
    },

    async getFeaturedCampsites(): Promise<CampsiteProfile[]> {
        const data = await apiRequest<OwnerApiResponse[]>('/campsites/featured', { requiresAuth: false });
        return data.map(transformCampsite);
    },

    async getCampsiteById(id: string): Promise<CampsiteProfile | undefined> {
        try {
            const data = await apiRequest<OwnerApiResponse>(`/campsites/${id}`, { requiresAuth: false });
            return transformCampsite(data);
        } catch (error) {
            if (error instanceof NotFoundError) return undefined;
            throw error;
        }
    },

    async getCampsitesByCounty(county: string): Promise<CampsiteProfile[]> {
        const data = await apiRequest<OwnerApiResponse[]>(`/campsites/county/${encodeURIComponent(county)}`, { requiresAuth: false });
        return data.map(transformCampsite);
    },

    async getCounties(): Promise<string[]> {
        return apiRequest<string[]>('/campsites/counties', { requiresAuth: false });
    },

    async getCampsiteLots(campsiteId: string): Promise<Lot[]> {
        const data = await apiRequest<LotApiResponse[]>(`/campsites/${campsiteId}/lots`, { requiresAuth: false });
        return data.map(transformLot);
    },

    async getAvailableLots(campsiteId: string, checkIn: Date, checkOut: Date): Promise<Lot[]> {
        const checkInStr = checkIn.toISOString().split('T')[0];
        const checkOutStr = checkOut.toISOString().split('T')[0];
        const data = await apiRequest<LotApiResponse[]>(
            `/campsites/${campsiteId}/lots/available?checkIn=${checkInStr}&checkOut=${checkOutStr}`,
            { requiresAuth: false },
        );
        return data.map(transformLot);
    },

    async getLotById(lotId: string): Promise<Lot | undefined> {
        try {
            const data = await apiRequest<LotApiResponse>(`/campsites/lots/${lotId}`, { requiresAuth: false });
            return transformLot(data);
        } catch (error) {
            if (error instanceof NotFoundError) return undefined;
            throw error;
        }
    },

    async getBookedDates(lotId: string): Promise<Array<{ checkIn: string; checkOut: string }>> {
        return apiRequest<Array<{ checkIn: string; checkOut: string }>>(`/campsites/lots/${lotId}/booked-dates`, { requiresAuth: false });
    },

    async createBooking(booking: Omit<Booking, 'id' | 'status'>): Promise<Booking> {
        const parseDate = (dateStr: string): string => {
            const [day, month, year] = dateStr.split('/');
            return `${year}-${month}-${day}`;
        };

        const data = await apiRequest<BookingApiResponse>('/bookings', {
            method: 'POST',
            body: {
                lotId: parseInt(booking.lotId, 10),
                checkInDate: parseDate(booking.startDate),
                checkOutDate: parseDate(booking.endDate),
                numGuests: 2,
                specialRequests: booking.details || null,
            },
        });
        return transformBooking(data);
    },

    async getUserBookings(_userId: string): Promise<Booking[]> {
        const data = await apiRequest<BookingApiResponse[]>('/bookings');
        const bookings = data.map(transformBooking);
        return bookings.sort((a, b) => {
            const parseDate = (dateStr: string) => {
                const [d, m, y] = dateStr.split('/');
                return new Date(`${y}-${m}-${d}`);
            };
            return parseDate(b.startDate).getTime() - parseDate(a.startDate).getTime();
        });
    },

    async getBookingById(bookingId: string): Promise<Booking | undefined> {
        try {
            const data = await apiRequest<BookingApiResponse>(`/bookings/${bookingId}`);
            return transformBooking(data);
        } catch (error) {
            if (error instanceof NotFoundError) return undefined;
            throw error;
        }
    },

    async cancelBooking(bookingId: string): Promise<Booking> {
        const data = await apiRequest<BookingApiResponse>(`/bookings/${bookingId}/cancel`, { method: 'POST' });
        return transformBooking(data);
    },
};
