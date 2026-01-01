/**
 * Notifications API Service
 *
 * Provides API methods for notification-related operations including:
 * - List notifications
 * - Get unread count
 * - Mark as read
 * - Mark all as read
 */

import api from '../api'

// Response types
export interface NotificationResponse {
  id: string
  type: 'BOOKING' | 'REVIEW' | 'MESSAGE' | 'SYSTEM'
  title: string
  message: string
  read: boolean
  actionUrl?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface UnreadCountResponse {
  count: number
}

// Notifications API service
export const notificationsApi = {
  // List user's notifications
  list: () =>
    api.get<NotificationResponse[]>('/notifications'),

  // Get unread count
  getUnreadCount: () =>
    api.get<UnreadCountResponse>('/notifications/unread-count'),

  // Mark notification as read
  markAsRead: (id: string) =>
    api.put<void>(`/notifications/${id}/read`),

  // Mark all notifications as read
  markAllAsRead: () =>
    api.put<void>('/notifications/read-all'),
}

export default notificationsApi
