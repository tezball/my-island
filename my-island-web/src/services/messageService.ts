import { apiRequest } from './apiClient';
import type { Message, ConversationSummary } from '../types/message';

interface MessageApiResponse {
    id: number;
    bookingId: number;
    senderId: number;
    senderName: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

interface ConversationSummaryApiResponse {
    bookingId: number;
    lotName: string;
    guestName: string;
    checkInDate: string;
    checkOutDate: string;
    lastMessageContent: string;
    lastMessageSenderName: string;
    lastMessageAt: string;
    unreadCount: number;
}

function transformMessage(api: MessageApiResponse): Message {
    return {
        id: String(api.id),
        bookingId: String(api.bookingId),
        senderId: String(api.senderId),
        senderName: api.senderName,
        content: api.content,
        isRead: api.isRead,
        createdAt: api.createdAt,
    };
}

function transformConversation(api: ConversationSummaryApiResponse): ConversationSummary {
    return {
        bookingId: String(api.bookingId),
        lotName: api.lotName,
        guestName: api.guestName,
        checkInDate: api.checkInDate,
        checkOutDate: api.checkOutDate,
        lastMessageContent: api.lastMessageContent,
        lastMessageSenderName: api.lastMessageSenderName,
        lastMessageAt: api.lastMessageAt,
        unreadCount: api.unreadCount,
    };
}

export const messageService = {
    async getConversation(bookingId: string): Promise<Message[]> {
        const data = await apiRequest<MessageApiResponse[]>(`/messages/booking/${bookingId}`);
        return data.map(transformMessage);
    },

    async sendMessage(bookingId: string, content: string): Promise<Message> {
        const data = await apiRequest<MessageApiResponse>(`/messages/booking/${bookingId}`, {
            method: 'POST',
            body: { content },
        });
        return transformMessage(data);
    },

    async getUnreadCounts(): Promise<Record<string, number>> {
        const data = await apiRequest<Record<string, number>>('/messages/unread');
        // API returns numeric keys, convert to string keys
        const result: Record<string, number> = {};
        for (const [key, value] of Object.entries(data)) {
            result[String(key)] = value;
        }
        return result;
    },

    async getOwnerConversations(): Promise<ConversationSummary[]> {
        const data = await apiRequest<ConversationSummaryApiResponse[]>('/messages/owner/conversations');
        return data.map(transformConversation);
    },
};
