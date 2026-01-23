import type { Booking, Lot } from '../services/adminService';

// Centralized mock data store
// This structure mimics a backend database response

export const MOCK_DB = {
    users: [
        {
            email: 'norevalley@myisland.com',
            password: 'password',
            label: 'Nore Valley Park (Campsite Owner)',
            role: 'admin' as const,
            userProfile: {
                id: 'nore-valley-owner',
                email: 'norevalley@myisland.com',
                name: 'Nore Valley Park',
                avatarUrl: 'https://ui-avatars.com/api/?name=Nore+Valley&background=10b981&color=fff',
                role: 'admin' as const
            }
        },
        {
            email: 'admin@myisland.com',
            password: 'password',
            label: 'System Admin',
            role: 'admin' as const,
            userProfile: {
                id: 'sys-admin',
                email: 'admin@myisland.com',
                name: 'System Admin',
                avatarUrl: 'https://ui-avatars.com/api/?name=System+Admin&background=random',
                role: 'admin' as const
            }
        },
        {
            email: 'family@example.com',
            password: 'password',
            label: 'The Smith Family (Guest)',
            role: 'user' as const,
            userProfile: {
                id: 'family-camper',
                email: 'family@example.com',
                name: 'The Smith Family',
                avatarUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=150',
                role: 'user' as const
            }
        }
    ],
    lots: [
        {
            id: 'nv1',
            ownerId: 'nore-valley-owner',
            name: 'Scenic Tent Spot',
            type: 'tent',
            pricePerNight: 30,
            description: 'A beautiful spot in the peaceful valley.',
            amenities: ['Free Showers', 'Pet Farm Access', 'River Walk'],
            isAvailable: true,
            imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800'
        },
        {
            id: 'nv2',
            ownerId: 'nore-valley-owner',
            name: 'Caravan Pitch',
            type: 'rv',
            pricePerNight: 45,
            description: 'Spacious pitch with electric hookup.',
            amenities: ['Electric', 'Water', 'Pet Farm Access', 'Crazy Golf'],
            isAvailable: true,
            imageUrl: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800'
        },
        {
            id: 'nv3',
            ownerId: 'nore-valley-owner',
            name: 'Wooden Lodge',
            type: 'lodge',
            pricePerNight: 150,
            description: 'Comfortable wooden lodge for the whole family.',
            amenities: ['Kitchen', 'Heating', 'Private Deck', 'Bread Baking'],
            isAvailable: true,
            imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=800'
        },
        {
            id: 'nv4',
            ownerId: 'nore-valley-owner',
            name: 'Cozy Mobile Home',
            type: 'mobile-home',
            pricePerNight: 110,
            description: 'Fully equipped mobile home.',
            amenities: ['Kitchen', 'Shower', 'Living Area', 'Pedal Go-Karts'],
            isAvailable: false,
            imageUrl: 'https://images.unsplash.com/photo-1512918580421-b2feee3b85a6?auto=format&fit=crop&q=80&w=800'
        }
    ] as Lot[],
    bookings: [
        {
            id: 'b-nv1',
            userId: 'u-guest1',
            userName: 'Alice Adventure',
            lotId: 'nv1',
            lotName: 'Scenic Tent Spot',
            startDate: '2025-07-10',
            endDate: '2025-07-12',
            status: 'confirmed',
            totalPrice: 60
        },
        {
            id: 'b-nv2',
            userId: 'u-guest2',
            userName: 'Bob Builder',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '2025-08-01',
            endDate: '2025-08-07',
            status: 'pending',
            totalPrice: 900
        }
    ] as Booking[]
};
