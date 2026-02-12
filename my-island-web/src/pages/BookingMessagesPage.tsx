import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookingConversation } from '../components/booking/BookingConversation';

export const BookingMessagesPage: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();

    if (!bookingId) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-500">Booking not found</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-background-dark">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2632]">
                <Link
                    to="/trips"
                    className="p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <span className="material-symbols-outlined text-[#111418] dark:text-white">arrow_back</span>
                </Link>
                <div>
                    <h1 className="text-lg font-semibold text-[#111418] dark:text-white">Messages</h1>
                    <p className="text-xs text-gray-500">Booking #{bookingId}</p>
                </div>
            </div>

            {/* Conversation */}
            <div className="flex-1 overflow-hidden">
                <BookingConversation bookingId={bookingId} />
            </div>
        </div>
    );
};
