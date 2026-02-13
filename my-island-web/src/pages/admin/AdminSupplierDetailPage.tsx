import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminSupplierService } from '../../services/adminService';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import { AdminConfirmModal } from '../../components/admin/shared/AdminConfirmModal';
import type { AdminSupplier, AdminSupplierUpdate } from '../../types/admin';

const CATEGORIES = ['FARM_SHOP', 'RESTAURANT', 'ACTIVITY_PROVIDER', 'CAFE', 'PUB', 'OTHER'];

const inputClass = 'w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20';

export const AdminSupplierDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState<AdminSupplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<AdminSupplierUpdate>({});
    const [showDeactivate, setShowDeactivate] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        adminSupplierService.get(Number(id))
            .then((s) => { setSupplier(s); resetForm(s); })
            .catch(() => navigate('/admin/suppliers'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const resetForm = (s: AdminSupplier) => {
        setForm({
            businessName: s.businessName,
            county: s.county,
            town: s.town || '',
            address: s.address || '',
            category: s.category,
            description: s.description || '',
            phone: s.phone || '',
            website: s.website || '',
            latitude: s.latitude ?? undefined,
            longitude: s.longitude ?? undefined,
        });
    };

    const handleSave = async () => {
        if (!supplier) return;
        setSaving(true);
        try {
            const updated = await adminSupplierService.update(supplier.id, form);
            setSupplier(updated);
            setEditing(false);
        } finally { setSaving(false); }
    };

    const handleToggleVerified = async () => {
        if (!supplier) return;
        const updated = await adminSupplierService.toggleVerified(supplier.id);
        setSupplier(updated);
    };

    const handleToggleDeactivated = async () => {
        if (!supplier) return;
        const updated = await adminSupplierService.toggleDeactivated(supplier.id);
        setSupplier(updated);
    };

    const setField = (field: keyof AdminSupplierUpdate, value: string | number | undefined) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    if (loading || !supplier) {
        return <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>;
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <button onClick={() => navigate('/admin/suppliers')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Suppliers
            </button>

            {supplier.isDeactivated && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">This supplier has been deactivated.</p>
                </div>
            )}

            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-[#111418] dark:text-white">{supplier.businessName}</h2>
                            {supplier.isDeactivated && <AdminStatusBadge status="DEACTIVATED" label="Deactivated" />}
                        </div>
                        <p className="text-sm text-gray-500">{supplier.userName} &middot; {supplier.userEmail}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowDeactivate(true)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${supplier.isDeactivated ? 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20' : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20'}`}
                        >
                            {supplier.isDeactivated ? 'Reactivate' : 'Deactivate'}
                        </button>
                        <button onClick={handleToggleVerified} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${supplier.isVerified ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20' : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20'}`}>
                            {supplier.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                        {!editing && <button onClick={() => { resetForm(supplier); setEditing(true); }} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600">Edit</button>}
                    </div>
                </div>

                {editing ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Business Name</label>
                                <input value={form.businessName || ''} onChange={(e) => setField('businessName', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Category</label>
                                <select value={form.category || ''} onChange={(e) => setField('category', e.target.value)} className={inputClass}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">County</label>
                                <input value={form.county || ''} onChange={(e) => setField('county', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Town</label>
                                <input value={form.town || ''} onChange={(e) => setField('town', e.target.value)} className={inputClass} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Address</label>
                                <input value={form.address || ''} onChange={(e) => setField('address', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Phone</label>
                                <input value={form.phone || ''} onChange={(e) => setField('phone', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Website</label>
                                <input value={form.website || ''} onChange={(e) => setField('website', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Latitude</label>
                                <input type="number" step="any" value={form.latitude ?? ''} onChange={(e) => setField('latitude', e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Longitude</label>
                                <input type="number" step="any" value={form.longitude ?? ''} onChange={(e) => setField('longitude', e.target.value ? Number(e.target.value) : undefined)} className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
                            <textarea value={form.description || ''} onChange={(e) => setField('description', e.target.value)} rows={3} className={inputClass} />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
                            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Core Info</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs text-gray-400 mb-1">Category</p><p className="text-sm text-[#111418] dark:text-white">{supplier.category?.replace(/_/g, ' ')}</p></div>
                                {supplier.description && <div className="col-span-2"><p className="text-xs text-gray-400 mb-1">Description</p><p className="text-sm text-[#111418] dark:text-white">{supplier.description}</p></div>}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Location</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs text-gray-400 mb-1">County</p><p className="text-sm text-[#111418] dark:text-white">{supplier.county}</p></div>
                                <div><p className="text-xs text-gray-400 mb-1">Town</p><p className="text-sm text-[#111418] dark:text-white">{supplier.town || '-'}</p></div>
                                <div className="col-span-2"><p className="text-xs text-gray-400 mb-1">Address</p><p className="text-sm text-[#111418] dark:text-white">{supplier.address || '-'}</p></div>
                                <div><p className="text-xs text-gray-400 mb-1">Latitude</p><p className="text-sm text-[#111418] dark:text-white">{supplier.latitude ?? '-'}</p></div>
                                <div><p className="text-xs text-gray-400 mb-1">Longitude</p><p className="text-sm text-[#111418] dark:text-white">{supplier.longitude ?? '-'}</p></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Contact</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs text-gray-400 mb-1">Phone</p><p className="text-sm text-[#111418] dark:text-white">{supplier.phone || '-'}</p></div>
                                <div><p className="text-xs text-gray-400 mb-1">Website</p><p className="text-sm text-[#111418] dark:text-white">{supplier.website || '-'}</p></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Platform</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs text-gray-400 mb-1">Verified</p><AdminStatusBadge status={String(supplier.isVerified)} label={supplier.isVerified ? 'Verified' : 'Unverified'} /></div>
                                <div><p className="text-xs text-gray-400 mb-1">Subscription</p><AdminStatusBadge status={supplier.subscriptionStatus} /></div>
                                <div><p className="text-xs text-gray-400 mb-1">Offers</p><p className="text-sm text-[#111418] dark:text-white">{supplier.offerCount}</p></div>
                                <div><p className="text-xs text-gray-400 mb-1">Rating</p><p className="text-sm text-[#111418] dark:text-white">{supplier.rating ? `${supplier.rating.toFixed(1)} (${supplier.reviewCount} reviews)` : 'No reviews'}</p></div>
                                <div><p className="text-xs text-gray-400 mb-1">Featured</p><AdminStatusBadge status={String(supplier.isFeatured)} label={supplier.isFeatured ? 'Featured' : 'Not Featured'} /></div>
                                <div><p className="text-xs text-gray-400 mb-1">Created</p><p className="text-sm text-[#111418] dark:text-white">{new Date(supplier.createdAt).toLocaleDateString()}</p></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AdminConfirmModal
                isOpen={showDeactivate}
                onClose={() => setShowDeactivate(false)}
                onConfirm={handleToggleDeactivated}
                title={supplier.isDeactivated ? 'Reactivate Supplier' : 'Deactivate Supplier'}
                message={supplier.isDeactivated
                    ? `Are you sure you want to reactivate "${supplier.businessName}"? They will regain access to their dashboard.`
                    : `Are you sure you want to deactivate "${supplier.businessName}"? They will lose access to their dashboard.`}
                confirmLabel={supplier.isDeactivated ? 'Reactivate' : 'Deactivate'}
                isDestructive={!supplier.isDeactivated}
            />
        </div>
    );
};
