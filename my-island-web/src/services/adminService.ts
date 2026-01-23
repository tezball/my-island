export interface Booking {
    id: string;
    userId: string;
    userName: string;
    lotId: string;
    lotName: string;
    startDate: string;
    endDate: string;
    status: 'confirmed' | 'pending' | 'cancelled';
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
    amenities: string[];
    isAvailable: boolean;
    imageUrl?: string;
}

export interface DashboardStats {
    totalRevenue: number;
    activeBookings: number;
    occupancyRate: number;
    recentBookings: Booking[];
}

import { MOCK_DB } from './mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const adminService = {
    async getDashboardStats(): Promise<DashboardStats> {
        await delay(500);
        const totalRevenue = MOCK_DB.bookings
            .filter(b => b.status === 'confirmed')
            .reduce((sum, b) => sum + b.totalPrice, 0);

        return {
            totalRevenue,
            activeBookings: MOCK_DB.bookings.filter(b => b.status === 'confirmed').length,
            occupancyRate: 65, // Approximated
            recentBookings: MOCK_DB.bookings.slice(0, 5)
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
    }
};
