import type { User } from './user';

export interface CampsiteProfile extends User {
    propertyName?: string;
    county?: string;
    town?: string;
    propertyType?: string;
    description?: string;
    amenities?: string[];
    lotCount?: number;
    latitude?: number | null;
    longitude?: number | null;
    isFeatured?: boolean;
    featuredUntil?: string;
    isAcceptingBookings?: boolean;
    phone?: string | null;
    website?: string | null;
    rating?: number | null;
    reviewCount?: number;
}
