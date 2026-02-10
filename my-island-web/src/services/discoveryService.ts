import { apiRequest } from './apiClient';
import type { Poi, UserPoiVisit, VisitStats, PoiCategory, VisitStatus } from '../types/discovery';

// --- API response types (internal) ---

interface PoiApiResponse {
    id: number;
    name: string;
    description: string | null;
    category: string;
    latitude: number;
    longitude: number;
    county: string | null;
    town: string | null;
    difficulty: string | null;
    distanceKm: number | null;
    imageUrl: string | null;
    websiteUrl: string | null;
}

interface UserPoiVisitApiResponse {
    id: number;
    poiId: number;
    poiName: string;
    poiCategory: string;
    status: string;
    visitedAt: string | null;
    notes: string | null;
}

interface VisitStatsApiResponse {
    visited: number;
    planned: number;
    total: number;
}

// --- Transform functions ---

function transformPoi(api: PoiApiResponse): Poi {
    return {
        id: String(api.id),
        name: api.name,
        description: api.description,
        category: api.category as PoiCategory,
        latitude: api.latitude,
        longitude: api.longitude,
        county: api.county,
        town: api.town,
        difficulty: api.difficulty as Poi['difficulty'],
        distanceKm: api.distanceKm,
        imageUrl: api.imageUrl,
        websiteUrl: api.websiteUrl,
    };
}

function transformVisit(api: UserPoiVisitApiResponse): UserPoiVisit {
    return {
        id: String(api.id),
        poiId: String(api.poiId),
        poiName: api.poiName,
        poiCategory: api.poiCategory as PoiCategory,
        status: api.status as VisitStatus,
        visitedAt: api.visitedAt,
        notes: api.notes,
    };
}

// --- Service ---

export const discoveryService = {
    async getAllPois(): Promise<Poi[]> {
        const data = await apiRequest<PoiApiResponse[]>('/discovery/pois', { requiresAuth: false });
        return data.map(transformPoi);
    },

    async getPoisByCategory(category: PoiCategory): Promise<Poi[]> {
        const data = await apiRequest<PoiApiResponse[]>(`/discovery/pois/category/${category}`, { requiresAuth: false });
        return data.map(transformPoi);
    },

    async getUserVisits(): Promise<UserPoiVisit[]> {
        const data = await apiRequest<UserPoiVisitApiResponse[]>('/discovery/visits');
        return data.map(transformVisit);
    },

    async getVisitStats(): Promise<VisitStats> {
        const data = await apiRequest<VisitStatsApiResponse>('/discovery/visits/stats');
        return { visited: data.visited, planned: data.planned, total: data.total };
    },

    async updateVisit(poiId: string, status: VisitStatus, notes?: string): Promise<UserPoiVisit> {
        const data = await apiRequest<UserPoiVisitApiResponse>('/discovery/visits', {
            method: 'POST',
            body: { poiId: parseInt(poiId, 10), status, notes: notes || null },
        });
        return transformVisit(data);
    },

    async removeVisit(poiId: string): Promise<void> {
        await apiRequest<void>(`/discovery/visits/${poiId}`, { method: 'DELETE' });
    },
};
