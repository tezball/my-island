import React, { useEffect, useState, useCallback } from 'react';
import { adminReviewService } from '../../services/adminService';
import { AdminTable } from '../../components/admin/shared/AdminTable';
import { AdminPagination } from '../../components/admin/shared/AdminPagination';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import { AdminConfirmModal } from '../../components/admin/shared/AdminConfirmModal';
import type { AdminReview, PageResponse } from '../../types/admin';

const moderationBadgeConfig: Record<string, { status: string; label: string }> = {
    PENDING: { status: 'PENDING', label: 'Pending' },
    APPROVED: { status: 'CONFIRMED', label: 'Approved' },
    REJECTED: { status: 'CANCELLED', label: 'Rejected' },
};

export const AdminReviewsPage: React.FC = () => {
    const [page, setPage] = useState(0);
    const [data, setData] = useState<PageResponse<AdminReview> | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);
    const [moderateTarget, setModerateTarget] = useState<{ review: AdminReview; action: 'APPROVED' | 'REJECTED' } | null>(null);
    const [aiModeratingId, setAiModeratingId] = useState<string | null>(null);

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

    const handleModerate = async () => {
        if (!moderateTarget) return;
        const reason = moderateTarget.action === 'APPROVED' ? 'Manually approved by admin' : 'Manually rejected by admin';
        await adminReviewService.moderate(moderateTarget.review.type, moderateTarget.review.id, moderateTarget.action, reason);
        setModerateTarget(null);
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
        { key: 'moderationStatus', label: 'Moderation', render: (r: AdminReview) => {
            const cfg = moderationBadgeConfig[r.moderationStatus] ?? moderationBadgeConfig.APPROVED;
            return (
                <div>
                    <AdminStatusBadge status={cfg.status} label={cfg.label} />
                    {r.moderationReason && (
                        <p className="text-[10px] text-gray-400 mt-0.5 max-w-[120px] truncate" title={r.moderationReason}>{r.moderationReason}</p>
                    )}
                </div>
            );
        }},
        { key: 'isFlagged', label: 'Flagged', render: (r: AdminReview) => (
            r.isFlagged ? <AdminStatusBadge status="CANCELLED" label="Flagged" /> : <span className="text-gray-400 text-xs">-</span>
        )},
        { key: 'actions', label: '', render: (r: AdminReview) => {
            const aiKey = `${r.type}-${r.id}`;
            const isAiLoading = aiModeratingId === aiKey;
            return (
            <div className="flex gap-1">
                <button
                    onClick={async (e) => {
                        e.stopPropagation();
                        setAiModeratingId(aiKey);
                        try { await adminReviewService.aiModerate(r.type, r.id); fetchReviews(); } catch { /* ignore */ }
                        finally { setAiModeratingId(null); }
                    }}
                    disabled={isAiLoading}
                    className="p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors disabled:opacity-50"
                    title="Rerun AI Moderation"
                >
                    {isAiLoading
                        ? <span className="block h-4 w-4 animate-spin rounded-full border-2 border-purple-300 border-t-purple-600" />
                        : <span className="material-symbols-outlined text-sm text-purple-600">smart_toy</span>}
                </button>
                {r.moderationStatus !== 'APPROVED' && (
                    <button onClick={(e) => { e.stopPropagation(); setModerateTarget({ review: r, action: 'APPROVED' }); }} className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors" title="Approve">
                        <span className="material-symbols-outlined text-sm text-green-600">check_circle</span>
                    </button>
                )}
                {r.moderationStatus !== 'REJECTED' && (
                    <button onClick={(e) => { e.stopPropagation(); setModerateTarget({ review: r, action: 'REJECTED' }); }} className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors" title="Reject">
                        <span className="material-symbols-outlined text-sm text-orange-600">cancel</span>
                    </button>
                )}
                <button onClick={(e) => { e.stopPropagation(); handleFlag(r); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title={r.isFlagged ? 'Unflag' : 'Flag'}>
                    <span className="material-symbols-outlined text-sm text-orange-500">{r.isFlagged ? 'flag' : 'outlined_flag'}</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(r); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors" title="Delete">
                    <span className="material-symbols-outlined text-sm text-red-500">delete</span>
                </button>
            </div>
            );
        }},
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#111418] dark:text-white">Reviews</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Unified view of campsite and supplier reviews with moderation controls</p>
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
            <AdminConfirmModal isOpen={!!moderateTarget} onClose={() => setModerateTarget(null)} onConfirm={handleModerate}
                title={moderateTarget?.action === 'APPROVED' ? 'Approve Review' : 'Reject Review'}
                message={moderateTarget?.action === 'APPROVED'
                    ? `Approve this review by ${moderateTarget?.review.userName}? It will become publicly visible.`
                    : `Reject this review by ${moderateTarget?.review.userName}? It will be hidden from public view.`}
                confirmLabel={moderateTarget?.action === 'APPROVED' ? 'Approve' : 'Reject'}
                isDestructive={moderateTarget?.action === 'REJECTED'} />
        </div>
    );
};
