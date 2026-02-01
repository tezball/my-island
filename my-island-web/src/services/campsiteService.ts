import { MOCK_DB } from './mockData';
import type { Lot, Booking } from '../types/booking';
import type { User } from './authService';

export interface CampsiteProfile extends User {
    description?: string; // Add description if needed, or use existing mock data structure
}

export const campsiteService = {
    async getCampsiteById(id: string): Promise<CampsiteProfile | undefined> {
        // Find user who is an admin/owner
        const userRecord = MOCK_DB.users.find(u => u.userProfile.id === id);
        return userRecord?.userProfile;
    },

    async getCampsiteLots(ownerId: string): Promise<Lot[]> {
        return MOCK_DB.lots.filter(lot => lot.ownerId === ownerId);
    },

    async createBooking(booking: Omit<Booking, 'id' | 'status'>): Promise<Booking> {
        const newBooking: Booking = {
            ...booking,
            id: Math.random().toString(36).substr(2, 9),
            status: 'pending'
        };
        MOCK_DB.bookings.push(newBooking);
        return newBooking;
    },

    async getUserBookings(userId: string): Promise<Booking[]> {
        // Return bookings for the specific user, sorted by start date (newest first)
        return MOCK_DB.bookings
            .filter(booking => booking.userId === userId)
            .sort((a, b) => {
                // Parse DD/MM/YYYY format
                const parseDate = (dateStr: string) => {
                    const [d, m, y] = dateStr.split('/');
                    return new Date(`${y}-${m}-${d}`);
                };
                return parseDate(b.startDate).getTime() - parseDate(a.startDate).getTime();
            });
    }
};
