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
}

export interface Lot {
    id: string;
    name: string;
    type: 'tent' | 'rv' | 'cabin';
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

const MOCK_LOTS: Lot[] = [
    {
        id: 'l1',
        name: 'Riverside Tent Spot',
        type: 'tent',
        pricePerNight: 25,
        description: 'A beautiful spot right by the river.',
        amenities: ['Fire Pit', 'Picnic Table'],
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'l2',
        name: 'Deluxe RV Pad',
        type: 'rv',
        pricePerNight: 60,
        description: 'Full hookups with paved pad.',
        amenities: ['Electric', 'Water', 'Sewer', 'WiFi'],
        isAvailable: true,
        imageUrl: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800' // Placeholder
    },
    {
        id: 'l3',
        name: 'Forest Cabin',
        type: 'cabin',
        pricePerNight: 120,
        description: 'Cozy cabin in the woods.',
        amenities: ['Bed', 'Heating', 'Kitchenette'],
        isAvailable: false,
        imageUrl: 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?auto=format&fit=crop&q=80&w=800'
    }
];

const MOCK_BOOKINGS: Booking[] = [
    {
        id: 'b1',
        userId: 'u2',
        userName: 'John Doe',
        lotId: 'l1',
        lotName: 'Riverside Tent Spot',
        startDate: '2025-06-15',
        endDate: '2025-06-20',
        status: 'confirmed',
        totalPrice: 125
    },
    {
        id: 'b2',
        userId: 'u3',
        userName: 'Jane Smith',
        lotId: 'l3',
        lotName: 'Forest Cabin',
        startDate: '2025-07-01',
        endDate: '2025-07-05',
        status: 'pending',
        totalPrice: 480
    },
    {
        id: 'b3',
        userId: 'u4',
        userName: 'Mike Ross',
        lotId: 'l2',
        lotName: 'Deluxe RV Pad',
        startDate: '2025-06-10',
        endDate: '2025-06-12',
        status: 'cancelled',
        totalPrice: 120
    }
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const adminService = {
    async getDashboardStats(): Promise<DashboardStats> {
        await delay(500);
        const totalRevenue = MOCK_BOOKINGS
            .filter(b => b.status === 'confirmed')
            .reduce((sum, b) => sum + b.totalPrice, 0);

        return {
            totalRevenue,
            activeBookings: MOCK_BOOKINGS.filter(b => b.status === 'confirmed').length,
            occupancyRate: 75, // Mocked
            recentBookings: MOCK_BOOKINGS.slice(0, 5)
        };
    },

    async getBookings(): Promise<Booking[]> {
        await delay(600);
        return [...MOCK_BOOKINGS];
    },

    async updateBookingStatus(id: string, status: Booking['status']): Promise<void> {
        await delay(400);
        const booking = MOCK_BOOKINGS.find(b => b.id === id);
        if (booking) {
            booking.status = status;
        }
    },

    async getLots(): Promise<Lot[]> {
        await delay(500);
        return [...MOCK_LOTS];
    },

    async addLot(lot: Omit<Lot, 'id'>): Promise<Lot> {
        await delay(800);
        const newLot = { ...lot, id: Math.random().toString(36).substr(2, 9) };
        MOCK_LOTS.push(newLot);
        return newLot;
    },

    async updateLot(id: string, updates: Partial<Lot>): Promise<void> {
        await delay(600);
        const index = MOCK_LOTS.findIndex(l => l.id === id);
        if (index !== -1) {
            MOCK_LOTS[index] = { ...MOCK_LOTS[index], ...updates };
        }
    },

    async deleteLot(id: string): Promise<void> {
        await delay(400);
        const index = MOCK_LOTS.findIndex(l => l.id === id);
        if (index !== -1) {
            MOCK_LOTS.splice(index, 1);
        }
    }
};
