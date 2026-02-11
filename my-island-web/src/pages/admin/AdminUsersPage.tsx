import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminUserService } from '../../services/adminService';
import { AdminSearchBar } from '../../components/admin/shared/AdminSearchBar';
import { AdminTable } from '../../components/admin/shared/AdminTable';
import { AdminPagination } from '../../components/admin/shared/AdminPagination';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import type { AdminUser, PageResponse } from '../../types/admin';

export const AdminUsersPage: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [data, setData] = useState<PageResponse<AdminUser> | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(() => {
        setLoading(true);
        adminUserService.list(search, page, 20)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [search, page]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    useEffect(() => { setPage(0); }, [search]);

    const columns = [
        { key: 'name', label: 'Name', render: (u: AdminUser) => (
            <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-gray-400">{u.email}</p>
            </div>
        )},
        { key: 'role', label: 'Roles', render: (u: AdminUser) => (
            <div className="flex flex-wrap gap-1">
                {u.isOwner && <AdminStatusBadge status="ACTIVE" label="Owner" />}
                {u.isSupplier && <AdminStatusBadge status="ACTIVE" label="Supplier" />}
                {u.isAdmin && <AdminStatusBadge status="QUALIFIED" label="Admin" />}
                {u.isStaff && <AdminStatusBadge status="TRIALING" label="Staff" />}
                {!u.isOwner && !u.isSupplier && !u.isAdmin && !u.isStaff && <AdminStatusBadge status="NONE" label="Guest" />}
            </div>
        )},
        { key: 'isActive', label: 'Status', render: (u: AdminUser) => (
            <AdminStatusBadge status={String(u.isActive)} label={u.isActive ? 'Active' : 'Disabled'} />
        )},
        { key: 'createdAt', label: 'Joined', render: (u: AdminUser) => (
            <span className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</span>
        )},
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#111418] dark:text-white">Users</h2>
            </div>
            <div className="max-w-sm">
                <AdminSearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." />
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
                </div>
            ) : (
                <>
                    <AdminTable
                        columns={columns}
                        data={data?.content ?? []}
                        keyExtractor={(u) => u.id}
                        onRowClick={(u) => navigate(`/admin/users/${u.id}`)}
                        emptyMessage="No users found"
                    />
                    {data && <AdminPagination page={data.number} totalPages={data.totalPages} onPageChange={setPage} />}
                </>
            )}
        </div>
    );
};
