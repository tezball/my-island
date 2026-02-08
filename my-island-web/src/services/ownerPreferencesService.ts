import { apiRequest } from './apiClient';
import type { OwnerPreferences } from '../types/owner';

// Re-export for backward compatibility
export type { OwnerPreferences } from '../types/owner';

export const ownerPreferencesService = {
    async getPreferences(): Promise<OwnerPreferences> {
        return apiRequest<OwnerPreferences>('/owner/preferences');
    },

    async updatePreferences(preferences: OwnerPreferences): Promise<OwnerPreferences> {
        return apiRequest<OwnerPreferences>('/owner/preferences', {
            method: 'PUT', body: preferences,
        });
    },
};
