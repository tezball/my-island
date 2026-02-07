import type { Lot, Booking, BlockedPeriod, CreateBlockedPeriodRequest, SeasonalPricingRule, CreateSeasonalPricingRuleRequest } from '../types/booking';

// API configuration
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

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
        console.log(`[OwnerService] ${message}`, data ? JSON.stringify(data) : '');
    },
    error: (message: string, error?: unknown, data?: Record<string, unknown>) => {
        console.error(`[OwnerService] ERROR: ${message}`, {
            error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
            ...data,
        });
    },
    debug: (message: string, data?: Record<string, unknown>) => {
        if (import.meta.env.DEV) {
            console.debug(`[OwnerService] DEBUG: ${message}`, data ? JSON.stringify(data) : '');
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

// Custom error classes for better error handling
export class OwnerServiceError extends Error {
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
        this.name = 'OwnerServiceError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
    }
}

export class NetworkError extends OwnerServiceError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, 'NETWORK_ERROR', undefined, details);
        this.name = 'NetworkError';
    }
}

export class AuthenticationError extends OwnerServiceError {
    constructor(message: string = 'Authentication required') {
        super(message, 'AUTH_ERROR', 401);
        this.name = 'AuthenticationError';
    }
}

export class ApiError extends OwnerServiceError {
    constructor(message: string, statusCode: number, details?: Record<string, unknown>) {
        super(message, 'API_ERROR', statusCode, details);
        this.name = 'ApiError';
    }
}

// API response type for dashboard endpoint
interface DashboardApiResponse {
    totalLots: number;
    activeLots: number;
    upcomingBookings: number;
    monthlyRevenue: number;
    recentBookings: Array<{
        id: number;
        lotName: string;
        guestName: string;
        checkIn: string;  // "2025-06-15"
        checkOut: string;
        status: string;   // "CONFIRMED"
    }>;
}

// Lot Detail Types
export interface LotDetail {
    id: string;
    name: string;
    type: 'tent' | 'touring' | 'glamping' | 'cabin' | 'mobile-home';
    pricePerNight: number;
    isAvailable: boolean;
    amenities: string[];
}

export interface LotsDetailSummary {
    total: number;
    available: number;
    unavailable: number;
    byType: Record<string, number>;
}

export interface LotsDetailResponse {
    summary: LotsDetailSummary;
    lots: LotDetail[];
}

// Booking Detail Types
export interface BookingDetail {
    id: string;
    userName: string;
    lotName: string;
    lotType: string;
    startDate: string;
    endDate: string;
    status: 'confirmed' | 'pending' | 'cancelled' | 'checked_in' | 'completed';
    totalPrice: number;
    guests: number;
}

export interface BookingsDetailSummary {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    checkInsThisWeek: number;
    checkOutsThisWeek: number;
}

export interface BookingsDetailResponse {
    summary: BookingsDetailSummary;
    bookings: BookingDetail[];
}

// Revenue Detail Types
export interface MonthlyTrend {
    month: string;
    revenue: number;
}

export interface RevenueByType {
    type: string;
    revenue: number;
    percentage: number;
}

export interface TopLot {
    name: string;
    type: string;
    revenue: number;
    bookings: number;
}

export interface RevenueDetailSummary {
    thisMonth: number;
    lastMonth: number;
    yearToDate: number;
    avgBookingValue: number;
    monthOverMonthChange: number;
}

export interface RevenueDetailResponse {
    summary: RevenueDetailSummary;
    monthlyTrend: MonthlyTrend[];
    byType: RevenueByType[];
    topLots: TopLot[];
}

// Occupancy Detail Types
export interface OccupancyByType {
    type: string;
    total: number;
    occupied: number;
    rate: number;
}

export interface WeeklyTrend {
    day: string;
    rate: number;
}

export interface PeakDay {
    day: string;
    avgRate: number;
}

export interface OccupancyDetailSummary {
    currentRate: number;
    totalLots: number;
    availableLots: number;
    occupiedLots: number;
    avgStayDuration: number;
}

export interface OccupancyDetailResponse {
    summary: OccupancyDetailSummary;
    byType: OccupancyByType[];
    weeklyTrend: WeeklyTrend[];
    peakDays: PeakDay[];
}

export interface Owner {
    id: string;
    userId: string;
    propertyName: string;
    county: string;
    town: string;
    description: string;
    coverImageUrl: string;
    propertyType: string;
    selectedAccommodationTypes: string[];
    contactEmail: string;
    contactPhone: string;
    active: boolean;
    verified: boolean;
    createdAt: string;
    stats: OwnerStats;
}

export interface OwnerStats {
    totalLots: number;
    activeLots: number;
    totalBookings: number;
    upcomingBookings: number;
    totalRevenue: number;
    monthlyRevenue: number;
    occupancyRate: number;
}

export interface OwnerDashboardData {
    owner: Owner | null;
    recentBookings: Booking[];
    lots: Lot[];
    upcomingCheckIns: Booking[];
    upcomingCheckOuts: Booking[];
}

// API response type for owner profile
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

// API response type for lot
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
    images?: Array<{ id: number; url: string; altText: string | null; displayOrder: number; isPrimary: boolean }>;
}

// API response type for booking
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

// Request types for lot CRUD
export interface CreateLotRequest {
    name: string;
    lotType: string;
    description: string;
    pricePerNight: number;
    maxGuests: number;
    imageUrl?: string;
    amenityIds?: number[];
}

export interface UpdateLotRequest {
    name?: string;
    lotType?: string;
    description?: string;
    pricePerNight?: number;
    maxGuests?: number;
    isActive?: boolean;
    imageUrl?: string;
    amenityIds?: number[];
}

export const ownerService = {
    async getOwnerProfile(_userId: string): Promise<Owner | null> {
        const endpoint = '/owner/profile';
        const startTime = performance.now();

        log.info('Fetching owner profile', { endpoint });

        const token = localStorage.getItem('token');
        if (!token) {
            log.error('No auth token found', undefined, { endpoint });
            metrics.record({
                endpoint,
                method: 'GET',
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
                headers: getAuthHeaders(),
            });
        } catch (error) {
            const durationMs = performance.now() - startTime;
            log.error('Network error during fetch', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'GET',
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
                method: 'GET',
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
                // Owner profile not found - return null instead of throwing
                return null;
            }
            if (response.status >= 500) {
                throw new ApiError('Server error. Please try again later.', response.status, { errorBody });
            }

            throw new ApiError(
                `Failed to fetch owner profile: ${response.statusText}`,
                response.status,
                { errorBody }
            );
        }

        let api: OwnerProfileApiResponse;
        try {
            api = await response.json();
            log.debug('API response received', {
                id: api.id,
                propertyName: api.propertyName,
                lotCount: api.lotCount,
            });
        } catch (error) {
            log.error('Failed to parse API response', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'GET',
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
            method: 'GET',
            durationMs,
            status: 'success',
            statusCode: response.status,
        });

        log.info('Owner profile fetched successfully', {
            durationMs: Math.round(durationMs),
            ownerId: api.id,
        });

        // Transform API response to frontend Owner type
        const owner: Owner = {
            id: String(api.id),
            userId: _userId,
            propertyName: api.propertyName,
            county: api.county,
            town: api.town,
            description: api.description ?? '',
            coverImageUrl: '',
            propertyType: api.propertyType,
            selectedAccommodationTypes: [],
            contactEmail: '',
            contactPhone: api.phone ?? '',
            active: true,
            verified: true,
            createdAt: '',
            stats: {
                totalLots: api.lotCount,
                activeLots: api.lotCount,
                totalBookings: 0,
                upcomingBookings: 0,
                totalRevenue: 0,
                monthlyRevenue: 0,
                occupancyRate: 0,
            },
        };

        return owner;
    },

    async getDashboardData(_userId: string): Promise<OwnerDashboardData> {
        const endpoint = '/owner/dashboard';
        const startTime = performance.now();

        log.info('Fetching dashboard data', { endpoint, userId: _userId });

        // Check for auth token
        const token = localStorage.getItem('token');
        if (!token) {
            log.error('No auth token found', undefined, { endpoint });
            metrics.record({
                endpoint,
                method: 'GET',
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
                headers: getAuthHeaders(),
            });
        } catch (error) {
            const durationMs = performance.now() - startTime;
            log.error('Network error during fetch', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'GET',
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
                method: 'GET',
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
                throw new ApiError('Owner dashboard not found. Please complete your owner profile first.', 404);
            }
            if (response.status >= 500) {
                throw new ApiError('Server error. Please try again later.', response.status, { errorBody });
            }

            throw new ApiError(
                `Failed to fetch dashboard data: ${response.statusText}`,
                response.status,
                { errorBody }
            );
        }

        let api: DashboardApiResponse;
        try {
            api = await response.json();
            log.debug('API response received', {
                totalLots: api.totalLots,
                activeLots: api.activeLots,
                upcomingBookings: api.upcomingBookings,
                recentBookingsCount: api.recentBookings?.length ?? 0,
            });
        } catch (error) {
            log.error('Failed to parse API response', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'GET',
                durationMs,
                status: 'error',
                errorType: 'PARSE_ERROR',
            });
            throw new ApiError('Invalid response from server. Please try again.', response.status, {
                parseError: error instanceof Error ? error.message : String(error),
            });
        }

        // Record successful metric
        metrics.record({
            endpoint,
            method: 'GET',
            durationMs,
            status: 'success',
            statusCode: response.status,
        });

        log.info('Dashboard data fetched successfully', {
            durationMs: Math.round(durationMs),
            totalLots: api.totalLots,
            bookingsCount: api.recentBookings?.length ?? 0,
        });

        // Transform API response to frontend format
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        // Transform API bookings to frontend Booking type
        const bookings: Booking[] = (api.recentBookings ?? []).map(b => ({
            id: String(b.id),
            lotId: '',
            lotName: b.lotName,
            userId: '',
            userName: b.guestName,
            startDate: b.checkIn,
            endDate: b.checkOut,
            status: b.status.toLowerCase() as Booking['status'],
            totalPrice: 0,
        }));

        log.debug('Transformed bookings', { count: bookings.length });

        // Filter for check-ins in next 7 days (include pending so owners can see new requests)
        const upcomingCheckIns = bookings.filter(b => {
            const checkIn = new Date(b.startDate);
            return checkIn >= today && checkIn <= nextWeek && (b.status === 'confirmed' || b.status === 'pending');
        });

        // Filter for check-outs in next 7 days
        const upcomingCheckOuts = bookings.filter(b => {
            const checkOut = new Date(b.endDate);
            return checkOut >= today && checkOut <= nextWeek && b.status === 'confirmed';
        });

        log.debug('Filtered check-ins/check-outs', {
            upcomingCheckIns: upcomingCheckIns.length,
            upcomingCheckOuts: upcomingCheckOuts.length,
        });

        // Build owner object with stats from API
        const owner: Owner = {
            id: '',
            userId: '',
            propertyName: '',
            county: '',
            town: '',
            description: '',
            coverImageUrl: '',
            propertyType: '',
            selectedAccommodationTypes: [],
            contactEmail: '',
            contactPhone: '',
            active: true,
            verified: true,
            createdAt: '',
            stats: {
                totalLots: api.totalLots,
                activeLots: api.activeLots,
                totalBookings: 0,
                upcomingBookings: api.upcomingBookings,
                totalRevenue: 0,
                monthlyRevenue: api.monthlyRevenue,
                occupancyRate: api.totalLots > 0
                    ? Math.round((api.activeLots / api.totalLots) * 100)
                    : 0,
            },
        };

        return {
            owner,
            recentBookings: bookings,
            lots: [],
            upcomingCheckIns,
            upcomingCheckOuts,
        };
    },

    // Expose metrics for debugging/monitoring
    getMetrics() {
        return metrics.getStats();
    },

    getMetricsHistory() {
        return [...metrics.history];
    },

    async getOwnerLots(_userId: string): Promise<Lot[]> {
        const endpoint = '/owner/lots';
        const startTime = performance.now();

        log.info('Fetching owner lots', { endpoint });

        const token = localStorage.getItem('token');
        if (!token) {
            log.error('No auth token found', undefined, { endpoint });
            metrics.record({
                endpoint,
                method: 'GET',
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
                headers: getAuthHeaders(),
            });
        } catch (error) {
            const durationMs = performance.now() - startTime;
            log.error('Network error during fetch', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'GET',
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
                method: 'GET',
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
                throw new ApiError('Owner profile not found. Please complete your owner profile first.', 404);
            }
            if (response.status >= 500) {
                throw new ApiError('Server error. Please try again later.', response.status, { errorBody });
            }

            throw new ApiError(
                `Failed to fetch owner lots: ${response.statusText}`,
                response.status,
                { errorBody }
            );
        }

        let apiLots: LotApiResponse[];
        try {
            apiLots = await response.json();
            log.debug('API response received', { lotCount: apiLots.length });
        } catch (error) {
            log.error('Failed to parse API response', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'GET',
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
            method: 'GET',
            durationMs,
            status: 'success',
            statusCode: response.status,
        });

        log.info('Owner lots fetched successfully', {
            durationMs: Math.round(durationMs),
            lotCount: apiLots.length,
        });

        // Transform API response to frontend Lot type
        const lots: Lot[] = apiLots.map(lot => ({
            id: String(lot.id),
            ownerId: String(lot.ownerId),
            name: lot.name,
            type: lot.lotType.toLowerCase().replace('_', '-') as Lot['type'],
            pricePerNight: lot.pricePerNight,
            description: lot.description ?? '',
            lotAmenities: lot.amenities?.map(a => a.name) ?? [],
            campsiteAmenities: [],
            isAvailable: lot.isActive,
            imageUrl: lot.imageUrl ?? undefined,
            images: lot.images?.map(img => ({
                id: img.id,
                url: img.url,
                altText: img.altText,
                displayOrder: img.displayOrder,
                isPrimary: img.isPrimary,
            })),
        }));

        return lots;
    },

    async getOwnerBookings(_userId: string): Promise<Booking[]> {
        const endpoint = '/owner/bookings';
        const startTime = performance.now();

        log.info('Fetching owner bookings', { endpoint });

        const token = localStorage.getItem('token');
        if (!token) {
            log.error('No auth token found', undefined, { endpoint });
            metrics.record({
                endpoint,
                method: 'GET',
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
                headers: getAuthHeaders(),
            });
        } catch (error) {
            const durationMs = performance.now() - startTime;
            log.error('Network error during fetch', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'GET',
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
                method: 'GET',
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
                throw new ApiError('Owner profile not found. Please complete your owner profile first.', 404);
            }
            if (response.status >= 500) {
                throw new ApiError('Server error. Please try again later.', response.status, { errorBody });
            }

            throw new ApiError(
                `Failed to fetch owner bookings: ${response.statusText}`,
                response.status,
                { errorBody }
            );
        }

        let apiBookings: BookingApiResponse[];
        try {
            apiBookings = await response.json();
            log.debug('API response received', { bookingCount: apiBookings.length });
        } catch (error) {
            log.error('Failed to parse API response', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'GET',
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
            method: 'GET',
            durationMs,
            status: 'success',
            statusCode: response.status,
        });

        log.info('Owner bookings fetched successfully', {
            durationMs: Math.round(durationMs),
            bookingCount: apiBookings.length,
        });

        // Transform API response to frontend Booking type
        const bookings: Booking[] = apiBookings.map(b => ({
            id: String(b.id),
            userId: String(b.userId ?? ''),
            userName: b.userName,
            lotId: String(b.lotId),
            lotName: b.lotName,
            startDate: b.checkInDate,
            endDate: b.checkOutDate,
            status: b.status.toLowerCase() as Booking['status'],
            totalPrice: b.totalPrice,
            details: b.specialRequests ?? undefined,
            guestName: b.guestName ?? undefined,
            guestEmail: b.guestEmail ?? undefined,
            guestPhone: b.guestPhone ?? undefined,
            bookingSource: b.bookingSource ?? undefined,
        }));

        return bookings;
    },

    async createLot(data: CreateLotRequest): Promise<Lot> {
        const endpoint = '/owner/lots';
        const startTime = performance.now();

        log.info('Creating lot', { endpoint, lotName: data.name });

        const token = localStorage.getItem('token');
        if (!token) {
            log.error('No auth token found', undefined, { endpoint });
            metrics.record({
                endpoint,
                method: 'POST',
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
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });
        } catch (error) {
            const durationMs = performance.now() - startTime;
            log.error('Network error during fetch', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'POST',
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
                method: 'POST',
                durationMs,
                status: 'error',
                statusCode: response.status,
                errorType: 'API_ERROR',
            });

            if (response.status === 401) {
                throw new AuthenticationError('Session expired. Please sign in again.');
            }
            if (response.status === 400) {
                throw new ApiError('Invalid lot data. Please check your input.', 400, { errorBody });
            }
            if (response.status >= 500) {
                throw new ApiError('Server error. Please try again later.', response.status, { errorBody });
            }

            throw new ApiError(
                `Failed to create lot: ${response.statusText}`,
                response.status,
                { errorBody }
            );
        }

        let apiLot: LotApiResponse;
        try {
            apiLot = await response.json();
            log.debug('API response received', { lotId: apiLot.id });
        } catch (error) {
            log.error('Failed to parse API response', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'POST',
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
            method: 'POST',
            durationMs,
            status: 'success',
            statusCode: response.status,
        });

        log.info('Lot created successfully', {
            durationMs: Math.round(durationMs),
            lotId: apiLot.id,
        });

        return {
            id: String(apiLot.id),
            ownerId: String(apiLot.ownerId),
            name: apiLot.name,
            type: apiLot.lotType.toLowerCase().replace('_', '-') as Lot['type'],
            pricePerNight: apiLot.pricePerNight,
            description: apiLot.description ?? '',
            lotAmenities: apiLot.amenities?.map(a => a.name) ?? [],
            campsiteAmenities: [],
            isAvailable: apiLot.isActive,
            imageUrl: apiLot.imageUrl ?? undefined,
            images: apiLot.images?.map(img => ({
                id: img.id,
                url: img.url,
                altText: img.altText,
                displayOrder: img.displayOrder,
                isPrimary: img.isPrimary,
            })),
        };
    },

    async updateLot(lotId: string, data: UpdateLotRequest): Promise<Lot> {
        const endpoint = `/owner/lots/${lotId}`;
        const startTime = performance.now();

        log.info('Updating lot', { endpoint, lotId });

        const token = localStorage.getItem('token');
        if (!token) {
            log.error('No auth token found', undefined, { endpoint });
            metrics.record({
                endpoint,
                method: 'PUT',
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
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });
        } catch (error) {
            const durationMs = performance.now() - startTime;
            log.error('Network error during fetch', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'PUT',
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
                method: 'PUT',
                durationMs,
                status: 'error',
                statusCode: response.status,
                errorType: 'API_ERROR',
            });

            if (response.status === 401) {
                throw new AuthenticationError('Session expired. Please sign in again.');
            }
            if (response.status === 400) {
                throw new ApiError('Invalid lot data. Please check your input.', 400, { errorBody });
            }
            if (response.status === 404) {
                throw new ApiError('Lot not found.', 404);
            }
            if (response.status >= 500) {
                throw new ApiError('Server error. Please try again later.', response.status, { errorBody });
            }

            throw new ApiError(
                `Failed to update lot: ${response.statusText}`,
                response.status,
                { errorBody }
            );
        }

        let apiLot: LotApiResponse;
        try {
            apiLot = await response.json();
            log.debug('API response received', { lotId: apiLot.id });
        } catch (error) {
            log.error('Failed to parse API response', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'PUT',
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
            method: 'PUT',
            durationMs,
            status: 'success',
            statusCode: response.status,
        });

        log.info('Lot updated successfully', {
            durationMs: Math.round(durationMs),
            lotId: apiLot.id,
        });

        return {
            id: String(apiLot.id),
            ownerId: String(apiLot.ownerId),
            name: apiLot.name,
            type: apiLot.lotType.toLowerCase().replace('_', '-') as Lot['type'],
            pricePerNight: apiLot.pricePerNight,
            description: apiLot.description ?? '',
            lotAmenities: apiLot.amenities?.map(a => a.name) ?? [],
            campsiteAmenities: [],
            isAvailable: apiLot.isActive,
            imageUrl: apiLot.imageUrl ?? undefined,
            images: apiLot.images?.map(img => ({
                id: img.id,
                url: img.url,
                altText: img.altText,
                displayOrder: img.displayOrder,
                isPrimary: img.isPrimary,
            })),
        };
    },

    async deleteLot(lotId: string): Promise<void> {
        const endpoint = `/owner/lots/${lotId}`;
        const startTime = performance.now();

        log.info('Deleting lot', { endpoint, lotId });

        const token = localStorage.getItem('token');
        if (!token) {
            log.error('No auth token found', undefined, { endpoint });
            metrics.record({
                endpoint,
                method: 'DELETE',
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
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
        } catch (error) {
            const durationMs = performance.now() - startTime;
            log.error('Network error during fetch', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'DELETE',
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
                method: 'DELETE',
                durationMs,
                status: 'error',
                statusCode: response.status,
                errorType: 'API_ERROR',
            });

            if (response.status === 401) {
                throw new AuthenticationError('Session expired. Please sign in again.');
            }
            if (response.status === 400) {
                throw new ApiError('Cannot delete lot with active bookings.', 400, { errorBody });
            }
            if (response.status === 404) {
                throw new ApiError('Lot not found.', 404);
            }
            if (response.status >= 500) {
                throw new ApiError('Server error. Please try again later.', response.status, { errorBody });
            }

            throw new ApiError(
                `Failed to delete lot: ${response.statusText}`,
                response.status,
                { errorBody }
            );
        }

        metrics.record({
            endpoint,
            method: 'DELETE',
            durationMs,
            status: 'success',
            statusCode: response.status,
        });

        log.info('Lot deleted successfully', {
            durationMs: Math.round(durationMs),
            lotId,
        });
    },

    async getLotsDetail(_ownerId: string): Promise<LotsDetailResponse> {
        const endpoint = '/owner/analytics/lots';
        const startTime = performance.now();

        log.info('Fetching lots detail analytics', { endpoint });

        const token = localStorage.getItem('token');
        if (!token) {
            log.error('No auth token found', undefined, { endpoint });
            metrics.record({
                endpoint,
                method: 'GET',
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
                headers: getAuthHeaders(),
            });
        } catch (error) {
            const durationMs = performance.now() - startTime;
            log.error('Network error during fetch', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'GET',
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
            metrics.record({
                endpoint,
                method: 'GET',
                durationMs,
                status: 'error',
                statusCode: response.status,
                errorType: 'API_ERROR',
            });

            if (response.status === 401) {
                throw new AuthenticationError('Session expired. Please sign in again.');
            }
            throw new ApiError(`Failed to fetch lots analytics: ${response.statusText}`, response.status);
        }

        const data: LotsDetailResponse = await response.json();

        metrics.record({
            endpoint,
            method: 'GET',
            durationMs,
            status: 'success',
            statusCode: response.status,
        });

        log.info('Lots detail analytics fetched successfully', { durationMs: Math.round(durationMs) });

        return data;
    },

    async getBookingsDetail(_ownerId: string): Promise<BookingsDetailResponse> {
        const endpoint = '/owner/analytics/bookings';
        const startTime = performance.now();

        log.info('Fetching bookings detail analytics', { endpoint });

        const token = localStorage.getItem('token');
        if (!token) {
            log.error('No auth token found', undefined, { endpoint });
            metrics.record({
                endpoint,
                method: 'GET',
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
                headers: getAuthHeaders(),
            });
        } catch (error) {
            const durationMs = performance.now() - startTime;
            log.error('Network error during fetch', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'GET',
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
            metrics.record({
                endpoint,
                method: 'GET',
                durationMs,
                status: 'error',
                statusCode: response.status,
                errorType: 'API_ERROR',
            });

            if (response.status === 401) {
                throw new AuthenticationError('Session expired. Please sign in again.');
            }
            throw new ApiError(`Failed to fetch bookings analytics: ${response.statusText}`, response.status);
        }

        const data: BookingsDetailResponse = await response.json();

        metrics.record({
            endpoint,
            method: 'GET',
            durationMs,
            status: 'success',
            statusCode: response.status,
        });

        log.info('Bookings detail analytics fetched successfully', { durationMs: Math.round(durationMs) });

        return data;
    },

    async getRevenueDetail(_ownerId: string): Promise<RevenueDetailResponse> {
        const endpoint = '/owner/analytics/revenue';
        const startTime = performance.now();

        log.info('Fetching revenue detail analytics', { endpoint });

        const token = localStorage.getItem('token');
        if (!token) {
            log.error('No auth token found', undefined, { endpoint });
            metrics.record({
                endpoint,
                method: 'GET',
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
                headers: getAuthHeaders(),
            });
        } catch (error) {
            const durationMs = performance.now() - startTime;
            log.error('Network error during fetch', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'GET',
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
            metrics.record({
                endpoint,
                method: 'GET',
                durationMs,
                status: 'error',
                statusCode: response.status,
                errorType: 'API_ERROR',
            });

            if (response.status === 401) {
                throw new AuthenticationError('Session expired. Please sign in again.');
            }
            throw new ApiError(`Failed to fetch revenue analytics: ${response.statusText}`, response.status);
        }

        const data: RevenueDetailResponse = await response.json();

        metrics.record({
            endpoint,
            method: 'GET',
            durationMs,
            status: 'success',
            statusCode: response.status,
        });

        log.info('Revenue detail analytics fetched successfully', { durationMs: Math.round(durationMs) });

        return data;
    },

    async getOccupancyDetail(_ownerId: string): Promise<OccupancyDetailResponse> {
        const endpoint = '/owner/analytics/occupancy';
        const startTime = performance.now();

        log.info('Fetching occupancy detail analytics', { endpoint });

        const token = localStorage.getItem('token');
        if (!token) {
            log.error('No auth token found', undefined, { endpoint });
            metrics.record({
                endpoint,
                method: 'GET',
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
                headers: getAuthHeaders(),
            });
        } catch (error) {
            const durationMs = performance.now() - startTime;
            log.error('Network error during fetch', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'GET',
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
            metrics.record({
                endpoint,
                method: 'GET',
                durationMs,
                status: 'error',
                statusCode: response.status,
                errorType: 'API_ERROR',
            });

            if (response.status === 401) {
                throw new AuthenticationError('Session expired. Please sign in again.');
            }
            throw new ApiError(`Failed to fetch occupancy analytics: ${response.statusText}`, response.status);
        }

        const data: OccupancyDetailResponse = await response.json();

        metrics.record({
            endpoint,
            method: 'GET',
            durationMs,
            status: 'success',
            statusCode: response.status,
        });

        log.info('Occupancy detail analytics fetched successfully', { durationMs: Math.round(durationMs) });

        return data;
    },

    async purchaseFeatured(duration: '7_DAYS' | '30_DAYS'): Promise<{ checkoutUrl: string }> {
        const endpoint = '/owner/featured/purchase';
        const startTime = performance.now();

        log.info('Initiating featured promotion purchase', { endpoint, duration });

        const token = localStorage.getItem('token');
        if (!token) {
            log.error('No auth token found', undefined, { endpoint });
            metrics.record({
                endpoint,
                method: 'POST',
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
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ duration }),
            });
        } catch (error) {
            const durationMs = performance.now() - startTime;
            log.error('Network error during fetch', error, { endpoint, durationMs });
            metrics.record({
                endpoint,
                method: 'POST',
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
                // Ignore
            }

            metrics.record({
                endpoint,
                method: 'POST',
                durationMs,
                status: 'error',
                statusCode: response.status,
                errorType: 'API_ERROR',
            });

            if (response.status === 401) {
                throw new AuthenticationError('Session expired. Please sign in again.');
            }
            if (response.status === 400) {
                throw new ApiError('Invalid duration. Please select 7 days or 30 days.', 400, { errorBody });
            }
            throw new ApiError(`Failed to initiate featured purchase: ${response.statusText}`, response.status, { errorBody });
        }

        const data: { checkoutUrl: string } = await response.json();

        metrics.record({
            endpoint,
            method: 'POST',
            durationMs,
            status: 'success',
            statusCode: response.status,
        });

        log.info('Featured promotion checkout created successfully', { durationMs: Math.round(durationMs) });

        return data;
    },

    async checkInBooking(bookingId: string): Promise<Booking> {
        const endpoint = `/owner/bookings/${bookingId}/check-in`;

        log.info('Checking in booking', { endpoint, bookingId });

        const token = localStorage.getItem('token');
        if (!token) {
            throw new AuthenticationError('No authentication token found. Please sign in.');
        }

        let response: Response;
        try {
            response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
            });
        } catch (error) {
            log.error('Network error', error, { endpoint });
            throw new NetworkError('Unable to connect to server');
        }

        if (!response.ok) {
            if (response.status === 401) throw new AuthenticationError();
            throw new ApiError(`Failed to check in booking: ${response.statusText}`, response.status);
        }

        const apiBooking: BookingApiResponse = await response.json();

        return {
            id: String(apiBooking.id),
            userId: String(apiBooking.userId),
            userName: apiBooking.userName,
            lotId: String(apiBooking.lotId),
            lotName: apiBooking.lotName,
            startDate: apiBooking.checkInDate,
            endDate: apiBooking.checkOutDate,
            status: apiBooking.status.toLowerCase() as Booking['status'],
            totalPrice: apiBooking.totalPrice,
            details: apiBooking.specialRequests ?? undefined,
        };
    },

    async checkOutBooking(bookingId: string): Promise<Booking> {
        const endpoint = `/owner/bookings/${bookingId}/check-out`;

        log.info('Checking out booking', { endpoint, bookingId });

        const token = localStorage.getItem('token');
        if (!token) {
            throw new AuthenticationError('No authentication token found. Please sign in.');
        }

        let response: Response;
        try {
            response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
            });
        } catch (error) {
            log.error('Network error', error, { endpoint });
            throw new NetworkError('Unable to connect to server');
        }

        if (!response.ok) {
            if (response.status === 401) throw new AuthenticationError();
            throw new ApiError(`Failed to check out booking: ${response.statusText}`, response.status);
        }

        const apiBooking: BookingApiResponse = await response.json();

        return {
            id: String(apiBooking.id),
            userId: String(apiBooking.userId),
            userName: apiBooking.userName,
            lotId: String(apiBooking.lotId),
            lotName: apiBooking.lotName,
            startDate: apiBooking.checkInDate,
            endDate: apiBooking.checkOutDate,
            status: apiBooking.status.toLowerCase() as Booking['status'],
            totalPrice: apiBooking.totalPrice,
            details: apiBooking.specialRequests ?? undefined,
        };
    },

    async confirmBooking(bookingId: string): Promise<Booking> {
        const endpoint = `/bookings/${bookingId}/confirm`;

        log.info('Confirming booking', { endpoint, bookingId });

        const token = localStorage.getItem('token');
        if (!token) {
            log.error('No auth token found', undefined, { endpoint });
            throw new AuthenticationError('No authentication token found. Please sign in.');
        }

        let response: Response;
        try {
            response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
            });
        } catch (error) {
            log.error('Network error', error, { endpoint });
            throw new NetworkError('Unable to connect to server');
        }

        if (!response.ok) {
            if (response.status === 401) throw new AuthenticationError();
            throw new ApiError(`Failed to confirm booking: ${response.statusText}`, response.status);
        }

        const apiBooking: BookingApiResponse = await response.json();

        return {
            id: String(apiBooking.id),
            userId: String(apiBooking.userId),
            userName: apiBooking.userName,
            lotId: String(apiBooking.lotId),
            lotName: apiBooking.lotName,
            startDate: apiBooking.checkInDate,
            endDate: apiBooking.checkOutDate,
            status: apiBooking.status.toLowerCase() as Booking['status'],
            totalPrice: apiBooking.totalPrice,
            details: apiBooking.specialRequests ?? undefined,
        };
    },

    async cancelBooking(bookingId: string): Promise<Booking> {
        const endpoint = `/bookings/${bookingId}/cancel`;

        log.info('Cancelling booking', { endpoint, bookingId });

        const token = localStorage.getItem('token');
        if (!token) {
            log.error('No auth token found', undefined, { endpoint });
            throw new AuthenticationError('No authentication token found. Please sign in.');
        }

        let response: Response;
        try {
            response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: getAuthHeaders(),
            });
        } catch (error) {
            log.error('Network error', error, { endpoint });
            throw new NetworkError('Unable to connect to server');
        }

        if (!response.ok) {
            if (response.status === 401) throw new AuthenticationError();
            throw new ApiError(`Failed to cancel booking: ${response.statusText}`, response.status);
        }

        const apiBooking: BookingApiResponse = await response.json();

        return {
            id: String(apiBooking.id),
            userId: String(apiBooking.userId),
            userName: apiBooking.userName,
            lotId: String(apiBooking.lotId),
            lotName: apiBooking.lotName,
            startDate: apiBooking.checkInDate,
            endDate: apiBooking.checkOutDate,
            status: apiBooking.status.toLowerCase() as Booking['status'],
            totalPrice: apiBooking.totalPrice,
            details: apiBooking.specialRequests ?? undefined,
        };
    },

    // --- Blocked Periods ---

    async getBlockedPeriods(): Promise<BlockedPeriod[]> {
        const endpoint = '/owner/blocked-periods';
        const response = await fetch(`${API_BASE}${endpoint}`, { headers: getAuthHeaders() });
        if (!response.ok) {
            if (response.status === 401) throw new AuthenticationError();
            throw new ApiError(`Failed to fetch blocked periods`, response.status);
        }
        const data: Array<{ id: number; lotId: number; lotName: string; startDate: string; endDate: string; reason: string | null; createdAt: string }> = await response.json();
        return data.map(bp => ({
            id: String(bp.id),
            lotId: String(bp.lotId),
            lotName: bp.lotName,
            startDate: bp.startDate,
            endDate: bp.endDate,
            reason: bp.reason ?? undefined,
            createdAt: bp.createdAt,
        }));
    },

    async createBlockedPeriod(data: CreateBlockedPeriodRequest): Promise<BlockedPeriod> {
        const endpoint = '/owner/blocked-periods';
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            if (response.status === 401) throw new AuthenticationError();
            const errorBody = await response.text().catch(() => '');
            throw new ApiError(errorBody || `Failed to create blocked period`, response.status);
        }
        const bp: { id: number; lotId: number; lotName: string; startDate: string; endDate: string; reason: string | null; createdAt: string } = await response.json();
        return {
            id: String(bp.id),
            lotId: String(bp.lotId),
            lotName: bp.lotName,
            startDate: bp.startDate,
            endDate: bp.endDate,
            reason: bp.reason ?? undefined,
            createdAt: bp.createdAt,
        };
    },

    async deleteBlockedPeriod(id: string): Promise<void> {
        const endpoint = `/owner/blocked-periods/${id}`;
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            if (response.status === 401) throw new AuthenticationError();
            throw new ApiError(`Failed to delete blocked period`, response.status);
        }
    },

    // --- Seasonal Pricing Rules ---

    async getPricingRules(): Promise<SeasonalPricingRule[]> {
        const endpoint = '/owner/pricing-rules';
        const response = await fetch(`${API_BASE}${endpoint}`, { headers: getAuthHeaders() });
        if (!response.ok) {
            if (response.status === 401) throw new AuthenticationError();
            throw new ApiError(`Failed to fetch pricing rules`, response.status);
        }
        const data: Array<{ id: number; lotType: string; name: string; startDate: string; endDate: string; pricePerNight: number; createdAt: string }> = await response.json();
        return data.map(rule => ({
            id: String(rule.id),
            lotType: rule.lotType.toLowerCase().replace('_', '-'),
            name: rule.name,
            startDate: rule.startDate,
            endDate: rule.endDate,
            pricePerNight: rule.pricePerNight,
            createdAt: rule.createdAt,
        }));
    },

    async createPricingRule(data: CreateSeasonalPricingRuleRequest): Promise<SeasonalPricingRule> {
        const endpoint = '/owner/pricing-rules';
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                ...data,
                lotType: data.lotType.toUpperCase().replace('-', '_'),
            }),
        });
        if (!response.ok) {
            if (response.status === 401) throw new AuthenticationError();
            const errorBody = await response.text().catch(() => '');
            throw new ApiError(errorBody || `Failed to create pricing rule`, response.status);
        }
        const rule: { id: number; lotType: string; name: string; startDate: string; endDate: string; pricePerNight: number; createdAt: string } = await response.json();
        return {
            id: String(rule.id),
            lotType: rule.lotType.toLowerCase().replace('_', '-'),
            name: rule.name,
            startDate: rule.startDate,
            endDate: rule.endDate,
            pricePerNight: rule.pricePerNight,
            createdAt: rule.createdAt,
        };
    },

    async deletePricingRule(id: string): Promise<void> {
        const endpoint = `/owner/pricing-rules/${id}`;
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            if (response.status === 401) throw new AuthenticationError();
            throw new ApiError(`Failed to delete pricing rule`, response.status);
        }
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
        const endpoint = '/owner/bookings';
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            if (response.status === 401) throw new AuthenticationError();
            const errorBody = await response.text().catch(() => '');
            throw new ApiError(errorBody || `Failed to create manual booking`, response.status);
        }
        const apiBooking: BookingApiResponse = await response.json();
        return {
            id: String(apiBooking.id),
            userId: String(apiBooking.userId ?? ''),
            userName: apiBooking.userName,
            lotId: String(apiBooking.lotId),
            lotName: apiBooking.lotName,
            startDate: apiBooking.checkInDate,
            endDate: apiBooking.checkOutDate,
            status: apiBooking.status.toLowerCase() as Booking['status'],
            totalPrice: apiBooking.totalPrice,
            details: apiBooking.specialRequests ?? undefined,
            guestName: apiBooking.guestName ?? undefined,
            guestEmail: apiBooking.guestEmail ?? undefined,
            guestPhone: apiBooking.guestPhone ?? undefined,
            bookingSource: apiBooking.bookingSource ?? undefined,
        };
    },
};
