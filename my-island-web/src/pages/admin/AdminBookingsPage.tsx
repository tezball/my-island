import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminBookingService } from '../../services/adminService';
import { AdminFilterPills } from '../../components/admin/shared/AdminFilterPills';
import { AdminTable } from '../../components/admin/shared/AdminTable';
import { AdminPagination } from '../../components/admin/shared/AdminPagination';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import type { AdminBooking, PageResponse } from '../../types/admin';

const STATUS_OPTIONS = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Checked In', value: 'CHECKED_IN' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
];

export const AdminBookingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(0);
    const [data, setData] = useState<PageResponse<AdminBooking> | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchBookings = useCallback(() => {
        setLoading(true);
        adminBookingService.list(status, page, 20)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [status, page]);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);
    useEffect(() => { setPage(0); }, [status]);

    const columns = [
        { key: 'id', label: 'ID', render: (b: AdminBooking) => <span className="font-mono text-xs">#{b.id}</span> },
        { key: 'guest', label: 'Guest', render: (b: AdminBooking) => (
            <div>
                <p className="font-medium">{b.guestName || b.userName}</p>
                <p className="text-xs text-gray-400">{b.guestEmail || b.userEmail}</p>
            </div>
        )},
        { key: 'property', label: 'Property', render: (b: AdminBooking) => (
            <div>
                <p className="font-medium">{b.lotName}</p>
                <p className="text-xs text-gray-400">{b.ownerName}</p>
            </div>
        )},
        { key: 'dates', label: 'Dates', render: (b: AdminBooking) => (
            <span className="text-xs">{new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()}</span>
        )},
        { key: 'totalPrice', label: 'Total', render: (b: AdminBooking) => <span className="font-medium">&euro;{b.totalPrice?.toFixed(2)}</span> },
        { key: 'status', label: 'Status', render: (b: AdminBooking) => <AdminStatusBadge status={b.status} /> },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#111418] dark:text-white">Bookings</h2>
            <AdminFilterPills options={STATUS_OPTIONS} selected={status} onChange={setStatus} />
            {loading ? (
                <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>
            ) : (
                <>
                    <AdminTable columns={columns} data={data?.content ?? []} keyExtractor={(b) => b.id} onRowClick={(b) => navigate(`/admin/bookings/${b.id}`)} emptyMessage="No bookings found" />
                    {data && <AdminPagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />}
                </>
            )}
        </div>
    );
};
