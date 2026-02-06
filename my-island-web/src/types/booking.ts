export type BookingStatus = 'pending_payment' | 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'payment_failed';
export type PaymentStatus = 'none' | 'authorized' | 'captured' | 'released' | 'refunded' | 'failed';

export interface Booking {
    id: string;
    userId: string;
    userName: string;
    lotId: string;
    lotName: string;
    startDate: string;
    endDate: string;
    status: BookingStatus;
    totalPrice: number;
    serviceFee?: number;
    chargeTotal?: number;
    paymentStatus?: PaymentStatus;
    details?: string; // For extras like Power, etc.
}

export interface PaymentIntentResponse {
    clientSecret: string;
    paymentIntentId: string;
    publishableKey: string;
    amount: number;
    devMode: boolean;
}

export interface LotImage {
    id: number;
    url: string;
    altText: string | null;
    displayOrder: number;
    isPrimary: boolean;
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
    images?: LotImage[];
}
