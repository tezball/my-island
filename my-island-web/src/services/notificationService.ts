import { apiRequest } from './apiClient';
import type { AppNotification } from '../types/notification';

// Re-export for backward compatibility
export type { AppNotification } from '../types/notification';

interface ApiNotification {
    id: number;
    type: string;
    title: string;
    message: string;
    link: string | null;
    isRead: boolean;
    createdAt: string;
}

function transform(n: ApiNotification): AppNotification {
    return { ...n, id: String(n.id) };
}

export const notificationService = {
    async getNotifications(): Promise<AppNotification[]> {
        const data = await apiRequest<ApiNotification[]>('/notifications');
        return data.map(transform);
    },

    async getUnreadCount(): Promise<number> {
        const data = await apiRequest<{ count: number }>('/notifications/unread-count');
        return data.count;
    },

    async markAsRead(id: string): Promise<void> {
        await apiRequest<void>(`/notifications/${id}/read`, { method: 'PUT' });
    },

    async markAllRead(): Promise<void> {
        await apiRequest<void>('/notifications/read-all', { method: 'PUT' });
    },
};
