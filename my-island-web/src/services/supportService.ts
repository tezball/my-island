import { apiRequest } from './apiClient';
import type { SupportTicket, SupportTicketMessage, CreateTicketRequest, PageResponse } from '../types/support';

// --- API response types (numeric IDs from backend) ---

interface TicketApiResponse {
    id: number;
    userId: number;
    userName: string;
    subject: string;
    description: string;
    category: string;
    status: string;
    priority: string;
    relatedBookingId: number | null;
    assignedAdminId: number | null;
    assignedAdminName: string | null;
    messageCount: number;
    lastMessageAt: string;
    closedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

interface MessageApiResponse {
    id: number;
    ticketId: number;
    senderId: number;
    senderName: string;
    isAdmin: boolean;
    content: string;
    createdAt: string;
}

interface PageApiResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

// --- Transformers ---

function transformTicket(api: TicketApiResponse): SupportTicket {
    return {
        id: String(api.id),
        userId: String(api.userId),
        userName: api.userName,
        subject: api.subject,
        description: api.description,
        category: api.category as SupportTicket['category'],
        status: api.status as SupportTicket['status'],
        priority: api.priority as SupportTicket['priority'],
        relatedBookingId: api.relatedBookingId != null ? String(api.relatedBookingId) : null,
        assignedAdminId: api.assignedAdminId != null ? String(api.assignedAdminId) : null,
        assignedAdminName: api.assignedAdminName,
        messageCount: api.messageCount,
        lastMessageAt: api.lastMessageAt,
        closedAt: api.closedAt,
        createdAt: api.createdAt,
        updatedAt: api.updatedAt,
    };
}

function transformMessage(api: MessageApiResponse): SupportTicketMessage {
    return {
        id: String(api.id),
        ticketId: String(api.ticketId),
        senderId: String(api.senderId),
        senderName: api.senderName,
        isAdmin: api.isAdmin,
        content: api.content,
        createdAt: api.createdAt,
    };
}

function transformPage(api: PageApiResponse<TicketApiResponse>): PageResponse<SupportTicket> {
    return {
        content: api.content.map(transformTicket),
        totalElements: api.totalElements,
        totalPages: api.totalPages,
        number: api.number,
        size: api.size,
    };
}

// --- User-facing service ---

export const supportService = {
    async createTicket(request: CreateTicketRequest): Promise<SupportTicket> {
        const data = await apiRequest<TicketApiResponse>('/support/tickets', {
            method: 'POST',
            body: request,
        });
        return transformTicket(data);
    },

    async getMyTickets(page = 0, size = 20): Promise<PageResponse<SupportTicket>> {
        const data = await apiRequest<PageApiResponse<TicketApiResponse>>(`/support/tickets?page=${page}&size=${size}`);
        return transformPage(data);
    },

    async getTicket(ticketId: string): Promise<SupportTicket> {
        const data = await apiRequest<TicketApiResponse>(`/support/tickets/${ticketId}`);
        return transformTicket(data);
    },

    async getMessages(ticketId: string): Promise<SupportTicketMessage[]> {
        const data = await apiRequest<MessageApiResponse[]>(`/support/tickets/${ticketId}/messages`);
        return data.map(transformMessage);
    },

    async sendMessage(ticketId: string, content: string): Promise<SupportTicketMessage> {
        const data = await apiRequest<MessageApiResponse>(`/support/tickets/${ticketId}/messages`, {
            method: 'POST',
            body: { content },
        });
        return transformMessage(data);
    },
};

// --- Admin-facing service ---

export const adminSupportService = {
    async listTickets(status?: string, category?: string, page = 0, size = 20): Promise<PageResponse<SupportTicket>> {
        const params = new URLSearchParams();
        if (status) params.set('status', status);
        if (category) params.set('category', category);
        params.set('page', String(page));
        params.set('size', String(size));
        const data = await apiRequest<PageApiResponse<TicketApiResponse>>(`/admin/support/tickets?${params}`);
        return transformPage(data);
    },

    async getTicket(ticketId: string): Promise<SupportTicket> {
        const data = await apiRequest<TicketApiResponse>(`/admin/support/tickets/${ticketId}`);
        return transformTicket(data);
    },

    async getMessages(ticketId: string): Promise<SupportTicketMessage[]> {
        const data = await apiRequest<MessageApiResponse[]>(`/admin/support/tickets/${ticketId}/messages`);
        return data.map(transformMessage);
    },

    async sendMessage(ticketId: string, content: string): Promise<SupportTicketMessage> {
        const data = await apiRequest<MessageApiResponse>(`/admin/support/tickets/${ticketId}/messages`, {
            method: 'POST',
            body: { content },
        });
        return transformMessage(data);
    },

    async updateStatus(ticketId: string, status: string, priority?: string, assignedAdminId?: number): Promise<SupportTicket> {
        const data = await apiRequest<TicketApiResponse>(`/admin/support/tickets/${ticketId}/status`, {
            method: 'PUT',
            body: { status, priority, assignedAdminId },
        });
        return transformTicket(data);
    },

    async getStats(): Promise<Record<string, number>> {
        return apiRequest<Record<string, number>>('/admin/support/stats');
    },
};
