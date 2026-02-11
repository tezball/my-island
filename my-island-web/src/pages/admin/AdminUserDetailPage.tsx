import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminUserService } from '../../services/adminService';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import { AdminConfirmModal } from '../../components/admin/shared/AdminConfirmModal';
import type { AdminUser } from '../../types/admin';

export const AdminUserDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editIsOwner, setEditIsOwner] = useState(false);
    const [editIsSupplier, setEditIsSupplier] = useState(false);
    const [editIsAdmin, setEditIsAdmin] = useState(false);
    const [showToggleConfirm, setShowToggleConfirm] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        adminUserService.get(Number(id))
            .then((u) => {
                setUser(u);
                setEditName(u.name);
                setEditIsOwner(u.isOwner);
                setEditIsSupplier(u.isSupplier);
                setEditIsAdmin(u.isAdmin);
            })
            .catch(() => navigate('/admin/users'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const updated = await adminUserService.update(user.id, {
                name: editName, isOwner: editIsOwner, isSupplier: editIsSupplier, isAdmin: editIsAdmin,
            });
            setUser(updated);
            setEditing(false);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async () => {
        if (!user) return;
        const updated = await adminUserService.toggleActive(user.id);
        setUser(updated);
    };

    if (loading || !user) {
        return <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>;
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <button onClick={() => navigate('/admin/users')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Users
            </button>

            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-[#111418] dark:text-white">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowToggleConfirm(true)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${user.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30' : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30'}`}>
                            {user.isActive ? 'Disable' : 'Enable'} User
                        </button>
                        {!editing && (
                            <button onClick={() => setEditing(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors">
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                {editing ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
                            <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20" />
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {[
                                { label: 'Owner', value: editIsOwner, setter: setEditIsOwner },
                                { label: 'Supplier', value: editIsSupplier, setter: setEditIsSupplier },
                                { label: 'Admin', value: editIsAdmin, setter: setEditIsAdmin },
                            ].map(({ label, value, setter }) => (
                                <label key={label} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={value} onChange={(e) => setter(e.target.checked)} className="rounded border-gray-300 text-red-500 focus:ring-red-500" />
                                    <span className="text-sm text-[#111418] dark:text-white">{label}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Status</p>
                            <AdminStatusBadge status={String(user.isActive)} label={user.isActive ? 'Active' : 'Disabled'} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Email Verified</p>
                            <AdminStatusBadge status={String(user.emailVerified)} label={user.emailVerified ? 'Verified' : 'Not Verified'} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Roles</p>
                            <div className="flex flex-wrap gap-1">
                                {user.isOwner && <AdminStatusBadge status="ACTIVE" label="Owner" />}
                                {user.isSupplier && <AdminStatusBadge status="ACTIVE" label="Supplier" />}
                                {user.isAdmin && <AdminStatusBadge status="QUALIFIED" label="Admin" />}
                                {user.isStaff && <AdminStatusBadge status="TRIALING" label="Staff" />}
                                {!user.isOwner && !user.isSupplier && !user.isAdmin && !user.isStaff && <AdminStatusBadge status="NONE" label="Guest" />}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Joined</p>
                            <p className="text-sm text-[#111418] dark:text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                )}
            </div>

            <AdminConfirmModal
                isOpen={showToggleConfirm}
                onClose={() => setShowToggleConfirm(false)}
                onConfirm={handleToggleActive}
                title={user.isActive ? 'Disable User' : 'Enable User'}
                message={user.isActive ? `Are you sure you want to disable ${user.name}? They will not be able to log in.` : `Re-enable ${user.name}'s account?`}
                confirmLabel={user.isActive ? 'Disable' : 'Enable'}
                isDestructive={user.isActive}
            />
        </div>
    );
};
