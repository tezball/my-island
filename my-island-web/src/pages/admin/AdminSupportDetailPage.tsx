import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminSupportService } from '../../services/supportService';
import { useAuth } from '../../context/AuthContext';
import { SupportConversation } from '../../components/support/SupportConversation';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import type { SupportTicket, TicketStatus, TicketPriority } from '../../types/support';

const STATUS_ORDER: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const PRIORITY_ORDER: TicketPriority[] = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];

export const AdminSupportDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        adminSupportService.getTicket(id)
            .then(setTicket)
            .catch(() => navigate('/admin/support'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const handleStatusChange = async (newStatus: string) => {
        if (!ticket) return;
        setUpdatingStatus(true);
        try {
            const updated = await adminSupportService.updateStatus(ticket.id, newStatus, ticket.priority);
            setTicket(updated);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handlePriorityChange = async (newPriority: string) => {
        if (!ticket) return;
        setUpdatingStatus(true);
        try {
            const updated = await adminSupportService.updateStatus(ticket.id, ticket.status, newPriority);
            setTicket(updated);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!ticket) return null;

    return (
        <div>
            <button
                onClick={() => navigate('/admin/support')}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#111418] dark:hover:text-white mb-4 transition-colors"
            >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back to tickets
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Conversation */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-lg font-bold text-[#111418] dark:text-white">{ticket.subject}</h2>
                        <p className="text-sm text-gray-500 mt-1">#{ticket.id} &middot; {ticket.userName}</p>
                    </div>
                    <div className="h-[500px]">
                        <SupportConversation
                            ticketId={ticket.id}
                            currentUserId={user?.id || ''}
                            getMessages={adminSupportService.getMessages}
                            sendMessage={adminSupportService.sendMessage}
                        />
                    </div>
                </div>

                {/* Right: Ticket Info & Controls */}
                <div className="space-y-4">
                    {/* Status Control */}
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                        <h3 className="text-sm font-bold text-[#111418] dark:text-white mb-3">Status</h3>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_ORDER.map(s => (
                                <button
                                    key={s}
                                    onClick={() => handleStatusChange(s)}
                                    disabled={updatingStatus || ticket.status === s}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                        ticket.status === s
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50'
                                    }`}
                                >
                                    {s.replace(/_/g, ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Priority Control */}
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                        <h3 className="text-sm font-bold text-[#111418] dark:text-white mb-3">Priority</h3>
                        <div className="flex flex-wrap gap-2">
                            {PRIORITY_ORDER.map(p => (
                                <button
                                    key={p}
                                    onClick={() => handlePriorityChange(p)}
                                    disabled={updatingStatus || ticket.priority === p}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                        ticket.priority === p
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                        <h3 className="text-sm font-bold text-[#111418] dark:text-white mb-3">Details</h3>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Category</dt>
                                <dd><AdminStatusBadge status={ticket.category} /></dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">User</dt>
                                <dd className="text-[#111418] dark:text-white font-medium">{ticket.userName}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Messages</dt>
                                <dd className="text-[#111418] dark:text-white">{ticket.messageCount}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Created</dt>
                                <dd className="text-[#111418] dark:text-white text-xs">{formatDate(ticket.createdAt)}</dd>
                            </div>
                            {ticket.closedAt && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Closed</dt>
                                    <dd className="text-[#111418] dark:text-white text-xs">{formatDate(ticket.closedAt)}</dd>
                                </div>
                            )}
                            {ticket.relatedBookingId && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Booking</dt>
                                    <dd>
                                        <button
                                            onClick={() => navigate(`/admin/bookings/${ticket.relatedBookingId}`)}
                                            className="text-red-500 hover:text-red-600 text-xs font-medium"
                                        >
                                            #{ticket.relatedBookingId}
                                        </button>
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};
