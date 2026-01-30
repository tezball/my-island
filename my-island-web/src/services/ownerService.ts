import mockOwnersData from '../data/mockOwners.json';
import { MOCK_DB } from './mockData';
import type { Lot, Booking } from './adminService';

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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory store for new owners (simulating persistence)
const createdOwners: Owner[] = [];

export const ownerService = {
    async getOwnerProfile(userId: string): Promise<Owner | null> {
        await delay(500);

        // Check mock JSON data
        const mockOwner = mockOwnersData.owners.find(o => o.userId === userId);
        if (mockOwner) {
            return mockOwner as Owner;
        }

        // Check newly created owners
        const created = createdOwners.find(o => o.userId === userId);
        return created || null;
    },

    async getDashboardData(userId: string): Promise<OwnerDashboardData> {
        await delay(600);

        const owner = await this.getOwnerProfile(userId);
        const lots = MOCK_DB.lots.filter(l => l.ownerId === userId || l.ownerId === 'nore-valley-owner');

        // Get bookings for owner's lots
        const lotIds = lots.map(l => l.id);
        const allBookings = MOCK_DB.bookings.filter(b => lotIds.includes(b.lotId));

        // Parse date helper
        const parseDate = (dateStr: string): Date => {
            if (dateStr.includes('/')) {
                const [d, m, y] = dateStr.split('/').map(Number);
                return new Date(y, m - 1, d);
            }
            return new Date(dateStr);
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        // Upcoming check-ins (next 7 days)
        const upcomingCheckIns = allBookings.filter(b => {
            const start = parseDate(b.startDate);
            return start >= today && start <= nextWeek && b.status === 'confirmed';
        }).slice(0, 5);

        // Upcoming check-outs (next 7 days)
        const upcomingCheckOuts = allBookings.filter(b => {
            const end = parseDate(b.endDate);
            return end >= today && end <= nextWeek && (b.status === 'confirmed' || b.status === 'checked_in');
        }).slice(0, 5);

        // Recent bookings
        const recentBookings = [...allBookings]
            .sort((a, b) => {
                return parseDate(b.startDate).getTime() - parseDate(a.startDate).getTime();
            })
            .slice(0, 10);

        return {
            owner,
            recentBookings,
            lots,
            upcomingCheckIns,
            upcomingCheckOuts,
        };
    },

    async getOwnerLots(userId: string): Promise<Lot[]> {
        await delay(500);
        return MOCK_DB.lots.filter(l => l.ownerId === userId || l.ownerId === 'nore-valley-owner');
    },

    async getOwnerBookings(userId: string): Promise<Booking[]> {
        await delay(500);
        const lots = await this.getOwnerLots(userId);
        const lotIds = lots.map(l => l.id);
        return MOCK_DB.bookings.filter(b => lotIds.includes(b.lotId));
    },

    async createOwnerProfile(data: {
        userId: string;
        propertyName: string;
        county: string;
        town: string;
        description: string;
        coverImageUrl: string;
        propertyType: string;
        selectedAccommodationTypes: string[];
        contactEmail?: string;
        contactPhone?: string;
    }): Promise<Owner> {
        await delay(800);

        const newOwner: Owner = {
            id: `owner-${Math.random().toString(36).substr(2, 9)}`,
            userId: data.userId,
            propertyName: data.propertyName,
            county: data.county,
            town: data.town,
            description: data.description,
            coverImageUrl: data.coverImageUrl,
            propertyType: data.propertyType,
            selectedAccommodationTypes: data.selectedAccommodationTypes,
            contactEmail: data.contactEmail || '',
            contactPhone: data.contactPhone || '',
            active: true,
            verified: false,
            createdAt: new Date().toISOString(),
            stats: {
                totalLots: 0,
                activeLots: 0,
                totalBookings: 0,
                upcomingBookings: 0,
                totalRevenue: 0,
                monthlyRevenue: 0,
                occupancyRate: 0,
            },
        };

        createdOwners.push(newOwner);
        return newOwner;
    },

    async updateOwnerProfile(ownerId: string, updates: Partial<Owner>): Promise<void> {
        await delay(600);
        const index = createdOwners.findIndex(o => o.id === ownerId);
        if (index !== -1) {
            createdOwners[index] = { ...createdOwners[index], ...updates };
        }
    },
};
