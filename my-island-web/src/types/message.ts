export interface Message {
    id: string;
    bookingId: string;
    senderId: string;
    senderName: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

export interface ConversationSummary {
    bookingId: string;
    lotName: string;
    guestName: string;
    checkInDate: string;
    checkOutDate: string;
    lastMessageContent: string;
    lastMessageSenderName: string;
    lastMessageAt: string;
    unreadCount: number;
}
