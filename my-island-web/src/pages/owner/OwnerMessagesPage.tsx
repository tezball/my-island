import React, { useEffect, useState } from 'react';
import { messageService } from '../../services/messageService';
import { BookingConversation } from '../../components/booking/BookingConversation';
import type { ConversationSummary } from '../../types/message';

export const OwnerMessagesPage: React.FC = () => {
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchConversations = async () => {
            try {
                const data = await messageService.getOwnerConversations();
                if (!cancelled) {
                    setConversations(data);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('Failed to fetch conversations:', err);
                    setError('Unable to load conversations. Please try again.');
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchConversations();
        return () => { cancelled = true; };
    }, []);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });
    };

    if (selectedBookingId) {
        return (
            <div className="flex flex-col h-[calc(100vh-8rem)]">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => setSelectedBookingId(null)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[#111418] dark:text-white">arrow_back</span>
                    </button>
                    <div>
                        <h2 className="text-lg font-semibold text-[#111418] dark:text-white">Conversation</h2>
                        <p className="text-xs text-gray-500">Booking #{selectedBookingId}</p>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                    <BookingConversation bookingId={selectedBookingId} />
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-red-400">error</span>
                </div>
                <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-1">Something went wrong</h3>
                <p className="text-sm text-gray-500 text-center max-w-sm mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-[#20d85f] rounded-lg transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-gray-400">chat</span>
                </div>
                <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-1">No messages yet</h3>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                    When guests send you messages about their bookings, they'll appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {conversations.map((conv) => (
                <button
                    key={conv.bookingId}
                    onClick={() => setSelectedBookingId(conv.bookingId)}
                    className="w-full text-left p-4 bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-colors"
                >
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-[#111418] dark:text-white truncate">{conv.guestName}</h3>
                                {conv.unreadCount > 0 && (
                                    <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                                        {conv.unreadCount}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">{conv.lotName} &middot; {conv.checkInDate} - {conv.checkOutDate}</p>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0 ml-2">{formatDate(conv.lastMessageAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        <span className="font-medium">{conv.lastMessageSenderName}:</span> {conv.lastMessageContent}
                    </p>
                </button>
            ))}
        </div>
    );
};
