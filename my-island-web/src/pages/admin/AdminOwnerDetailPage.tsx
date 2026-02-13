import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminOwnerService } from '../../services/adminService';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import { AdminConfirmModal } from '../../components/admin/shared/AdminConfirmModal';
import type { AdminOwner, AdminOwnerUpdate } from '../../types/admin';

const PROPERTY_TYPES = ['TENT', 'TOURING', 'GLAMPING', 'CABIN', 'MOBILE_HOME'];

const inputClass = 'w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20';

export const AdminOwnerDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [owner, setOwner] = useState<AdminOwner | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<AdminOwnerUpdate>({});
    const [showDeactivate, setShowDeactivate] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        adminOwnerService.get(Number(id))
            .then((o) => { setOwner(o); resetForm(o); })
            .catch(() => navigate('/admin/owners'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const resetForm = (o: AdminOwner) => {
        setForm({
            propertyName: o.propertyName,
            county: o.county,
            town: o.town || '',
            propertyType: o.propertyType,
            description: o.description || '',
            phone: o.phone || '',
            website: o.website || '',
            latitude: o.latitude ?? undefined,
            longitude: o.longitude ?? undefined,
        });
    };

    const handleSave = async () => {
        if (!owner) return;
        setSaving(true);
        try {
            const updated = await adminOwnerService.update(owner.id, form);
            setOwner(updated);
            setEditing(false);
        } finally { setSaving(false); }
    };

    const handleToggleDeactivated = async () => {
        if (!owner) return;
        const updated = await adminOwnerService.toggleDeactivated(owner.id);
        setOwner(updated);
    };

    const setField = (field: keyof AdminOwnerUpdate, value: string | number | undefined) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    if (loading || !owner) {
        return <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>;
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <button onClick={() => navigate('/admin/owners')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Owners
            </button>

            {owner.isDeactivated && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">This owner has been deactivated.</p>
                </div>
            )}

            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-[#111418] dark:text-white">{owner.propertyName}</h2>
                            {owner.isDeactivated && <AdminStatusBadge status="DEACTIVATED" label="Deactivated" />}
                        </div>
                        <p className="text-sm text-gray-500">{owner.userName} &middot; {owner.userEmail}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowDeactivate(true)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${owner.isDeactivated ? 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20' : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20'}`}
                        >
                            {owner.isDeactivated ? 'Reactivate' : 'Deactivate'}
                        </button>
                        {!editing && (
                            <button onClick={() => { resetForm(owner); setEditing(true); }} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors">Edit</button>
                        )}
                    </div>
                </div>

                {editing ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Property Name</label>
                                <input value={form.propertyName || ''} onChange={(e) => setField('propertyName', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Property Type</label>
                                <select value={form.propertyType || ''} onChange={(e) => setField('propertyType', e.target.value)} className={inputClass}>
                                    {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
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
                                <div><p className="text-xs text-gray-400 mb-1">Type</p><p className="text-sm text-[#111418] dark:text-white">{owner.propertyType?.replace(/_/g, ' ')}</p></div>
                                {owner.description && <div className="col-span-2"><p className="text-xs text-gray-400 mb-1">Description</p><p className="text-sm text-[#111418] dark:text-white">{owner.description}</p></div>}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Location</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs text-gray-400 mb-1">County</p><p className="text-sm text-[#111418] dark:text-white">{owner.county}</p></div>
                                <div><p className="text-xs text-gray-400 mb-1">Town</p><p className="text-sm text-[#111418] dark:text-white">{owner.town || '-'}</p></div>
                                <div><p className="text-xs text-gray-400 mb-1">Latitude</p><p className="text-sm text-[#111418] dark:text-white">{owner.latitude ?? '-'}</p></div>
                                <div><p className="text-xs text-gray-400 mb-1">Longitude</p><p className="text-sm text-[#111418] dark:text-white">{owner.longitude ?? '-'}</p></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Contact</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs text-gray-400 mb-1">Phone</p><p className="text-sm text-[#111418] dark:text-white">{owner.phone || '-'}</p></div>
                                <div><p className="text-xs text-gray-400 mb-1">Website</p><p className="text-sm text-[#111418] dark:text-white">{owner.website || '-'}</p></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Platform</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs text-gray-400 mb-1">Subscription</p><AdminStatusBadge status={owner.subscriptionStatus} /></div>
                                <div><p className="text-xs text-gray-400 mb-1">Lots</p><p className="text-sm text-[#111418] dark:text-white">{owner.lotCount}</p></div>
                                <div><p className="text-xs text-gray-400 mb-1">Rating</p><p className="text-sm text-[#111418] dark:text-white">{owner.rating ? `${owner.rating.toFixed(1)} (${owner.reviewCount} reviews)` : 'No reviews'}</p></div>
                                <div><p className="text-xs text-gray-400 mb-1">Featured</p><AdminStatusBadge status={String(owner.isFeatured)} label={owner.isFeatured ? 'Featured' : 'Not Featured'} /></div>
                                <div><p className="text-xs text-gray-400 mb-1">Created</p><p className="text-sm text-[#111418] dark:text-white">{new Date(owner.createdAt).toLocaleDateString()}</p></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AdminConfirmModal
                isOpen={showDeactivate}
                onClose={() => setShowDeactivate(false)}
                onConfirm={handleToggleDeactivated}
                title={owner.isDeactivated ? 'Reactivate Owner' : 'Deactivate Owner'}
                message={owner.isDeactivated
                    ? `Are you sure you want to reactivate "${owner.propertyName}"? They will regain access to their dashboard.`
                    : `Are you sure you want to deactivate "${owner.propertyName}"? They will lose access to their dashboard.`}
                confirmLabel={owner.isDeactivated ? 'Reactivate' : 'Deactivate'}
                isDestructive={!owner.isDeactivated}
            />
        </div>
    );
};
