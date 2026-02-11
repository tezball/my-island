import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminOwnerService } from '../../services/adminService';
import { AdminFilterPills } from '../../components/admin/shared/AdminFilterPills';
import { AdminTable } from '../../components/admin/shared/AdminTable';
import { AdminPagination } from '../../components/admin/shared/AdminPagination';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import type { AdminOwner, PageResponse } from '../../types/admin';

const SUB_OPTIONS = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Trialing', value: 'TRIALING' },
    { label: 'None', value: 'NONE' },
    { label: 'Canceled', value: 'CANCELED' },
    { label: 'Past Due', value: 'PAST_DUE' },
];

export const AdminOwnersPage: React.FC = () => {
    const navigate = useNavigate();
    const [subStatus, setSubStatus] = useState('');
    const [page, setPage] = useState(0);
    const [data, setData] = useState<PageResponse<AdminOwner> | null>(null);
    const [loading, setLoading] = useState(true);

    const fetch = useCallback(() => {
        setLoading(true);
        adminOwnerService.list(subStatus, page, 20)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [subStatus, page]);

    useEffect(() => { fetch(); }, [fetch]);
    useEffect(() => { setPage(0); }, [subStatus]);

    const columns = [
        { key: 'propertyName', label: 'Property', render: (o: AdminOwner) => (
            <div>
                <p className="font-medium">{o.propertyName}</p>
                <p className="text-xs text-gray-400">{o.userName} &middot; {o.userEmail}</p>
            </div>
        )},
        { key: 'county', label: 'Location', render: (o: AdminOwner) => <span>{o.town ? `${o.town}, ` : ''}{o.county}</span> },
        { key: 'propertyType', label: 'Type', render: (o: AdminOwner) => <span className="text-xs">{o.propertyType}</span> },
        { key: 'lotCount', label: 'Lots', render: (o: AdminOwner) => <span>{o.lotCount}</span> },
        { key: 'subscriptionStatus', label: 'Subscription', render: (o: AdminOwner) => <AdminStatusBadge status={o.subscriptionStatus} /> },
        { key: 'rating', label: 'Rating', render: (o: AdminOwner) => (
            o.rating ? <span>{o.rating.toFixed(1)} ({o.reviewCount})</span> : <span className="text-gray-400">-</span>
        )},
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#111418] dark:text-white">Owners</h2>
            <AdminFilterPills options={SUB_OPTIONS} selected={subStatus} onChange={setSubStatus} />
            {loading ? (
                <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>
            ) : (
                <>
                    <AdminTable columns={columns} data={data?.content ?? []} keyExtractor={(o) => o.id} onRowClick={(o) => navigate(`/admin/owners/${o.id}`)} emptyMessage="No owners found" />
                    {data && <AdminPagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />}
                </>
            )}
        </div>
    );
};
