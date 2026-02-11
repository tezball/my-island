import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminOwnerService } from '../../services/adminService';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import type { AdminOwner } from '../../types/admin';

export const AdminOwnerDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [owner, setOwner] = useState<AdminOwner | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editCounty, setEditCounty] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        adminOwnerService.get(Number(id))
            .then((o) => { setOwner(o); setEditName(o.propertyName); setEditCounty(o.county); setEditDesc(o.description || ''); })
            .catch(() => navigate('/admin/owners'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const handleSave = async () => {
        if (!owner) return;
        setSaving(true);
        try {
            const updated = await adminOwnerService.update(owner.id, { propertyName: editName, county: editCounty, description: editDesc });
            setOwner(updated);
            setEditing(false);
        } finally { setSaving(false); }
    };

    if (loading || !owner) {
        return <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>;
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <button onClick={() => navigate('/admin/owners')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Owners
            </button>

            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-[#111418] dark:text-white">{owner.propertyName}</h2>
                        <p className="text-sm text-gray-500">{owner.userName} &middot; {owner.userEmail}</p>
                    </div>
                    {!editing && (
                        <button onClick={() => setEditing(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors">Edit</button>
                    )}
                </div>

                {editing ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Property Name</label>
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
                        <div><p className="text-xs text-gray-400 mb-1">Type</p><p className="text-sm text-[#111418] dark:text-white">{owner.propertyType}</p></div>
                        <div><p className="text-xs text-gray-400 mb-1">Location</p><p className="text-sm text-[#111418] dark:text-white">{owner.town ? `${owner.town}, ` : ''}{owner.county}</p></div>
                        <div><p className="text-xs text-gray-400 mb-1">Subscription</p><AdminStatusBadge status={owner.subscriptionStatus} /></div>
                        <div><p className="text-xs text-gray-400 mb-1">Lots</p><p className="text-sm text-[#111418] dark:text-white">{owner.lotCount}</p></div>
                        <div><p className="text-xs text-gray-400 mb-1">Rating</p><p className="text-sm text-[#111418] dark:text-white">{owner.rating ? `${owner.rating.toFixed(1)} (${owner.reviewCount} reviews)` : 'No reviews'}</p></div>
                        <div><p className="text-xs text-gray-400 mb-1">Featured</p><AdminStatusBadge status={String(owner.isFeatured)} label={owner.isFeatured ? 'Featured' : 'Not Featured'} /></div>
                        {owner.description && <div className="col-span-2"><p className="text-xs text-gray-400 mb-1">Description</p><p className="text-sm text-[#111418] dark:text-white">{owner.description}</p></div>}
                    </div>
                )}
            </div>
        </div>
    );
};
