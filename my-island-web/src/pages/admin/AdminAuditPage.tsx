import React, { useEffect, useState, useCallback } from 'react';
import { adminAuditService } from '../../services/adminService';
import { AdminFilterPills } from '../../components/admin/shared/AdminFilterPills';
import { AdminTable } from '../../components/admin/shared/AdminTable';
import { AdminPagination } from '../../components/admin/shared/AdminPagination';
import type { AuditLogEntry, PageResponse } from '../../types/admin';

const ACTION_OPTIONS = [
    { label: 'All Actions', value: '' },
    { label: 'Update User', value: 'UPDATE_USER' },
    { label: 'Toggle Active', value: 'TOGGLE_ACTIVE' },
    { label: 'Cancel Booking', value: 'CANCEL_BOOKING' },
    { label: 'Update Booking', value: 'UPDATE_BOOKING' },
    { label: 'Update Owner', value: 'UPDATE_OWNER' },
    { label: 'Update Supplier', value: 'UPDATE_SUPPLIER' },
    { label: 'Toggle Verified', value: 'TOGGLE_VERIFIED' },
    { label: 'Flag Review', value: 'FLAG_REVIEW' },
    { label: 'Delete Review', value: 'DELETE_REVIEW' },
    { label: 'Create Lead', value: 'CREATE_LEAD' },
    { label: 'Update Lead', value: 'UPDATE_LEAD' },
    { label: 'Delete Lead', value: 'DELETE_LEAD' },
];

const ENTITY_OPTIONS = [
    { label: 'All Entities', value: '' },
    { label: 'User', value: 'USER' },
    { label: 'Booking', value: 'BOOKING' },
    { label: 'Owner', value: 'OWNER' },
    { label: 'Supplier', value: 'SUPPLIER' },
    { label: 'Review', value: 'REVIEW' },
    { label: 'Lead', value: 'LEAD' },
];

export const AdminAuditPage: React.FC = () => {
    const [action, setAction] = useState('');
    const [entityType, setEntityType] = useState('');
    const [page, setPage] = useState(0);
    const [data, setData] = useState<PageResponse<AuditLogEntry> | null>(null);
    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState<AuditLogEntry | null>(null);

    const fetchLogs = useCallback(() => {
        setLoading(true);
        adminAuditService.list('', action, entityType, page, 20)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [action, entityType, page]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);
    useEffect(() => { setPage(0); }, [action, entityType]);

    const columns = [
        { key: 'createdAt', label: 'Time', render: (e: AuditLogEntry) => (
            <span className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleString()}</span>
        )},
        { key: 'action', label: 'Action', render: (e: AuditLogEntry) => (
            <span className="text-xs font-medium text-[#111418] dark:text-white">{e.action.replace(/_/g, ' ')}</span>
        )},
        { key: 'entityType', label: 'Entity', render: (e: AuditLogEntry) => (
            <span className="text-xs">{e.entityType} #{e.entityId}</span>
        )},
        { key: 'summary', label: 'Summary', render: (e: AuditLogEntry) => (
            <p className="text-xs max-w-sm truncate text-gray-600 dark:text-gray-400">{e.summary || '-'}</p>
        )},
        { key: 'adminUserId', label: 'Admin', render: (e: AuditLogEntry) => (
            <span className="text-xs">User #{e.adminUserId}</span>
        )},
        { key: 'details', label: '', render: (e: AuditLogEntry) => (
            (e.previousValue || e.newValue) ? (
                <button onClick={(ev) => { ev.stopPropagation(); setDetail(e); }} className="text-xs text-red-500 hover:underline">
                    View Changes
                </button>
            ) : null
        )},
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#111418] dark:text-white">Audit Log</h2>

            <div className="flex flex-wrap gap-4">
                <AdminFilterPills options={ACTION_OPTIONS} selected={action} onChange={setAction} />
                <AdminFilterPills options={ENTITY_OPTIONS} selected={entityType} onChange={setEntityType} />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>
            ) : (
                <>
                    <AdminTable columns={columns} data={data?.content ?? []} keyExtractor={(e) => e.id} emptyMessage="No audit entries found" />
                    {data && <AdminPagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />}
                </>
            )}

            {/* Detail Modal */}
            {detail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setDetail(null)} />
                    <div className="relative bg-white dark:bg-[#1a2632] rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-[#111418] dark:text-white">Audit Detail</h3>
                            <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Action</p>
                                <p className="text-sm font-medium text-[#111418] dark:text-white">{detail.action.replace(/_/g, ' ')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Entity</p>
                                <p className="text-sm text-[#111418] dark:text-white">{detail.entityType} #{detail.entityId}</p>
                            </div>
                            {detail.summary && (
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Summary</p>
                                    <p className="text-sm text-[#111418] dark:text-white">{detail.summary}</p>
                                </div>
                            )}
                            {detail.previousValue && (
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Previous Value</p>
                                    <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto text-[#111418] dark:text-gray-300">{detail.previousValue}</pre>
                                </div>
                            )}
                            {detail.newValue && (
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">New Value</p>
                                    <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto text-[#111418] dark:text-gray-300">{detail.newValue}</pre>
                                </div>
                            )}
                            <p className="text-xs text-gray-400">Admin User #{detail.adminUserId} &middot; {new Date(detail.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
