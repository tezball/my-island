export interface Booking {
    id: string;
    userId: string;
    userName: string;
    lotId: string;
    lotName: string;
    startDate: string;
    endDate: string;
    status: 'confirmed' | 'pending' | 'cancelled' | 'checked_in' | 'completed';
    totalPrice: number;
    details?: string; // For extras like Power, etc.
}

export interface Lot {
    id: string;
    ownerId?: string; // Optional for backward compatibility with existing mocks
    name: string;
    type: 'tent' | 'rv' | 'cabin' | 'lodge' | 'mobile-home';
    pricePerNight: number;
    description: string;
    lotAmenities: string[];       // Specific to this pitch/unit (e.g., Electric Hookup, Private Fire Pit)
    campsiteAmenities: string[];  // Shared facilities available to guests (e.g., Free Showers, WiFi)
    isAvailable: boolean;
    imageUrl?: string;
}

export interface RevenueByType {
    type: Lot['type'];
    revenue: number;
    bookingCount: number;
}

export interface MonthlyRevenue {
    month: string; // e.g., "Jan 2026"
    revenue: number;
}

export interface DashboardStats {
    totalRevenue: number;
    pendingRevenue: number;
    activeBookings: number;
    occupancyRate: number;
    recentBookings: Booking[];
    revenueByType: RevenueByType[];
    monthlyRevenue: MonthlyRevenue[];
    todayCheckIns: number;
    todayCheckOuts: number;
    pendingBookings: number;
}

import { MOCK_DB } from './mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Parse DD/MM/YYYY date format
const parseDate = (dateStr: string): Date => {
    if (dateStr.includes('/')) {
        const [d, m, y] = dateStr.split('/').map(Number);
        return new Date(y, m - 1, d);
    }
    return new Date(dateStr);
};

export const adminService = {
    async getDashboardStats(): Promise<DashboardStats> {
        await delay(500);

        const confirmedBookings = MOCK_DB.bookings.filter(b =>
            b.status === 'confirmed' || b.status === 'checked_in' || b.status === 'completed'
        );
        const pendingBookings = MOCK_DB.bookings.filter(b => b.status === 'pending');

        const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
        const pendingRevenue = pendingBookings.reduce((sum, b) => sum + b.totalPrice, 0);

        // Calculate revenue by accommodation type
        const lotTypeMap = new Map<string, Lot['type']>();
        MOCK_DB.lots.forEach(lot => {
            lotTypeMap.set(lot.id, lot.type);
        });

        const revenueByTypeMap = new Map<Lot['type'], { revenue: number; count: number }>();
        confirmedBookings.forEach(booking => {
            const lotType = lotTypeMap.get(booking.lotId) || 'tent';
            const current = revenueByTypeMap.get(lotType) || { revenue: 0, count: 0 };
            revenueByTypeMap.set(lotType, {
                revenue: current.revenue + booking.totalPrice,
                count: current.count + 1
            });
        });

        const revenueByType: RevenueByType[] = Array.from(revenueByTypeMap.entries()).map(([type, data]) => ({
            type,
            revenue: data.revenue,
            bookingCount: data.count
        })).sort((a, b) => b.revenue - a.revenue);

        // Calculate monthly revenue (last 6 months)
        const monthlyRevenueMap = new Map<string, number>();
        const now = new Date();

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
            monthlyRevenueMap.set(key, 0);
        }

        confirmedBookings.forEach(booking => {
            const bookingDate = parseDate(booking.startDate);
            const key = bookingDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
            if (monthlyRevenueMap.has(key)) {
                monthlyRevenueMap.set(key, (monthlyRevenueMap.get(key) || 0) + booking.totalPrice);
            }
        });

        const monthlyRevenue: MonthlyRevenue[] = Array.from(monthlyRevenueMap.entries()).map(([month, revenue]) => ({
            month,
            revenue
        }));

        // Calculate today's check-ins and check-outs
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayCheckIns = MOCK_DB.bookings.filter(b => {
            const start = parseDate(b.startDate);
            start.setHours(0, 0, 0, 0);
            return start.getTime() === today.getTime() && b.status === 'confirmed';
        }).length;

        const todayCheckOuts = MOCK_DB.bookings.filter(b => {
            const end = parseDate(b.endDate);
            end.setHours(0, 0, 0, 0);
            return end.getTime() === today.getTime() &&
                   (b.status === 'confirmed' || b.status === 'checked_in');
        }).length;

        return {
            totalRevenue,
            pendingRevenue,
            activeBookings: MOCK_DB.bookings.filter(b => b.status === 'confirmed' || b.status === 'checked_in').length,
            occupancyRate: 65,
            recentBookings: MOCK_DB.bookings.slice(0, 5),
            revenueByType,
            monthlyRevenue,
            todayCheckIns,
            todayCheckOuts,
            pendingBookings: pendingBookings.length
        };
    },

    async getBookings(): Promise<Booking[]> {
        await delay(600);
        return [...MOCK_DB.bookings];
    },

    async updateBookingStatus(id: string, status: Booking['status']): Promise<void> {
        await delay(400);
        const booking = MOCK_DB.bookings.find(b => b.id === id);
        if (booking) {
            booking.status = status;
        }
    },

    async getLots(userId?: string): Promise<Lot[]> {
        await delay(500);
        if (userId) {
            return MOCK_DB.lots.filter(lot => lot.ownerId === userId || !lot.ownerId);
        }
        return [...MOCK_DB.lots];
    },

    async addLot(lot: Omit<Lot, 'id'>): Promise<Lot> {
        await delay(800);
        const newLot = { ...lot, id: Math.random().toString(36).substr(2, 9) };
        MOCK_DB.lots.push(newLot);
        return newLot;
    },

    async updateLot(id: string, updates: Partial<Lot>): Promise<void> {
        await delay(600);
        const index = MOCK_DB.lots.findIndex(l => l.id === id);
        if (index !== -1) {
            MOCK_DB.lots[index] = { ...MOCK_DB.lots[index], ...updates };
        }
    },

    async deleteLot(id: string): Promise<void> {
        await delay(400);
        const index = MOCK_DB.lots.findIndex(l => l.id === id);
        if (index !== -1) {
            MOCK_DB.lots.splice(index, 1);
        }
    },

    // Bulk operations
    async updateLotsAvailability(ids: string[], isAvailable: boolean): Promise<void> {
        await delay(500);
        ids.forEach(id => {
            const lot = MOCK_DB.lots.find(l => l.id === id);
            if (lot) {
                lot.isAvailable = isAvailable;
            }
        });
    },

    async deleteLots(ids: string[]): Promise<void> {
        await delay(600);
        ids.forEach(id => {
            const index = MOCK_DB.lots.findIndex(l => l.id === id);
            if (index !== -1) {
                MOCK_DB.lots.splice(index, 1);
            }
        });
    }
};
