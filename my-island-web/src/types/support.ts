export type TicketCategory = 'GENERAL' | 'BILLING' | 'TECHNICAL' | 'ACCOUNT' | 'BOOKING' | 'OTHER';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface SupportTicket {
    id: string;
    userId: string;
    userName: string;
    subject: string;
    description: string;
    category: TicketCategory;
    status: TicketStatus;
    priority: TicketPriority;
    relatedBookingId: string | null;
    assignedAdminId: string | null;
    assignedAdminName: string | null;
    messageCount: number;
    lastMessageAt: string;
    closedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface SupportTicketMessage {
    id: string;
    ticketId: string;
    senderId: string;
    senderName: string;
    isAdmin: boolean;
    content: string;
    createdAt: string;
}

export interface CreateTicketRequest {
    subject: string;
    description: string;
    category?: TicketCategory;
    relatedBookingId?: number;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}
