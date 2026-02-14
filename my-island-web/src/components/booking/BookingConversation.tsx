import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/messageService';
import type { Message } from '../../types/message';

const POLL_INTERVAL_MS = 15_000;
const MAX_MESSAGE_LENGTH = 5000;

interface BookingConversationProps {
    bookingId: string;
}

export const BookingConversation: React.FC<BookingConversationProps> = ({ bookingId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const loadMessages = useCallback(async () => {
        try {
            const data = await messageService.getConversation(bookingId);
            setMessages(data);
            setError(null);
        } catch {
            setError('Failed to load messages');
        } finally {
            setIsLoading(false);
        }
    }, [bookingId]);

    useEffect(() => {
        loadMessages();

        const interval = setInterval(() => {
            // Only poll when tab is visible
            if (document.visibilityState === 'visible') {
                loadMessages();
            }
        }, POLL_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [loadMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || isSending) return;
        setIsSending(true);
        setError(null);
        try {
            const sent = await messageService.sendMessage(bookingId, newMessage.trim());
            setMessages(prev => [...prev, sent]);
            setNewMessage('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        } catch {
            setError('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value);
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();

        const time = date.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' });

        if (isToday) return time;
        if (isYesterday) return `Yesterday ${time}`;
        return date.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' }) + ' ' + time;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {error && (
                    <div className="text-center text-sm text-red-500 py-2">{error}</div>
                )}
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <span className="material-symbols-outlined text-4xl mb-2">chat</span>
                        <p className="text-sm">Start a conversation about your booking</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isOwn = msg.senderId === user?.id;
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] ${isOwn ? 'order-2' : 'order-1'}`}>
                                    {!isOwn && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
                                            {msg.senderName}
                                        </p>
                                    )}
                                    <div
                                        className={`rounded-2xl px-4 py-2.5 ${
                                            isOwn
                                                ? 'bg-primary text-white rounded-br-md'
                                                : 'bg-gray-100 dark:bg-gray-800 text-[#111418] dark:text-white rounded-bl-md'
                                        }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                    </div>
                                    <p className={`text-xs text-gray-400 mt-1 px-1 ${isOwn ? 'text-right' : ''}`}>
                                        {formatTime(msg.createdAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-end gap-2">
                    <textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={handleTextareaInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        maxLength={MAX_MESSAGE_LENGTH}
                        rows={1}
                        disabled={isSending}
                        aria-label="Message input"
                        className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-[#111418] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || isSending}
                        aria-label="Send message"
                        className="flex-shrink-0 w-10 h-10 bg-primary hover:bg-emerald-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                        {isSending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <span className="material-symbols-outlined text-lg">send</span>
                        )}
                    </button>
                </div>
                <div className="flex justify-between mt-1.5 px-1">
                    <p className="text-xs text-gray-400">Press Enter to send, Shift+Enter for new line</p>
                    {newMessage.length > MAX_MESSAGE_LENGTH * 0.9 && (
                        <p className={`text-xs ${newMessage.length >= MAX_MESSAGE_LENGTH ? 'text-red-500' : 'text-gray-400'}`}>
                            {newMessage.length}/{MAX_MESSAGE_LENGTH}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
