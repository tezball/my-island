import { apiRequest } from './apiClient';

export const savedService = {
    async getSavedLotIds(): Promise<string[]> {
        const ids = await apiRequest<number[]>('/saved');
        return ids.map(String);
    },

    async saveLot(lotId: string): Promise<void> {
        await apiRequest<void>(`/saved/${lotId}`, { method: 'POST' });
    },

    async unsaveLot(lotId: string): Promise<void> {
        await apiRequest<void>(`/saved/${lotId}`, { method: 'DELETE' });
    },

    async bulkSaveLots(lotIds: string[]): Promise<void> {
        if (lotIds.length === 0) return;
        await apiRequest<void>('/saved/bulk', {
            method: 'POST',
            body: lotIds.map(Number),
        });
    },
};
