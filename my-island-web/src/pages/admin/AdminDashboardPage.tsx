import React, { useEffect, useState } from 'react';
import { adminDashboardService } from '../../services/adminService';
import { KpiCard } from '../../components/admin/dashboard/KpiCard';
import { RevenueChart } from '../../components/admin/dashboard/RevenueChart';
import { BookingBreakdownChart } from '../../components/admin/dashboard/BookingBreakdownChart';
import { ActivityFeed } from '../../components/admin/dashboard/ActivityFeed';
import type { DashboardStats } from '../../types/admin';

export const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminDashboardService.getStats()
            .then(setStats)
            .catch(() => setStats(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard icon="group" label="Total Users" value={stats?.totalUsers ?? 0} />
                <KpiCard icon="event_note" label="Total Bookings" value={stats?.totalBookings ?? 0} />
                <KpiCard icon="cottage" label="Active Owners" value={stats?.activeOwners ?? 0} />
                <KpiCard icon="storefront" label="Active Suppliers" value={stats?.activeSuppliers ?? 0} />
                <KpiCard icon="payments" label="Total Revenue" value={`€${(stats?.totalRevenue ?? 0).toLocaleString()}`} />
                <KpiCard icon="person_add" label="New Users This Month" value={stats?.newUsersThisMonth ?? 0} />
                <KpiCard icon="cottage" label="Total Owners" value={stats?.totalOwners ?? 0} />
                <KpiCard icon="storefront" label="Total Suppliers" value={stats?.totalSuppliers ?? 0} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart />
                <BookingBreakdownChart />
            </div>

            {/* Activity Feed */}
            <ActivityFeed />
        </div>
    );
};
