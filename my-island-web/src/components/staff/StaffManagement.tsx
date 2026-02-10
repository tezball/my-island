import React, { useState, useEffect } from 'react';
import type { StaffMember } from '../../services/staffService';

interface RoleOption {
    readonly value: string;
    readonly label: string;
    readonly description: string;
}

interface StaffManagementProps {
    listStaff: () => Promise<StaffMember[]>;
    addStaff: (email: string, role: string) => Promise<StaffMember>;
    removeStaff: (id: number) => Promise<void>;
    updateRole: (id: number, role: string) => Promise<StaffMember>;
    roles: readonly RoleOption[];
    accentColor?: string;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({
    listStaff,
    addStaff,
    removeStaff,
    updateRole,
    roles,
    accentColor = 'primary',
}) => {
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState(roles[0].value);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<number | null>(null);
    const [updatingRoleId, setUpdatingRoleId] = useState<number | null>(null);

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        try {
            const data = await listStaff();
            setStaffMembers(data);
        } catch {
            setError('Failed to load staff members');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsAdding(true);
        setError(null);
        try {
            const newMember = await addStaff(email.trim(), selectedRole);
            setStaffMembers(prev => [...prev, newMember]);
            setEmail('');
            setSelectedRole(roles[0].value);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add staff member');
        } finally {
            setIsAdding(false);
        }
    };

    const handleRoleChange = async (memberId: number, newRole: string) => {
        setUpdatingRoleId(memberId);
        setError(null);
        try {
            const updated = await updateRole(memberId, newRole);
            setStaffMembers(prev => prev.map(s => s.id === memberId ? updated : s));
        } catch {
            setError('Failed to update role');
        } finally {
            setUpdatingRoleId(null);
        }
    };

    const handleRemove = async (id: number) => {
        setRemovingId(id);
        setError(null);
        try {
            await removeStaff(id);
            setStaffMembers(prev => prev.filter(s => s.id !== id));
        } catch {
            setError('Failed to remove staff member');
        } finally {
            setRemovingId(null);
        }
    };

    const buttonBg = accentColor === 'lime' ? 'bg-lime-500 hover:bg-lime-600' : 'bg-primary hover:bg-emerald-600';
    const focusRing = accentColor === 'lime' ? 'focus:ring-lime-500/50' : 'focus:ring-primary/50';

    return (
        <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-xl text-gray-600 dark:text-gray-400">group</span>
                <h2 className="text-base font-bold text-[#111418] dark:text-white">Staff Members</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Add team members by email and assign them a role to control their access level.
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-6">
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="staff@example.com"
                    required
                    className={`flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0d1520] text-[#111418] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${focusRing}`}
                />
                <select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                    className={`px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0d1520] text-[#111418] dark:text-white focus:outline-none focus:ring-2 ${focusRing}`}
                >
                    {roles.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                </select>
                <button
                    type="submit"
                    disabled={isAdding || !email.trim()}
                    className={`px-4 py-2 text-sm font-medium text-white ${buttonBg} rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap`}
                >
                    {isAdding ? 'Adding...' : 'Add'}
                </button>
            </form>

            {/* Role descriptions */}
            <div className="mb-6 grid grid-cols-2 gap-2">
                {roles.map(r => (
                    <div key={r.value} className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{r.label}:</span>
                        <span>{r.description}</span>
                    </div>
                ))}
            </div>

            {isLoading ? (
                <div className="animate-pulse space-y-3">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            ) : staffMembers.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                    No staff members yet
                </p>
            ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {staffMembers.map(member => (
                        <div key={member.id} className="flex items-center justify-between py-3 gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-[#111418] dark:text-white truncate">
                                    {member.userName || member.email}
                                </p>
                                {member.userName && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <select
                                    value={member.role}
                                    onChange={e => handleRoleChange(member.id, e.target.value)}
                                    disabled={updatingRoleId === member.id}
                                    className={`px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0d1520] text-[#111418] dark:text-white focus:outline-none focus:ring-1 ${focusRing} disabled:opacity-50`}
                                >
                                    {roles.map(r => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                                <span
                                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                        member.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    }`}
                                >
                                    {member.status === 'ACTIVE' ? 'Active' : 'Invited'}
                                </span>
                                <button
                                    onClick={() => handleRemove(member.id)}
                                    disabled={removingId === member.id}
                                    className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                    title="Remove staff member"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
