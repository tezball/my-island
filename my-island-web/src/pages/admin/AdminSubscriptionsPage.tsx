import React, { useEffect, useState, useCallback } from 'react';
import { adminSubscriptionService } from '../../services/adminService';
import { AdminFilterPills } from '../../components/admin/shared/AdminFilterPills';
import { AdminTable } from '../../components/admin/shared/AdminTable';
import { AdminPagination } from '../../components/admin/shared/AdminPagination';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import { KpiCard } from '../../components/admin/dashboard/KpiCard';
import type { SubscriptionOverview, SubscriptionEntry, PageResponse } from '../../types/admin';

const TYPE_OPTIONS = [
    { label: 'All', value: '' },
    { label: 'Owners', value: 'OWNER' },
    { label: 'Suppliers', value: 'SUPPLIER' },
];

export const AdminSubscriptionsPage: React.FC = () => {
    const [overview, setOverview] = useState<SubscriptionOverview | null>(null);
    const [entityType, setEntityType] = useState('');
    const [page, setPage] = useState(0);
    const [data, setData] = useState<PageResponse<SubscriptionEntry> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminSubscriptionService.getOverview().then(setOverview).catch(() => setOverview(null));
    }, []);

    const fetchList = useCallback(() => {
        setLoading(true);
        adminSubscriptionService.list(entityType, page, 20)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [entityType, page]);

    useEffect(() => { fetchList(); }, [fetchList]);
    useEffect(() => { setPage(0); }, [entityType]);

    const totalActive = (overview?.ownerCounts?.ACTIVE || 0) + (overview?.supplierCounts?.ACTIVE || 0);
    const totalTrialing = (overview?.ownerCounts?.TRIALING || 0) + (overview?.supplierCounts?.TRIALING || 0);
    const totalCanceled = (overview?.ownerCounts?.CANCELED || 0) + (overview?.supplierCounts?.CANCELED || 0);

    const columns = [
        { key: 'name', label: 'Name', render: (s: SubscriptionEntry) => (
            <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-gray-400">{s.email}</p>
            </div>
        )},
        { key: 'entityType', label: 'Type', render: (s: SubscriptionEntry) => (
            <AdminStatusBadge status={s.entityType === 'OWNER' ? 'CONFIRMED' : 'TRIALING'} label={s.entityType} />
        )},
        { key: 'status', label: 'Status', render: (s: SubscriptionEntry) => <AdminStatusBadge status={s.status} /> },
        { key: 'trial', label: 'Trial', render: (s: SubscriptionEntry) => (
            s.isTrialing ? <span className="text-xs text-blue-500">{s.trialDaysRemaining}d remaining</span> : <span className="text-gray-400 text-xs">-</span>
        )},
        { key: 'periodEnd', label: 'Period End', render: (s: SubscriptionEntry) => (
            s.currentPeriodEnd ? <span className="text-xs">{new Date(s.currentPeriodEnd).toLocaleDateString()}</span> : <span className="text-gray-400 text-xs">-</span>
        )},
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#111418] dark:text-white">Subscriptions</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KpiCard icon="check_circle" label="Active Subscriptions" value={totalActive} />
                <KpiCard icon="hourglass_top" label="Trialing" value={totalTrialing} />
                <KpiCard icon="cancel" label="Canceled" value={totalCanceled} />
            </div>

            <AdminFilterPills options={TYPE_OPTIONS} selected={entityType} onChange={setEntityType} />
            {loading ? (
                <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>
            ) : (
                <>
                    <AdminTable columns={columns} data={data?.content ?? []} keyExtractor={(s) => `${s.entityType}-${s.id}`} emptyMessage="No subscriptions found" />
                    {data && <AdminPagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />}
                </>
            )}
        </div>
    );
};
