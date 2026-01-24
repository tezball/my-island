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
        // ============================================
        // PAST BOOKINGS (June 2025 - January 2026)
        // ============================================

        // June 2025 - Early summer season
        {
            id: 'b-nv-001',
            userId: 'u-murphy-sean',
            userName: 'Seán Murphy',
            lotId: 'nv1',
            lotName: 'Scenic Tent Spot',
            startDate: '06/06/2025',
            endDate: '08/06/2025',
            status: 'confirmed',
            totalPrice: 60,
            details: 'Bank holiday weekend'
        },
        {
            id: 'b-nv-002',
            userId: 'u-obrien-family',
            userName: "The O'Brien Family",
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '14/06/2025',
            endDate: '21/06/2025',
            status: 'confirmed',
            totalPrice: 1050,
            details: '4 adults, 2 children'
        },
        {
            id: 'b-nv-003',
            userId: 'u-kelly-aoife',
            userName: 'Aoife Kelly',
            lotId: 'nv-tent-5',
            lotName: 'Tent Spot 5',
            startDate: '20/06/2025',
            endDate: '22/06/2025',
            status: 'confirmed',
            totalPrice: 54
        },
        {
            id: 'b-nv-004',
            userId: 'u-byrne-padraig',
            userName: 'Pádraig Byrne',
            lotId: 'nv2',
            lotName: 'Caravan Pitch',
            startDate: '27/06/2025',
            endDate: '04/07/2025',
            status: 'confirmed',
            totalPrice: 315,
            details: 'Touring caravan, electric hookup'
        },

        // July 2025 - Peak summer
        {
            id: 'b-nv-005',
            userId: 'u-walsh-family',
            userName: 'Walsh Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '05/07/2025',
            endDate: '12/07/2025',
            status: 'confirmed',
            totalPrice: 1050,
            details: 'Anniversary trip'
        },
        {
            id: 'b-nv-006',
            userId: 'u-ryan-ciara',
            userName: 'Ciara Ryan',
            lotId: 'nv-tent-12',
            lotName: 'Tent Spot 12',
            startDate: '10/07/2025',
            endDate: '13/07/2025',
            status: 'confirmed',
            totalPrice: 96
        },
        {
            id: 'b-nv-007',
            userId: 'u-doyle-michael',
            userName: 'Michael Doyle',
            lotId: 'nv-tent-23',
            lotName: 'Tent Spot 23',
            startDate: '11/07/2025',
            endDate: '14/07/2025',
            status: 'cancelled',
            totalPrice: 120,
            details: 'Cancelled due to weather forecast'
        },
        {
            id: 'b-nv-008',
            userId: 'u-fitzgerald-emma',
            userName: 'Emma Fitzgerald',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '15/07/2025',
            endDate: '22/07/2025',
            status: 'confirmed',
            totalPrice: 770,
            details: 'Extended family gathering'
        },
        {
            id: 'b-nv-009',
            userId: 'u-mccarthy-liam',
            userName: 'Liam McCarthy',
            lotId: 'nv-tent-8',
            lotName: 'Tent Spot 8',
            startDate: '18/07/2025',
            endDate: '20/07/2025',
            status: 'confirmed',
            totalPrice: 54
        },
        {
            id: 'b-nv-010',
            userId: 'u-kenny-scouts',
            userName: 'Kilkenny Scouts Group',
            lotId: 'nv-tent-1',
            lotName: 'Tent Spot 1',
            startDate: '25/07/2025',
            endDate: '28/07/2025',
            status: 'confirmed',
            totalPrice: 81,
            details: 'Group booking - 3 adjacent spots'
        },
        {
            id: 'b-nv-011',
            userId: 'u-kenny-scouts',
            userName: 'Kilkenny Scouts Group',
            lotId: 'nv-tent-2',
            lotName: 'Tent Spot 2',
            startDate: '25/07/2025',
            endDate: '28/07/2025',
            status: 'confirmed',
            totalPrice: 81
        },
        {
            id: 'b-nv-012',
            userId: 'u-kenny-scouts',
            userName: 'Kilkenny Scouts Group',
            lotId: 'nv-tent-3',
            lotName: 'Tent Spot 3',
            startDate: '25/07/2025',
            endDate: '28/07/2025',
            status: 'confirmed',
            totalPrice: 81
        },

        // August 2025 - Peak summer continues
        {
            id: 'b-nv-013',
            userId: 'u-oconnor-family',
            userName: "O'Connor Family",
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '01/08/2025',
            endDate: '08/08/2025',
            status: 'confirmed',
            totalPrice: 1050,
            details: 'Summer holidays'
        },
        {
            id: 'b-nv-014',
            userId: 'u-brennan-niamh',
            userName: 'Niamh Brennan',
            lotId: 'nv-tent-15',
            lotName: 'Tent Spot 15',
            startDate: '02/08/2025',
            endDate: '05/08/2025',
            status: 'confirmed',
            totalPrice: 99
        },
        {
            id: 'b-nv-015',
            userId: 'u-daly-patrick',
            userName: 'Patrick Daly',
            lotId: 'nv2',
            lotName: 'Caravan Pitch',
            startDate: '08/08/2025',
            endDate: '15/08/2025',
            status: 'confirmed',
            totalPrice: 315,
            details: 'Motorhome'
        },
        {
            id: 'b-nv-016',
            userId: 'u-nolan-sinead',
            userName: 'Sinéad Nolan',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '10/08/2025',
            endDate: '17/08/2025',
            status: 'confirmed',
            totalPrice: 770
        },
        {
            id: 'b-nv-017',
            userId: 'u-kavanagh-oisin',
            userName: 'Oisín Kavanagh',
            lotId: 'nv-tent-25',
            lotName: 'Tent Spot 25',
            startDate: '15/08/2025',
            endDate: '17/08/2025',
            status: 'confirmed',
            totalPrice: 80,
            details: 'Premium riverside spot'
        },
        {
            id: 'b-nv-018',
            userId: 'u-power-family',
            userName: 'Power Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '22/08/2025',
            endDate: '29/08/2025',
            status: 'confirmed',
            totalPrice: 1050,
            details: 'Last week before school'
        },
        {
            id: 'b-nv-019',
            userId: 'u-dunne-roisin',
            userName: 'Róisín Dunne',
            lotId: 'nv-tent-18',
            lotName: 'Tent Spot 18',
            startDate: '23/08/2025',
            endDate: '25/08/2025',
            status: 'cancelled',
            totalPrice: 66,
            details: 'Cancelled - found alternative'
        },

        // September 2025 - Autumn begins
        {
            id: 'b-nv-020',
            userId: 'u-lynch-conor',
            userName: 'Conor Lynch',
            lotId: 'nv-tent-10',
            lotName: 'Tent Spot 10',
            startDate: '05/09/2025',
            endDate: '07/09/2025',
            status: 'confirmed',
            totalPrice: 56
        },
        {
            id: 'b-nv-021',
            userId: 'u-murray-family',
            userName: 'Murray Family',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '12/09/2025',
            endDate: '14/09/2025',
            status: 'confirmed',
            totalPrice: 220,
            details: 'Weekend getaway'
        },
        {
            id: 'b-nv-022',
            userId: 'u-quinn-maeve',
            userName: 'Maeve Quinn',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '19/09/2025',
            endDate: '21/09/2025',
            status: 'confirmed',
            totalPrice: 300,
            details: 'Autumn break'
        },
        {
            id: 'b-nv-023',
            userId: 'u-moore-declan',
            userName: 'Declan Moore',
            lotId: 'nv2',
            lotName: 'Caravan Pitch',
            startDate: '26/09/2025',
            endDate: '28/09/2025',
            status: 'confirmed',
            totalPrice: 90
        },

        // October 2025 - Mid-term break
        {
            id: 'b-nv-024',
            userId: 'u-sullivan-family',
            userName: "O'Sullivan Family",
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '25/10/2025',
            endDate: '01/11/2025',
            status: 'confirmed',
            totalPrice: 1050,
            details: 'Halloween mid-term'
        },
        {
            id: 'b-nv-025',
            userId: 'u-connolly-orla',
            userName: 'Orla Connolly',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '26/10/2025',
            endDate: '29/10/2025',
            status: 'confirmed',
            totalPrice: 330
        },
        {
            id: 'b-nv-026',
            userId: 'u-reilly-cian',
            userName: 'Cian Reilly',
            lotId: 'nv-tent-6',
            lotName: 'Tent Spot 6',
            startDate: '27/10/2025',
            endDate: '29/10/2025',
            status: 'cancelled',
            totalPrice: 54,
            details: 'Cancelled - too cold for camping'
        },

        // November 2025 - Off season
        {
            id: 'b-nv-027',
            userId: 'u-oshea-brendan',
            userName: "Brendan O'Shea",
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '07/11/2025',
            endDate: '09/11/2025',
            status: 'confirmed',
            totalPrice: 300,
            details: 'Quiet weekend retreat'
        },
        {
            id: 'b-nv-028',
            userId: 'u-fleming-sarah',
            userName: 'Sarah Fleming',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '21/11/2025',
            endDate: '23/11/2025',
            status: 'confirmed',
            totalPrice: 220
        },

        // December 2025 - Winter/Christmas
        {
            id: 'b-nv-029',
            userId: 'u-healy-family',
            userName: 'Healy Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '20/12/2025',
            endDate: '27/12/2025',
            status: 'confirmed',
            totalPrice: 1050,
            details: 'Christmas week'
        },
        {
            id: 'b-nv-030',
            userId: 'u-barry-kevin',
            userName: 'Kevin Barry',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '27/12/2025',
            endDate: '02/01/2026',
            status: 'confirmed',
            totalPrice: 660,
            details: 'New Year celebration'
        },

        // January 2026 - Recent past
        {
            id: 'b-nv-031',
            userId: 'u-griffin-fiona',
            userName: 'Fiona Griffin',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '03/01/2026',
            endDate: '05/01/2026',
            status: 'confirmed',
            totalPrice: 300,
            details: 'Post-holiday getaway'
        },
        {
            id: 'b-nv-032',
            userId: 'u-hayes-tom',
            userName: 'Tom Hayes',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '10/01/2026',
            endDate: '12/01/2026',
            status: 'confirmed',
            totalPrice: 220
        },
        {
            id: 'b-nv-033',
            userId: 'u-casey-eimear',
            userName: 'Eimear Casey',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '17/01/2026',
            endDate: '19/01/2026',
            status: 'confirmed',
            totalPrice: 300,
            details: 'Writers retreat'
        },

        // ============================================
        // CURRENT BOOKINGS (Around January 24, 2026)
        // ============================================
        {
            id: 'b-nv-034',
            userId: 'u-odonovan-family',
            userName: "O'Donovan Family",
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '22/01/2026',
            endDate: '26/01/2026',
            status: 'confirmed',
            totalPrice: 600,
            details: 'Currently staying - winter break'
        },
        {
            id: 'b-nv-035',
            userId: 'u-moran-david',
            userName: 'David Moran',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '23/01/2026',
            endDate: '27/01/2026',
            status: 'confirmed',
            totalPrice: 440,
            details: 'Currently staying'
        },
        {
            id: 'b-nv-036',
            userId: 'u-foley-aisling',
            userName: 'Aisling Foley',
            lotId: 'nv2',
            lotName: 'Caravan Pitch',
            startDate: '24/01/2026',
            endDate: '26/01/2026',
            status: 'confirmed',
            totalPrice: 90,
            details: 'Checking in today'
        },

        // ============================================
        // UPCOMING BOOKINGS (January 2026 - August 2026)
        // ============================================

        // Late January / February 2026
        {
            id: 'b-nv-037',
            userId: 'u-carroll-siobhan',
            userName: 'Siobhán Carroll',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '31/01/2026',
            endDate: '02/02/2026',
            status: 'confirmed',
            totalPrice: 300
        },
        {
            id: 'b-nv-038',
            userId: 'u-kennedy-brian',
            userName: 'Brian Kennedy',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '07/02/2026',
            endDate: '09/02/2026',
            status: 'confirmed',
            totalPrice: 220
        },
        {
            id: 'b-nv-039',
            userId: 'u-gallagher-family',
            userName: 'Gallagher Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '14/02/2026',
            endDate: '16/02/2026',
            status: 'confirmed',
            totalPrice: 300,
            details: "Valentine's weekend"
        },
        {
            id: 'b-nv-040',
            userId: 'u-walsh-eoin',
            userName: 'Eoin Walsh',
            lotId: 'nv2',
            lotName: 'Caravan Pitch',
            startDate: '20/02/2026',
            endDate: '22/02/2026',
            status: 'pending',
            totalPrice: 90
        },
        {
            id: 'b-nv-041',
            userId: 'u-mcgrath-family',
            userName: 'McGrath Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '21/02/2026',
            endDate: '28/02/2026',
            status: 'confirmed',
            totalPrice: 1050,
            details: 'February mid-term'
        },

        // March 2026 - St. Patrick's season
        {
            id: 'b-nv-042',
            userId: 'u-sheehan-deirdre',
            userName: 'Deirdre Sheehan',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '14/03/2026',
            endDate: '18/03/2026',
            status: 'confirmed',
            totalPrice: 440,
            details: "St. Patrick's Day weekend"
        },
        {
            id: 'b-nv-043',
            userId: 'u-cleary-family',
            userName: 'Cleary Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '14/03/2026',
            endDate: '18/03/2026',
            status: 'confirmed',
            totalPrice: 600,
            details: "St. Patrick's celebration"
        },
        {
            id: 'b-nv-044',
            userId: 'u-murphy-fintan',
            userName: 'Fintan Murphy',
            lotId: 'nv-tent-24',
            lotName: 'Tent Spot 24',
            startDate: '27/03/2026',
            endDate: '29/03/2026',
            status: 'pending',
            totalPrice: 80,
            details: 'First camping trip of the year'
        },

        // April 2026 - Easter holidays
        {
            id: 'b-nv-045',
            userId: 'u-browne-family',
            userName: 'Browne Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '03/04/2026',
            endDate: '10/04/2026',
            status: 'confirmed',
            totalPrice: 1050,
            details: 'Easter holidays'
        },
        {
            id: 'b-nv-046',
            userId: 'u-duffy-grace',
            userName: 'Grace Duffy',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '04/04/2026',
            endDate: '07/04/2026',
            status: 'confirmed',
            totalPrice: 330
        },
        {
            id: 'b-nv-047',
            userId: 'u-kelly-sean',
            userName: 'Sean Kelly',
            lotId: 'nv-tent-15',
            lotName: 'Tent Spot 15',
            startDate: '10/04/2026',
            endDate: '12/04/2026',
            status: 'pending',
            totalPrice: 66
        },
        {
            id: 'b-nv-048',
            userId: 'u-obrien-nuala',
            userName: "Nuala O'Brien",
            lotId: 'nv2',
            lotName: 'Caravan Pitch',
            startDate: '17/04/2026',
            endDate: '19/04/2026',
            status: 'confirmed',
            totalPrice: 90
        },
        {
            id: 'b-nv-049',
            userId: 'u-egan-family',
            userName: 'Egan Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '24/04/2026',
            endDate: '26/04/2026',
            status: 'pending',
            totalPrice: 300
        },

        // May 2026 - Bank holidays
        {
            id: 'b-nv-050',
            userId: 'u-whelan-aoife',
            userName: 'Aoife Whelan',
            lotId: 'nv-tent-20',
            lotName: 'Tent Spot 20',
            startDate: '01/05/2026',
            endDate: '04/05/2026',
            status: 'confirmed',
            totalPrice: 99,
            details: 'May bank holiday'
        },
        {
            id: 'b-nv-051',
            userId: 'u-roche-family',
            userName: 'Roche Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '01/05/2026',
            endDate: '04/05/2026',
            status: 'confirmed',
            totalPrice: 450,
            details: 'Bank holiday weekend'
        },
        {
            id: 'b-nv-052',
            userId: 'u-kerr-colm',
            userName: 'Colm Kerr',
            lotId: 'nv2',
            lotName: 'Caravan Pitch',
            startDate: '08/05/2026',
            endDate: '10/05/2026',
            status: 'pending',
            totalPrice: 90
        },
        {
            id: 'b-nv-053',
            userId: 'u-phelan-family',
            userName: 'Phelan Family',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '15/05/2026',
            endDate: '17/05/2026',
            status: 'confirmed',
            totalPrice: 220
        },
        {
            id: 'b-nv-054',
            userId: 'u-hogan-clodagh',
            userName: 'Clodagh Hogan',
            lotId: 'nv-tent-26',
            lotName: 'Tent Spot 26',
            startDate: '22/05/2026',
            endDate: '25/05/2026',
            status: 'confirmed',
            totalPrice: 120,
            details: 'Premium spot with fire pit'
        },
        {
            id: 'b-nv-055',
            userId: 'u-ryan-family',
            userName: 'Ryan Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '29/05/2026',
            endDate: '01/06/2026',
            status: 'confirmed',
            totalPrice: 450,
            details: 'June bank holiday'
        },

        // June 2026 - Summer begins
        {
            id: 'b-nv-056',
            userId: 'u-lennon-family',
            userName: 'Lennon Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '06/06/2026',
            endDate: '13/06/2026',
            status: 'confirmed',
            totalPrice: 1050,
            details: 'Summer holidays - early booking'
        },
        {
            id: 'b-nv-057',
            userId: 'u-hurley-jack',
            userName: 'Jack Hurley',
            lotId: 'nv-tent-11',
            lotName: 'Tent Spot 11',
            startDate: '12/06/2026',
            endDate: '14/06/2026',
            status: 'pending',
            totalPrice: 66
        },
        {
            id: 'b-nv-058',
            userId: 'u-buckley-family',
            userName: 'Buckley Family',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '13/06/2026',
            endDate: '20/06/2026',
            status: 'confirmed',
            totalPrice: 770
        },
        {
            id: 'b-nv-059',
            userId: 'u-crowley-niamh',
            userName: 'Niamh Crowley',
            lotId: 'nv-tent-28',
            lotName: 'Tent Spot 28',
            startDate: '19/06/2026',
            endDate: '21/06/2026',
            status: 'confirmed',
            totalPrice: 80
        },
        {
            id: 'b-nv-060',
            userId: 'u-dillon-family',
            userName: 'Dillon Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '20/06/2026',
            endDate: '27/06/2026',
            status: 'pending',
            totalPrice: 1050
        },
        {
            id: 'b-nv-061',
            userId: 'u-hayes-cathal',
            userName: 'Cathal Hayes',
            lotId: 'nv2',
            lotName: 'Caravan Pitch',
            startDate: '26/06/2026',
            endDate: '03/07/2026',
            status: 'confirmed',
            totalPrice: 315,
            details: 'Touring Ireland'
        },

        // July 2026 - Peak summer
        {
            id: 'b-nv-062',
            userId: 'u-flynn-family',
            userName: 'Flynn Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '04/07/2026',
            endDate: '11/07/2026',
            status: 'confirmed',
            totalPrice: 1050
        },
        {
            id: 'b-nv-063',
            userId: 'u-corcoran-rachel',
            userName: 'Rachel Corcoran',
            lotId: 'nv-tent-19',
            lotName: 'Tent Spot 19',
            startDate: '10/07/2026',
            endDate: '13/07/2026',
            status: 'pending',
            totalPrice: 99
        },
        {
            id: 'b-nv-064',
            userId: 'u-keogh-family',
            userName: 'Keogh Family',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '11/07/2026',
            endDate: '18/07/2026',
            status: 'confirmed',
            totalPrice: 770
        },
        {
            id: 'b-nv-065',
            userId: 'u-sheridan-mark',
            userName: 'Mark Sheridan',
            lotId: 'nv-tent-22',
            lotName: 'Tent Spot 22',
            startDate: '17/07/2026',
            endDate: '20/07/2026',
            status: 'confirmed',
            totalPrice: 99
        },
        {
            id: 'b-nv-066',
            userId: 'u-tierney-family',
            userName: 'Tierney Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '18/07/2026',
            endDate: '25/07/2026',
            status: 'confirmed',
            totalPrice: 1050,
            details: 'Summer holiday'
        },
        {
            id: 'b-nv-067',
            userId: 'u-maguire-sorcha',
            userName: 'Sorcha Maguire',
            lotId: 'nv-tent-30',
            lotName: 'Tent Spot 30',
            startDate: '24/07/2026',
            endDate: '27/07/2026',
            status: 'pending',
            totalPrice: 135,
            details: 'Premium river view'
        },
        {
            id: 'b-nv-068',
            userId: 'u-ofarrell-family',
            userName: "O'Farrell Family",
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '25/07/2026',
            endDate: '01/08/2026',
            status: 'confirmed',
            totalPrice: 770
        },

        // August 2026 - Peak continues
        {
            id: 'b-nv-069',
            userId: 'u-geraghty-family',
            userName: 'Geraghty Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '01/08/2026',
            endDate: '08/08/2026',
            status: 'confirmed',
            totalPrice: 1050
        },
        {
            id: 'b-nv-070',
            userId: 'u-sweeney-paddy',
            userName: 'Paddy Sweeney',
            lotId: 'nv-tent-16',
            lotName: 'Tent Spot 16',
            startDate: '07/08/2026',
            endDate: '09/08/2026',
            status: 'pending',
            totalPrice: 66
        },
        {
            id: 'b-nv-071',
            userId: 'u-moloney-family',
            userName: 'Moloney Family',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '08/08/2026',
            endDate: '15/08/2026',
            status: 'confirmed',
            totalPrice: 770,
            details: 'Annual family trip'
        },
        {
            id: 'b-nv-072',
            userId: 'u-coyne-orla',
            userName: 'Orla Coyne',
            lotId: 'nv2',
            lotName: 'Caravan Pitch',
            startDate: '14/08/2026',
            endDate: '21/08/2026',
            status: 'pending',
            totalPrice: 315
        },
        {
            id: 'b-nv-073',
            userId: 'u-mullan-family',
            userName: 'Mullan Family',
            lotId: 'nv3',
            lotName: 'Wooden Lodge',
            startDate: '15/08/2026',
            endDate: '22/08/2026',
            status: 'confirmed',
            totalPrice: 1050,
            details: 'Last summer week'
        },
        {
            id: 'b-nv-074',
            userId: 'u-cusack-rory',
            userName: 'Rory Cusack',
            lotId: 'nv-tent-27',
            lotName: 'Tent Spot 27',
            startDate: '21/08/2026',
            endDate: '24/08/2026',
            status: 'confirmed',
            totalPrice: 120
        },
        {
            id: 'b-nv-075',
            userId: 'u-donnelly-family',
            userName: 'Donnelly Family',
            lotId: 'nv4',
            lotName: 'Cozy Mobile Home',
            startDate: '22/08/2026',
            endDate: '29/08/2026',
            status: 'pending',
            totalPrice: 770,
            details: 'Before school starts'
        }
    ] as Booking[]
};
