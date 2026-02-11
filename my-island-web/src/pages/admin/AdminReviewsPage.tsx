import React, { useEffect, useState, useCallback } from 'react';
import { adminReviewService } from '../../services/adminService';
import { AdminTable } from '../../components/admin/shared/AdminTable';
import { AdminPagination } from '../../components/admin/shared/AdminPagination';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import { AdminConfirmModal } from '../../components/admin/shared/AdminConfirmModal';
import type { AdminReview, PageResponse } from '../../types/admin';

export const AdminReviewsPage: React.FC = () => {
    const [page, setPage] = useState(0);
    const [data, setData] = useState<PageResponse<AdminReview> | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);

    const fetchReviews = useCallback(() => {
        setLoading(true);
        adminReviewService.list(page, 20)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [page]);

    useEffect(() => { fetchReviews(); }, [fetchReviews]);

    const handleFlag = async (r: AdminReview) => {
        await adminReviewService.flag(r.type, r.id);
        fetchReviews();
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await adminReviewService.remove(deleteTarget.type, deleteTarget.id);
        setDeleteTarget(null);
        fetchReviews();
    };

    const columns = [
        { key: 'type', label: 'Type', render: (r: AdminReview) => (
            <AdminStatusBadge status={r.type === 'OWNER' ? 'CONFIRMED' : 'TRIALING'} label={r.type === 'OWNER' ? 'Campsite' : 'Supplier'} />
        )},
        { key: 'userName', label: 'Reviewer', render: (r: AdminReview) => <span className="font-medium">{r.userName}</span> },
        { key: 'targetName', label: 'Target', render: (r: AdminReview) => <span>{r.targetName}</span> },
        { key: 'rating', label: 'Rating', render: (r: AdminReview) => (
            <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                <span className="font-medium">{r.rating}</span>
            </div>
        )},
        { key: 'comment', label: 'Comment', render: (r: AdminReview) => (
            <p className="text-xs max-w-xs truncate">{r.comment}</p>
        ), className: 'max-w-xs' },
        { key: 'isFlagged', label: 'Flagged', render: (r: AdminReview) => (
            r.isFlagged ? <AdminStatusBadge status="CANCELLED" label="Flagged" /> : <span className="text-gray-400 text-xs">-</span>
        )},
        { key: 'actions', label: '', render: (r: AdminReview) => (
            <div className="flex gap-1">
                <button onClick={(e) => { e.stopPropagation(); handleFlag(r); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title={r.isFlagged ? 'Unflag' : 'Flag'}>
                    <span className="material-symbols-outlined text-sm text-orange-500">{r.isFlagged ? 'flag' : 'outlined_flag'}</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(r); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors" title="Delete">
                    <span className="material-symbols-outlined text-sm text-red-500">delete</span>
                </button>
            </div>
        )},
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#111418] dark:text-white">Reviews</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Unified view of campsite and supplier reviews</p>
            {loading ? (
                <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>
            ) : (
                <>
                    <AdminTable columns={columns} data={data?.content ?? []} keyExtractor={(r) => `${r.type}-${r.id}`} emptyMessage="No reviews found" />
                    {data && <AdminPagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />}
                </>
            )}
            <AdminConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
                title="Delete Review" message={`Delete this review by ${deleteTarget?.userName}? This cannot be undone.`} confirmLabel="Delete" isDestructive />
        </div>
    );
};
