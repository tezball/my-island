const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export interface AppNotification {
    id: string;
    type: string;
    title: string;
    message: string;
    link: string | null;
    isRead: boolean;
    createdAt: string;
}

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
        const res = await fetch(`${API_BASE}/notifications`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data: ApiNotification[] = await res.json();
        return data.map(transform);
    },

    async getUnreadCount(): Promise<number> {
        const res = await fetch(`${API_BASE}/notifications/unread-count`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error('Failed to fetch unread count');
        const data: { count: number } = await res.json();
        return data.count;
    },

    async markAsRead(id: string): Promise<void> {
        const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
            method: 'PUT',
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to mark notification as read');
    },

    async markAllRead(): Promise<void> {
        const res = await fetch(`${API_BASE}/notifications/read-all`, {
            method: 'PUT',
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to mark all as read');
    },
};
