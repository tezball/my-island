export type PoiCategory =
    | 'TRAIL' | 'LANDMARK' | 'BEACH' | 'WATERFALL' | 'CASTLE'
    | 'MOUNTAIN' | 'LAKE' | 'ISLAND' | 'HERITAGE' | 'VIEWPOINT';

export type PoiDifficulty = 'EASY' | 'MODERATE' | 'DIFFICULT' | 'STRENUOUS';

export type VisitStatus = 'PLANNED' | 'VISITED';

export interface Poi {
    id: string;
    name: string;
    description: string | null;
    category: PoiCategory;
    latitude: number;
    longitude: number;
    county: string | null;
    town: string | null;
    difficulty: PoiDifficulty | null;
    distanceKm: number | null;
    imageUrl: string | null;
    websiteUrl: string | null;
}

export interface UserPoiVisit {
    id: string;
    poiId: string;
    poiName: string;
    poiCategory: PoiCategory;
    status: VisitStatus;
    visitedAt: string | null;
    notes: string | null;
}

export interface VisitStats {
    visited: number;
    planned: number;
    total: number;
}
