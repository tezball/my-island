import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLeadService } from '../../services/adminService';
import { AdminFilterPills } from '../../components/admin/shared/AdminFilterPills';
import { AdminTable } from '../../components/admin/shared/AdminTable';
import { AdminPagination } from '../../components/admin/shared/AdminPagination';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import { CsvExportButton } from '../../components/admin/shared/CsvExportButton';
import type { Lead, PageResponse, LeadCreate } from '../../types/admin';

const STATUS_OPTIONS = [
    { label: 'All', value: '' },
    { label: 'New', value: 'NEW' },
    { label: 'Contacted', value: 'CONTACTED' },
    { label: 'Qualified', value: 'QUALIFIED' },
    { label: 'Converted', value: 'CONVERTED' },
    { label: 'Lost', value: 'LOST' },
];

const TYPE_OPTIONS = [
    { label: 'All Types', value: '' },
    { label: 'Owner', value: 'OWNER' },
    { label: 'Supplier', value: 'SUPPLIER' },
];

export const AdminLeadsPage: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [page, setPage] = useState(0);
    const [data, setData] = useState<PageResponse<Lead> | null>(null);
    const [loading, setLoading] = useState(true);
    const [overdueCount, setOverdueCount] = useState(0);
    const [showCreate, setShowCreate] = useState(false);
    const [newLead, setNewLead] = useState<LeadCreate>({ name: '', businessType: 'OWNER' });
    const [creating, setCreating] = useState(false);

    const fetchLeads = useCallback(() => {
        setLoading(true);
        adminLeadService.list(status, businessType, '', page, 20)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [status, businessType, page]);

    useEffect(() => { fetchLeads(); }, [fetchLeads]);
    useEffect(() => { setPage(0); }, [status, businessType]);
    useEffect(() => { adminLeadService.getOverdue().then((o) => setOverdueCount(o.length)).catch(() => {}); }, []);

    const handleCreate = async () => {
        setCreating(true);
        try {
            await adminLeadService.create(newLead);
            setShowCreate(false);
            setNewLead({ name: '', businessType: 'OWNER' });
            fetchLeads();
        } finally { setCreating(false); }
    };

    const columns = [
        { key: 'name', label: 'Name', render: (l: Lead) => (
            <div>
                <p className="font-medium">{l.name}</p>
                <p className="text-xs text-gray-400">{l.email || 'No email'}</p>
            </div>
        )},
        { key: 'businessType', label: 'Type', render: (l: Lead) => <AdminStatusBadge status={l.businessType === 'OWNER' ? 'CONFIRMED' : 'TRIALING'} label={l.businessType} /> },
        { key: 'status', label: 'Status', render: (l: Lead) => <AdminStatusBadge status={l.status} /> },
        { key: 'score', label: 'Score', render: (l: Lead) => (
            <div className="flex items-center gap-1.5">
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${l.score}%` }} />
                </div>
                <span className="text-xs font-medium">{l.score}</span>
            </div>
        )},
        { key: 'source', label: 'Source', render: (l: Lead) => <span className="text-xs">{l.source || '-'}</span> },
        { key: 'scheduledFollowUp', label: 'Follow-up', render: (l: Lead) => {
            if (!l.scheduledFollowUp) return <span className="text-gray-400 text-xs">-</span>;
            const isOverdue = new Date(l.scheduledFollowUp) < new Date();
            return <span className={`text-xs ${isOverdue ? 'text-red-500 font-medium' : ''}`}>{new Date(l.scheduledFollowUp).toLocaleDateString()}</span>;
        }},
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white">Leads CRM</h2>
                    {overdueCount > 0 && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">{overdueCount} overdue</span>
                    )}
                </div>
                <div className="flex gap-2">
                    <CsvExportButton onExport={() => adminLeadService.exportCsv()} label="Export" />
                    <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                        <span className="material-symbols-outlined text-lg">add</span> New Lead
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                <AdminFilterPills options={STATUS_OPTIONS} selected={status} onChange={setStatus} />
                <AdminFilterPills options={TYPE_OPTIONS} selected={businessType} onChange={setBusinessType} />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>
            ) : (
                <>
                    <AdminTable columns={columns} data={data?.content ?? []} keyExtractor={(l) => l.id} onRowClick={(l) => navigate(`/admin/leads/${l.id}`)} emptyMessage="No leads found" />
                    {data && <AdminPagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />}
                </>
            )}

            {/* Create Lead Modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreate(false)} />
                    <div className="relative bg-white dark:bg-[#1a2632] rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">New Lead</h3>
                        <div className="space-y-3">
                            <input value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} placeholder="Name *" className="w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white" />
                            <input value={newLead.email || ''} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} placeholder="Email" className="w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white" />
                            <input value={newLead.phone || ''} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} placeholder="Phone" className="w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white" />
                            <select value={newLead.businessType} onChange={(e) => setNewLead({ ...newLead, businessType: e.target.value as 'OWNER' | 'SUPPLIER' })} className="w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white">
                                <option value="OWNER">Owner</option>
                                <option value="SUPPLIER">Supplier</option>
                            </select>
                            <input value={newLead.source || ''} onChange={(e) => setNewLead({ ...newLead, source: e.target.value })} placeholder="Source (e.g., website, referral)" className="w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white" />
                            <textarea value={newLead.notes || ''} onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })} placeholder="Notes" rows={2} className="w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white" />
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Cancel</button>
                            <button onClick={handleCreate} disabled={!newLead.name || creating} className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50">
                                {creating ? 'Creating...' : 'Create Lead'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
