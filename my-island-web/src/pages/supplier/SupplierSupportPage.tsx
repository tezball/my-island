import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supportService } from '../../services/supportService';
import { SupportConversation } from '../../components/support/SupportConversation';
import type { SupportTicket, CreateTicketRequest, TicketCategory } from '../../types/support';
import clsx from 'clsx';

const CATEGORY_OPTIONS: { label: string; value: TicketCategory }[] = [
    { label: 'General', value: 'GENERAL' },
    { label: 'Billing', value: 'BILLING' },
    { label: 'Technical', value: 'TECHNICAL' },
    { label: 'Account', value: 'ACCOUNT' },
    { label: 'Other', value: 'OTHER' },
];

const STATUS_COLORS: Record<string, string> = {
    OPEN: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    CLOSED: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

export const SupplierSupportPage: React.FC = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState<CreateTicketRequest>({ subject: '', description: '', category: 'GENERAL' });

    const fetchTickets = useCallback(() => {
        setLoading(true);
        supportService.getMyTickets(0, 50)
            .then(data => setTickets(data.content))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchTickets(); }, [fetchTickets]);

    const handleCreate = async () => {
        if (!form.subject.trim() || !form.description.trim()) return;
        setCreating(true);
        try {
            const ticket = await supportService.createTicket(form);
            setTickets(prev => [ticket, ...prev]);
            setShowCreate(false);
            setForm({ subject: '', description: '', category: 'GENERAL' });
            setSelectedTicket(ticket);
        } catch {
            // error handled by UI
        } finally {
            setCreating(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '';
        return d.toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
            </div>
        );
    }

    // Detail view
    if (selectedTicket) {
        return (
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => { setSelectedTicket(null); fetchTickets(); }}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#111418] dark:hover:text-white mb-4 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back to tickets
                </button>

                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-[#111418] dark:text-white">{selectedTicket.subject}</h2>
                                <p className="text-sm text-gray-500 mt-1">#{selectedTicket.id} &middot; {formatDate(selectedTicket.createdAt)}</p>
                            </div>
                            <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[selectedTicket.status])}>
                                {selectedTicket.status.replace(/_/g, ' ')}
                            </span>
                        </div>
                    </div>
                    <div className="h-[500px]">
                        <SupportConversation
                            ticketId={selectedTicket.id}
                            currentUserId={user?.id || ''}
                            getMessages={supportService.getMessages}
                            sendMessage={supportService.sendMessage}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white">Support Tickets</h2>
                    <p className="text-sm text-gray-500">Get help from our support team</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white font-semibold text-sm rounded-lg transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    New Ticket
                </button>
            </div>

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Create Support Ticket</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={form.subject}
                                    onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
                                    maxLength={255}
                                    placeholder="Brief summary of your issue"
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-[#111418] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Category</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(prev => ({ ...prev, category: e.target.value as TicketCategory }))}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    {CATEGORY_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                                    maxLength={5000}
                                    rows={4}
                                    placeholder="Describe your issue in detail..."
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-[#111418] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowCreate(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#111418] dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={creating || !form.subject.trim() || !form.description.trim()}
                                className="px-4 py-2 bg-lime-500 hover:bg-lime-600 disabled:bg-gray-300 text-white font-semibold text-sm rounded-lg transition-colors"
                            >
                                {creating ? 'Creating...' : 'Create Ticket'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Ticket List */}
            {tickets.length === 0 ? (
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-3 block">support_agent</span>
                    <p className="text-gray-500 dark:text-gray-400">No support tickets yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create a ticket to get help from our team</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tickets.map(ticket => (
                        <button
                            key={ticket.id}
                            onClick={() => setSelectedTicket(ticket)}
                            className="w-full text-left bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-lime-500/50 dark:hover:border-lime-500/50 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-[#111418] dark:text-white truncate">{ticket.subject}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        #{ticket.id} &middot; {ticket.category} &middot; {formatDate(ticket.createdAt)}
                                        {ticket.messageCount > 0 && (
                                            <span className="ml-2">
                                                <span className="material-symbols-outlined text-xs align-middle">chat</span> {ticket.messageCount}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0', STATUS_COLORS[ticket.status])}>
                                    {ticket.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
