import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSupportService } from '../../services/supportService';
import { AdminFilterPills } from '../../components/admin/shared/AdminFilterPills';
import { AdminTable } from '../../components/admin/shared/AdminTable';
import { AdminPagination } from '../../components/admin/shared/AdminPagination';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import type { SupportTicket, PageResponse } from '../../types/support';

const STATUS_OPTIONS = [
    { label: 'All', value: '' },
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Closed', value: 'CLOSED' },
];

const CATEGORY_OPTIONS = [
    { label: 'All Categories', value: '' },
    { label: 'General', value: 'GENERAL' },
    { label: 'Billing', value: 'BILLING' },
    { label: 'Technical', value: 'TECHNICAL' },
    { label: 'Account', value: 'ACCOUNT' },
    { label: 'Booking', value: 'BOOKING' },
    { label: 'Other', value: 'OTHER' },
];

export const AdminSupportPage: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(0);
    const [data, setData] = useState<PageResponse<SupportTicket> | null>(null);
    const [stats, setStats] = useState<Record<string, number>>({});

    const fetchTickets = useCallback(() => {
        adminSupportService.listTickets(status, category, page, 20)
            .then(setData)
            .catch(() => setData(null));
    }, [status, category, page]);

    useEffect(() => { fetchTickets(); }, [fetchTickets]);
    useEffect(() => { setPage(0); }, [status, category]);
    useEffect(() => { adminSupportService.getStats().then(setStats).catch(() => {}); }, []);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const columns = [
        { key: 'subject', label: 'Ticket', render: (t: SupportTicket) => (
            <div>
                <p className="font-medium">{t.subject}</p>
                <p className="text-xs text-gray-400">#{t.id} &middot; {t.userName}</p>
            </div>
        )},
        { key: 'category', label: 'Category', render: (t: SupportTicket) => (
            <span className="text-xs">{t.category}</span>
        )},
        { key: 'status', label: 'Status', render: (t: SupportTicket) => <AdminStatusBadge status={t.status} /> },
        { key: 'priority', label: 'Priority', render: (t: SupportTicket) => <AdminStatusBadge status={t.priority} /> },
        { key: 'messages', label: 'Messages', render: (t: SupportTicket) => (
            <span className="text-sm">{t.messageCount}</span>
        )},
        { key: 'createdAt', label: 'Created', render: (t: SupportTicket) => (
            <span className="text-xs text-gray-500">{formatDate(t.createdAt)}</span>
        )},
    ];

    return (
        <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Open', key: 'OPEN', color: 'text-blue-600' },
                    { label: 'In Progress', key: 'IN_PROGRESS', color: 'text-yellow-600' },
                    { label: 'Resolved', key: 'RESOLVED', color: 'text-green-600' },
                    { label: 'Closed', key: 'CLOSED', color: 'text-gray-600' },
                ].map(s => (
                    <div key={s.key} className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                        <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                        <p className={`text-2xl font-bold ${s.color} mt-1`}>{stats[s.key] || 0}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                <AdminFilterPills options={STATUS_OPTIONS} selected={status} onChange={setStatus} />
                <AdminFilterPills options={CATEGORY_OPTIONS} selected={category} onChange={setCategory} />
            </div>

            {/* Table */}
            <AdminTable<SupportTicket>
                columns={columns}
                data={data?.content || []}
                keyExtractor={(t) => t.id}
                onRowClick={(t) => navigate(`/admin/support/${t.id}`)}
                emptyMessage="No support tickets found"
            />

            {data && data.totalPages > 1 && (
                <AdminPagination
                    page={data.number}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
};
