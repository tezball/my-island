import type { Booking, Lot } from './booking';

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

export interface OwnerPreferences {
    emailNotificationsBookings: boolean;
    weeklySummaryReports: boolean;
    instantBooking: boolean;
    allowSameDayBookings: boolean;
    requireGuestVerification: boolean;
}

// --- Lot CRUD request types ---

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

// --- Analytics types ---

export interface LotDetail {
    id: string;
    name: string;
    type: 'tent' | 'touring' | 'glamping' | 'cabin' | 'mobile-home';
    pricePerNight: number;
    isAvailable: boolean;
    amenities: string[];
}

export interface LotsDetailResponse {
    summary: {
        total: number;
        available: number;
        unavailable: number;
        byType: Record<string, number>;
    };
    lots: LotDetail[];
}

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

export interface BookingsDetailResponse {
    summary: {
        total: number;
        confirmed: number;
        pending: number;
        cancelled: number;
        checkInsThisWeek: number;
        checkOutsThisWeek: number;
    };
    bookings: BookingDetail[];
}

export interface RevenueDetailResponse {
    summary: {
        thisMonth: number;
        lastMonth: number;
        yearToDate: number;
        avgBookingValue: number;
        monthOverMonthChange: number;
    };
    monthlyTrend: Array<{ month: string; revenue: number }>;
    byType: Array<{ type: string; revenue: number; percentage: number }>;
    topLots: Array<{ name: string; type: string; revenue: number; bookings: number }>;
}

export interface OccupancyDetailResponse {
    summary: {
        currentRate: number;
        totalLots: number;
        availableLots: number;
        occupiedLots: number;
        avgStayDuration: number;
    };
    byType: Array<{ type: string; total: number; occupied: number; rate: number }>;
    weeklyTrend: Array<{ day: string; rate: number }>;
    peakDays: Array<{ day: string; avgRate: number }>;
}
