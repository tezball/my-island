import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationService, type AppNotification } from '../../services/notificationService';

const POLL_INTERVAL = 30_000; // 30 seconds

export const Header: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Poll unread count
    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchCount = () => {
            notificationService.getUnreadCount().then(setUnreadCount).catch(() => {});
        };
        fetchCount();
        const interval = setInterval(fetchCount, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen]);

    const openDropdown = useCallback(async () => {
        if (isOpen) { setIsOpen(false); return; }
        setIsOpen(true);
        setIsLoading(true);
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch { /* ignore */ }
        setIsLoading(false);
    }, [isOpen]);

    const handleNotificationClick = async (n: AppNotification) => {
        if (!n.isRead) {
            try {
                await notificationService.markAsRead(n.id);
                setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch { /* ignore */ }
        }
        setIsOpen(false);
        if (n.link) navigate(n.link);
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllRead();
            setNotifications(prev => prev.map(x => ({ ...x, isRead: true })));
            setUnreadCount(0);
        } catch { /* ignore */ }
    };

    const formatTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <header className="bg-white dark:bg-[#1a2632] sticky top-0 z-50 shadow-sm border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center p-4 max-w-7xl mx-auto w-full">
                {isAuthenticated && user ? (
                    <>
                        <div className="flex size-10 shrink-0 items-center">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-200"
                                aria-label={`User profile avatar for ${user.name}`}
                                style={{ backgroundImage: `url("${user.avatarUrl}")` }}
                            >
                            </div>
                        </div>
                        <div className="flex flex-col ml-3 flex-1">
                            <span className="text-xs text-gray-500 font-medium">Welcome back,</span>
                            <h2 className="text-[#111418] dark:text-white text-base font-bold leading-tight tracking-[-0.015em]">{user.name}</h2>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            {!user.isSupplier && !user.isOwner && (
                                <Link
                                    to="/become-a-host"
                                    className="hidden md:inline-flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-bold text-[#111418] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mr-2"
                                >
                                    Become a Host
                                </Link>
                            )}
                            {/* Notification Bell */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={openDropdown}
                                    className="flex items-center justify-center rounded-full size-10 bg-transparent text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                                >
                                    <span className="material-symbols-outlined text-2xl">notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Dropdown */}
                                {isOpen && (
                                    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-[#1a2632] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                            <h3 className="font-bold text-[#111418] dark:text-white text-sm">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={handleMarkAllRead}
                                                    className="text-xs font-medium text-primary hover:text-emerald-600 transition-colors"
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {isLoading ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                                </div>
                                            ) : notifications.length === 0 ? (
                                                <div className="py-8 text-center">
                                                    <span className="material-symbols-outlined text-3xl text-gray-300 dark:text-gray-600">notifications_off</span>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">No notifications yet</p>
                                                </div>
                                            ) : (
                                                notifications.slice(0, 20).map((n) => (
                                                    <button
                                                        key={n.id}
                                                        onClick={() => handleNotificationClick(n)}
                                                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0 ${!n.isRead ? 'bg-primary/5' : ''}`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            {!n.isRead && (
                                                                <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0"></span>
                                                            )}
                                                            <div className={!n.isRead ? '' : 'ml-5'}>
                                                                <p className="text-sm font-semibold text-[#111418] dark:text-white">{n.title}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{formatTimeAgo(n.createdAt)}</p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-between w-full">
                        <Link to="/">
                            <h2 className="text-[#111418] dark:text-white text-lg font-bold">My Island</h2>
                        </Link>
                        <Link to="/signin" className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-[#20d85f] transition-colors">
                            Sign In
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};
