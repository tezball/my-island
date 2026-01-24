import type { Booking, Lot } from '../services/adminService';

// Tent images for rotation
const TENT_IMAGES = [
    'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1563299796-17596ed6b017?auto=format&fit=crop&q=80&w=800'
];

// Generate 30 tent lots with variety
function generateTentLots(): Lot[] {
    const basicAmenities = ['Free Showers', 'Pet Farm Access'];
    const standardExtras = ['Electric Hookup', 'River Walk'];
    const premiumExtras = ['Private Fire Pit', 'River View', 'Picnic Table'];

    const descriptions = {
        basic: [
            'Cozy grass pitch perfect for small tents.',
            'Peaceful spot with easy access to facilities.',
            'Budget-friendly pitch in a quiet corner.',
            'Simple pitch ideal for solo campers or couples.'
        ],
        standard: [
            'Spacious pitch with convenient electric hookup nearby.',
            'Well-maintained spot with scenic river views.',
            'Popular pitch close to the shower block.',
            'Great location with morning sun exposure.'
        ],
        premium: [
            'Premium riverside location with private fire pit.',
            'Secluded spot with stunning valley views.',
            'Large pitch perfect for family camping.',
            'Top-rated spot with all amenities included.'
        ]
    };

    return Array.from({ length: 30 }, (_, i) => {
        const num = i + 1;
        let tier: 'basic' | 'standard' | 'premium';
        let price: number;
        let amenities: string[];

        if (num <= 10) {
            // Basic tier: spots 1-10
            tier = 'basic';
            price = 25 + Math.floor(Math.random() * 6); // €25-30
            amenities = [...basicAmenities];
        } else if (num <= 22) {
            // Standard tier: spots 11-22
            tier = 'standard';
            price = 30 + Math.floor(Math.random() * 6); // €30-35
            amenities = [...basicAmenities, standardExtras[num % 2]];
        } else {
            // Premium tier: spots 23-30
            tier = 'premium';
            price = 35 + Math.floor(Math.random() * 11); // €35-45
            amenities = [...basicAmenities, ...standardExtras, premiumExtras[num % 3]];
        }

        const descArray = descriptions[tier];
        const description = descArray[(num - 1) % descArray.length];

        return {
            id: `nv-tent-${num}`,
            ownerId: 'nore-valley-owner',
            name: `Tent Spot ${num}`,
            type: 'tent' as const,
            pricePerNight: price,
            description,
            amenities,
            isAvailable: num % 7 !== 0, // Most available, every 7th is unavailable
            imageUrl: TENT_IMAGES[(num - 1) % TENT_IMAGES.length]
        };
    });
}

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
        },
        // Add 30 generated tent lots
        ...generateTentLots()
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
