import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSupplierService } from '../../services/adminService';
import { AdminFilterPills } from '../../components/admin/shared/AdminFilterPills';
import { AdminTable } from '../../components/admin/shared/AdminTable';
import { AdminPagination } from '../../components/admin/shared/AdminPagination';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import type { AdminSupplier, PageResponse } from '../../types/admin';

const CATEGORY_OPTIONS = [
    { label: 'All', value: '' },
    { label: 'Farm Shop', value: 'FARM_SHOP' },
    { label: 'Restaurant', value: 'RESTAURANT' },
    { label: 'Activity', value: 'ACTIVITY_PROVIDER' },
    { label: 'Cafe', value: 'CAFE' },
    { label: 'Pub', value: 'PUB' },
    { label: 'Other', value: 'OTHER' },
];

export const AdminSuppliersPage: React.FC = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(0);
    const [data, setData] = useState<PageResponse<AdminSupplier> | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(() => {
        setLoading(true);
        adminSupplierService.list(category, page, 20)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [category, page]);

    useEffect(() => { fetchData(); }, [fetchData]);
    useEffect(() => { setPage(0); }, [category]);

    const columns = [
        { key: 'businessName', label: 'Business', render: (s: AdminSupplier) => (
            <div>
                <p className="font-medium">{s.businessName}</p>
                <p className="text-xs text-gray-400">{s.userName} &middot; {s.userEmail}</p>
            </div>
        )},
        { key: 'category', label: 'Category', render: (s: AdminSupplier) => <span className="text-xs">{s.category?.replace(/_/g, ' ')}</span> },
        { key: 'county', label: 'Location', render: (s: AdminSupplier) => <span>{s.town ? `${s.town}, ` : ''}{s.county}</span> },
        { key: 'isVerified', label: 'Verified', render: (s: AdminSupplier) => <AdminStatusBadge status={String(s.isVerified)} label={s.isVerified ? 'Verified' : 'Unverified'} /> },
        { key: 'subscriptionStatus', label: 'Subscription', render: (s: AdminSupplier) => <AdminStatusBadge status={s.subscriptionStatus} /> },
        { key: 'offerCount', label: 'Offers', render: (s: AdminSupplier) => <span>{s.offerCount}</span> },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#111418] dark:text-white">Suppliers</h2>
            <AdminFilterPills options={CATEGORY_OPTIONS} selected={category} onChange={setCategory} />
            {loading ? (
                <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>
            ) : (
                <>
                    <AdminTable columns={columns} data={data?.content ?? []} keyExtractor={(s) => s.id} onRowClick={(s) => navigate(`/admin/suppliers/${s.id}`)} emptyMessage="No suppliers found" />
                    {data && <AdminPagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />}
                </>
            )}
        </div>
    );
};
