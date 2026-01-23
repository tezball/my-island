import React, { useEffect, useState } from 'react';
import { adminService, type DashboardStats } from '../../services/adminService';

export const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`€${stats.totalRevenue}`}
                    icon="payments"
                    color="bg-green-500"
                    trend="+12% from last month"
                />
                <StatCard
                    title="Active Bookings"
                    value={stats.activeBookings.toString()}
                    icon="event_available"
                    color="bg-blue-500"
                    trend="+5 new today"
                />
                <StatCard
                    title="Occupancy Rate"
                    value={`${stats.occupancyRate}%`}
                    icon="camping"
                    color="bg-orange-500"
                    trend="High demand details"
                />
            </div>

            {/* Recent Bookings Section */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white">Recent Bookings</h2>
                    <button className="text-sm font-bold text-primary hover:text-green-600 transition-colors">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-3">Guest</th>
                                <th className="px-6 py-3">Lot</th>
                                <th className="px-6 py-3">Dates</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {stats.recentBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#111418] dark:text-white">{booking.userName}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{booking.lotName}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={booking.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-[#111418] dark:text-white">
                                        €{booking.totalPrice}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: string; icon: string; color: string; trend: string }> = ({ title, value, icon, color, trend }) => {
    return (
        <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-[#111418] dark:text-white mb-2">{value}</h3>
                <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    {trend}
                </p>
            </div>
            <div className={`size-12 rounded-xl ${color} flex items-center justify-center text-white shadow-lg shadow-${color.split('-')[1]}-500/30`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
        </div>
    );
};

const StatusBadge: React.FC<{ status: 'confirmed' | 'pending' | 'cancelled' }> = ({ status }) => {
    const styles = {
        confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status]}`}>
            {status}
        </span>
    );
};
