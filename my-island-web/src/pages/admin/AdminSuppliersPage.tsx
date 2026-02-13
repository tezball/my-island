import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSupplierService, adminUserService } from '../../services/adminService';
import { AdminFilterPills } from '../../components/admin/shared/AdminFilterPills';
import { AdminTable } from '../../components/admin/shared/AdminTable';
import { AdminPagination } from '../../components/admin/shared/AdminPagination';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import type { AdminSupplier, AdminUser, PageResponse } from '../../types/admin';

const CATEGORY_OPTIONS = [
    { label: 'All', value: '' },
    { label: 'Farm Shop', value: 'FARM_SHOP' },
    { label: 'Restaurant', value: 'RESTAURANT' },
    { label: 'Activity', value: 'ACTIVITY_PROVIDER' },
    { label: 'Cafe', value: 'CAFE' },
    { label: 'Pub', value: 'PUB' },
    { label: 'Other', value: 'OTHER' },
];

const CATEGORIES = ['FARM_SHOP', 'RESTAURANT', 'ACTIVITY_PROVIDER', 'CAFE', 'PUB', 'OTHER'];

const inputClass = 'w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20';

export const AdminSuppliersPage: React.FC = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(0);
    const [data, setData] = useState<PageResponse<AdminSupplier> | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

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
                <div className="flex items-center gap-2">
                    <p className="font-medium">{s.businessName}</p>
                    {s.isDeactivated && <AdminStatusBadge status="DEACTIVATED" label="Deactivated" />}
                </div>
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
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#111418] dark:text-white">Suppliers</h2>
                <button onClick={() => setShowCreate(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors">
                    Create Supplier
                </button>
            </div>
            <AdminFilterPills options={CATEGORY_OPTIONS} selected={category} onChange={setCategory} />
            {loading ? (
                <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>
            ) : (
                <>
                    <AdminTable columns={columns} data={data?.content ?? []} keyExtractor={(s) => s.id} onRowClick={(s) => navigate(`/admin/suppliers/${s.id}`)} emptyMessage="No suppliers found" />
                    {data && <AdminPagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />}
                </>
            )}
            {showCreate && <CreateSupplierModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); fetchData(); }} />}
        </div>
    );
};

const CreateSupplierModal: React.FC<{ onClose: () => void; onCreated: () => void }> = ({ onClose, onCreated }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [businessName, setBusinessName] = useState('');
    const [supplierCategory, setSupplierCategory] = useState('OTHER');
    const [county, setCounty] = useState('');
    const [town, setTown] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!search.trim()) return;
        setSearching(true);
        try {
            const res = await adminUserService.eligibleSuppliers(search, 0, 10);
            setUsers(res.content);
        } catch { setUsers([]); }
        finally { setSearching(false); }
    };

    const handleCreate = async () => {
        if (!selectedUser) return;
        setError('');
        setSaving(true);
        try {
            await adminSupplierService.create({
                userId: selectedUser.id,
                businessName, county, category: supplierCategory,
                town: town || undefined,
                description: description || undefined,
            });
            onCreated();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to create supplier');
        } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white dark:bg-[#1a2632] rounded-xl shadow-xl max-w-lg w-full p-6">
                <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Create Supplier</h3>

                {step === 1 ? (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">Search for a user to link as a supplier.</p>
                        <div className="flex gap-2">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search by name or email..."
                                className={inputClass}
                            />
                            <button onClick={handleSearch} disabled={searching} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 whitespace-nowrap">
                                {searching ? '...' : 'Search'}
                            </button>
                        </div>
                        {users.length > 0 && (
                            <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-800">
                                {users.map(u => (
                                    <button key={u.id} onClick={() => { setSelectedUser(u); setStep(2); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <p className="text-sm font-medium text-[#111418] dark:text-white">{u.name}</p>
                                        <p className="text-xs text-gray-400">{u.email}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                        {users.length === 0 && search && !searching && (
                            <p className="text-sm text-gray-400">No eligible users found.</p>
                        )}
                        <div className="flex justify-end">
                            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-[#0d1520] rounded-lg p-3">
                            <p className="text-sm font-medium text-[#111418] dark:text-white">{selectedUser?.name}</p>
                            <p className="text-xs text-gray-400">{selectedUser?.email}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Business Name *</label>
                                <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Category *</label>
                                <select value={supplierCategory} onChange={(e) => setSupplierCategory(e.target.value)} className={inputClass}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">County *</label>
                                <input value={county} onChange={(e) => setCounty(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Town</label>
                                <input value={town} onChange={(e) => setTown(e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputClass} />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <div className="flex justify-between">
                            <button onClick={() => setStep(1)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Back</button>
                            <div className="flex gap-2">
                                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">Cancel</button>
                                <button onClick={handleCreate} disabled={saving || !businessName || !county} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50">
                                    {saving ? 'Creating...' : 'Create Supplier'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
