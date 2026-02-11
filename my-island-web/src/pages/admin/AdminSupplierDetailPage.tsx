import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminSupplierService } from '../../services/adminService';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import type { AdminSupplier } from '../../types/admin';

export const AdminSupplierDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState<AdminSupplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editCounty, setEditCounty] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        adminSupplierService.get(Number(id))
            .then((s) => { setSupplier(s); setEditName(s.businessName); setEditCounty(s.county); setEditDesc(s.description || ''); })
            .catch(() => navigate('/admin/suppliers'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const handleSave = async () => {
        if (!supplier) return;
        setSaving(true);
        try {
            const updated = await adminSupplierService.update(supplier.id, { businessName: editName, county: editCounty, description: editDesc });
            setSupplier(updated);
            setEditing(false);
        } finally { setSaving(false); }
    };

    const handleToggleVerified = async () => {
        if (!supplier) return;
        const updated = await adminSupplierService.toggleVerified(supplier.id);
        setSupplier(updated);
    };

    if (loading || !supplier) {
        return <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>;
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <button onClick={() => navigate('/admin/suppliers')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Suppliers
            </button>

            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-[#111418] dark:text-white">{supplier.businessName}</h2>
                        <p className="text-sm text-gray-500">{supplier.userName} &middot; {supplier.userEmail}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleToggleVerified} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${supplier.isVerified ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20' : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20'}`}>
                            {supplier.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                        {!editing && <button onClick={() => setEditing(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600">Edit</button>}
                    </div>
                </div>

                {editing ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Business Name</label>
                            <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">County</label>
                            <input value={editCounty} onChange={(e) => setEditCounty(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
                            <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} className="w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
                            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-xs text-gray-400 mb-1">Category</p><p className="text-sm text-[#111418] dark:text-white">{supplier.category?.replace(/_/g, ' ')}</p></div>
                        <div><p className="text-xs text-gray-400 mb-1">Location</p><p className="text-sm text-[#111418] dark:text-white">{supplier.town ? `${supplier.town}, ` : ''}{supplier.county}</p></div>
                        <div><p className="text-xs text-gray-400 mb-1">Verified</p><AdminStatusBadge status={String(supplier.isVerified)} label={supplier.isVerified ? 'Verified' : 'Unverified'} /></div>
                        <div><p className="text-xs text-gray-400 mb-1">Subscription</p><AdminStatusBadge status={supplier.subscriptionStatus} /></div>
                        <div><p className="text-xs text-gray-400 mb-1">Offers</p><p className="text-sm text-[#111418] dark:text-white">{supplier.offerCount}</p></div>
                        <div><p className="text-xs text-gray-400 mb-1">Rating</p><p className="text-sm text-[#111418] dark:text-white">{supplier.rating ? `${supplier.rating.toFixed(1)} (${supplier.reviewCount} reviews)` : 'No reviews'}</p></div>
                        {supplier.description && <div className="col-span-2"><p className="text-xs text-gray-400 mb-1">Description</p><p className="text-sm text-[#111418] dark:text-white">{supplier.description}</p></div>}
                    </div>
                )}
            </div>
        </div>
    );
};
