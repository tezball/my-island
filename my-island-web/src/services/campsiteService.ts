import type { Lot, Booking } from '../types/booking';
import type { User } from './authService';

// API configuration
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Logging utility
const log = {
    info: (message: string, data?: Record<string, unknown>) => {
        console.log(`[CampsiteService] ${message}`, data ? JSON.stringify(data) : '');
    },
    error: (message: string, error?: unknown, data?: Record<string, unknown>) => {
        console.error(`[CampsiteService] ERROR: ${message}`, {
            error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
            ...data,
        });
    },
    debug: (message: string, data?: Record<string, unknown>) => {
        if (import.meta.env.DEV) {
            console.debug(`[CampsiteService] DEBUG: ${message}`, data ? JSON.stringify(data) : '');
        }
    },
};

// Custom error classes
export class CampsiteServiceError extends Error {
    readonly code: string;
    readonly statusCode?: number;

    constructor(message: string, code: string, statusCode?: number) {
        super(message);
        this.name = 'CampsiteServiceError';
        this.code = code;
        this.statusCode = statusCode;
    }
}

export class NotFoundError extends CampsiteServiceError {
    constructor(message: string = 'Resource not found') {
        super(message, 'NOT_FOUND', 404);
        this.name = 'NotFoundError';
    }
}

export class NetworkError extends CampsiteServiceError {
    constructor(message: string = 'Unable to connect to the server') {
        super(message, 'NETWORK_ERROR');
        this.name = 'NetworkError';
    }
}

// API Response Types
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
    status: string;
    specialRequests: string | null;
    createdAt: string;
}

export interface CampsiteProfile extends User {
    propertyName?: string;
    county?: string;
    town?: string;
    propertyType?: string;
    description?: string;
    amenities?: string[];
    lotCount?: number;
    latitude?: number | null;
    longitude?: number | null;
    isFeatured?: boolean;
    featuredUntil?: string;
    isAcceptingBookings?: boolean;
    phone?: string | null;
    website?: string | null;
}

// Helper function for API calls
async function apiRequest<T>(
    endpoint: string,
    options: {
        method?: string;
        body?: unknown;
        requiresAuth?: boolean;
    } = {}
): Promise<T> {
    const { method = 'GET', body, requiresAuth = false } = options;
    const startTime = performance.now();

    log.debug(`${method} ${endpoint}`, body ? { hasBody: true } : undefined);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (requiresAuth) {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new CampsiteServiceError('Authentication required', 'AUTH_ERROR', 401);
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    let response: Response;
    try {
        response = await fetch(`${API_BASE}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch (error) {
        log.error('Network error', error, { endpoint });
        throw new NetworkError();
    }

    const durationMs = performance.now() - startTime;

    if (!response.ok) {
        if (response.status === 404) {
            throw new NotFoundError();
        }

        let errorMessage = 'Request failed';
        try {
            const errorBody = await response.text();
            // Try to parse as JSON first
            try {
                const errorJson = JSON.parse(errorBody);
                // Extract message from common error response formats
                errorMessage = errorJson.message || errorJson.error || errorJson.detail || errorBody;
            } catch {
                // If not JSON, use the raw text if it looks like a message
                if (errorBody && errorBody.length < 500) {
                    errorMessage = errorBody;
                }
            }
            log.error('API error', undefined, {
                endpoint,
                statusCode: response.status,
                errorBody,
                durationMs
            });
        } catch {
            // Ignore body reading errors
        }

        throw new CampsiteServiceError(
            errorMessage,
            'API_ERROR',
            response.status
        );
    }

    const data = await response.json();
    log.info(`${method} ${endpoint} completed`, { durationMs: Math.round(durationMs) });
    return data;
}

// Transform functions
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
    };
}

function transformLot(api: LotApiResponse): Lot {
    // Map API lot types to frontend types
    const typeMap: Record<string, Lot['type']> = {
        'TENT': 'tent',
        'TOURING': 'touring',
        'GLAMPING': 'glamping',
        'CABIN': 'cabin',
        'MOBILE_HOME': 'mobile-home',
    };

    // Separate amenities into lot-specific and campsite-wide
    const lotAmenityCategories = ['PITCH', 'UNIT'];
    const lotAmenities = api.amenities
        .filter(a => lotAmenityCategories.includes(a.category))
        .map(a => a.name);
    const campsiteAmenities = api.amenities
        .filter(a => !lotAmenityCategories.includes(a.category))
        .map(a => a.name);

    return {
        id: String(api.id),
        ownerId: String(api.ownerId),
        name: api.name,
        type: typeMap[api.lotType] || 'tent',
        pricePerNight: api.pricePerNight,
        description: api.description || '',
        lotAmenities,
        campsiteAmenities,
        isAvailable: api.isActive,
        imageUrl: api.imageUrl || undefined,
    };
}

function transformBooking(api: BookingApiResponse): Booking {
    // Map API status to frontend status
    const statusMap: Record<string, Booking['status']> = {
        'PENDING': 'pending',
        'CONFIRMED': 'confirmed',
        'CANCELLED': 'cancelled',
        'COMPLETED': 'completed',
    };

    // Format dates from ISO to DD/MM/YYYY for frontend compatibility
    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
        details: api.specialRequests || undefined,
    };
}

export const campsiteService = {
    async getAllCampsites(): Promise<CampsiteProfile[]> {
        const apiCampsites = await apiRequest<OwnerApiResponse[]>('/campsites');
        return apiCampsites.map(transformCampsite);
    },

    async getFeaturedCampsites(): Promise<CampsiteProfile[]> {
        const apiCampsites = await apiRequest<OwnerApiResponse[]>('/campsites/featured');
        return apiCampsites.map(transformCampsite);
    },

    async getCampsiteById(id: string): Promise<CampsiteProfile | undefined> {
        try {
            const apiCampsite = await apiRequest<OwnerApiResponse>(`/campsites/${id}`);
            return transformCampsite(apiCampsite);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return undefined;
            }
            throw error;
        }
    },

    async getCampsitesByCounty(county: string): Promise<CampsiteProfile[]> {
        const apiCampsites = await apiRequest<OwnerApiResponse[]>(`/campsites/county/${encodeURIComponent(county)}`);
        return apiCampsites.map(transformCampsite);
    },

    async getCounties(): Promise<string[]> {
        return apiRequest<string[]>('/campsites/counties');
    },

    async getCampsiteLots(campsiteId: string): Promise<Lot[]> {
        const apiLots = await apiRequest<LotApiResponse[]>(`/campsites/${campsiteId}/lots`);
        return apiLots.map(transformLot);
    },

    async getAvailableLots(campsiteId: string, checkIn: Date, checkOut: Date): Promise<Lot[]> {
        const checkInStr = checkIn.toISOString().split('T')[0];
        const checkOutStr = checkOut.toISOString().split('T')[0];
        const apiLots = await apiRequest<LotApiResponse[]>(
            `/campsites/${campsiteId}/lots/available?checkIn=${checkInStr}&checkOut=${checkOutStr}`
        );
        return apiLots.map(transformLot);
    },

    async getLotById(lotId: string): Promise<Lot | undefined> {
        try {
            const apiLot = await apiRequest<LotApiResponse>(`/campsites/lots/${lotId}`);
            return transformLot(apiLot);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return undefined;
            }
            throw error;
        }
    },

    async getBookedDates(lotId: string): Promise<Array<{ checkIn: string; checkOut: string }>> {
        return apiRequest<Array<{ checkIn: string; checkOut: string }>>(`/campsites/lots/${lotId}/booked-dates`);
    },

    async createBooking(booking: Omit<Booking, 'id' | 'status'>): Promise<Booking> {
        // Parse DD/MM/YYYY to ISO date format
        const parseDate = (dateStr: string): string => {
            const [day, month, year] = dateStr.split('/');
            return `${year}-${month}-${day}`;
        };

        const apiBooking = await apiRequest<BookingApiResponse>('/bookings', {
            method: 'POST',
            requiresAuth: true,
            body: {
                lotId: parseInt(booking.lotId, 10),
                checkInDate: parseDate(booking.startDate),
                checkOutDate: parseDate(booking.endDate),
                numGuests: 2, // Default - could be passed in booking details
                specialRequests: booking.details || null,
            },
        });

        return transformBooking(apiBooking);
    },

    async getUserBookings(userId: string): Promise<Booking[]> {
        log.debug('Getting user bookings', { userId });
        const apiBookings = await apiRequest<BookingApiResponse[]>('/bookings', {
            requiresAuth: true,
        });

        // Sort by start date (newest first)
        const bookings = apiBookings.map(transformBooking);
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
            const apiBooking = await apiRequest<BookingApiResponse>(`/bookings/${bookingId}`, {
                requiresAuth: true,
            });
            return transformBooking(apiBooking);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return undefined;
            }
            throw error;
        }
    },

    async cancelBooking(bookingId: string): Promise<Booking> {
        const apiBooking = await apiRequest<BookingApiResponse>(`/bookings/${bookingId}/cancel`, {
            method: 'POST',
            requiresAuth: true,
        });
        return transformBooking(apiBooking);
    },
};
