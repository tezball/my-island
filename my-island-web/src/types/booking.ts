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
    type: 'tent' | 'touring' | 'glamping' | 'cabin' | 'mobile-home';
    pricePerNight: number;
    description: string;
    lotAmenities: string[];       // Specific to this pitch/unit (e.g., Electric Hookup, Private Fire Pit)
    campsiteAmenities: string[];  // Shared facilities available to guests (e.g., Free Showers, WiFi)
    isAvailable: boolean;
    imageUrl?: string;
}
