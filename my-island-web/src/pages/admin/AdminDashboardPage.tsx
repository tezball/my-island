import React, { useEffect, useState } from 'react';
import { adminService, type DashboardStats, type Lot } from '../../services/adminService';

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`€${stats.totalRevenue.toLocaleString()}`}
                    icon="payments"
                    color="bg-green-500"
                    trend="Confirmed bookings"
                />
                <StatCard
                    title="Pending Revenue"
                    value={`€${stats.pendingRevenue.toLocaleString()}`}
                    icon="pending"
                    color="bg-yellow-500"
                    trend="Awaiting confirmation"
                />
                <StatCard
                    title="Active Bookings"
                    value={stats.activeBookings.toString()}
                    icon="event_available"
                    color="bg-blue-500"
                    trend="Confirmed & checked in"
                />
                <StatCard
                    title="Occupancy Rate"
                    value={`${stats.occupancyRate}%`}
                    icon="camping"
                    color="bg-orange-500"
                    trend="Current capacity"
                />
            </div>

            {/* Today's Activity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-[#1a2632] rounded-xl p-4 border border-gray-200 dark:border-gray-800 flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl text-green-600 dark:text-green-400">login</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#111418] dark:text-white">{stats.todayCheckIns}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Check-ins Today</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1a2632] rounded-xl p-4 border border-gray-200 dark:border-gray-800 flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400">logout</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#111418] dark:text-white">{stats.todayCheckOuts}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Check-outs Today</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1a2632] rounded-xl p-4 border border-gray-200 dark:border-gray-800 flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl text-yellow-600 dark:text-yellow-400">schedule</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#111418] dark:text-white">{stats.pendingBookings}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pending Approval</p>
                    </div>
                </div>
            </div>

            {/* Financial Reporting Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue by Type */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-lg font-bold text-[#111418] dark:text-white">Revenue by Accommodation</h2>
                    </div>
                    <div className="p-6">
                        {stats.revenueByType.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No revenue data available</p>
                        ) : (
                            <div className="space-y-4">
                                {stats.revenueByType.map((item) => {
                                    const maxRevenue = Math.max(...stats.revenueByType.map(r => r.revenue));
                                    const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                                    return (
                                        <div key={item.type}>
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-lg text-gray-500">
                                                        {getTypeIcon(item.type)}
                                                    </span>
                                                    <span className="text-sm font-medium text-[#111418] dark:text-white capitalize">
                                                        {item.type === 'rv' ? 'Caravan/RV' : item.type === 'mobile-home' ? 'Mobile Home' : item.type}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold text-[#111418] dark:text-white">€{item.revenue.toLocaleString()}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({item.bookingCount} bookings)</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${getTypeColor(item.type)}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Monthly Revenue Trend */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-lg font-bold text-[#111418] dark:text-white">Monthly Revenue Trend</h2>
                    </div>
                    <div className="p-6">
                        {stats.monthlyRevenue.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No monthly data available</p>
                        ) : (
                            <div className="flex items-end justify-between gap-2 h-40">
                                {stats.monthlyRevenue.map((item, index) => {
                                    const maxRevenue = Math.max(...stats.monthlyRevenue.map(r => r.revenue));
                                    const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full flex flex-col items-center justify-end h-28">
                                                <span className="text-xs font-medium text-[#111418] dark:text-white mb-1">
                                                    €{item.revenue > 999 ? `${(item.revenue / 1000).toFixed(1)}k` : item.revenue}
                                                </span>
                                                <div
                                                    className="w-full max-w-[40px] bg-primary rounded-t transition-all duration-300"
                                                    style={{ height: `${Math.max(height, 4)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate w-full text-center">
                                                {item.month.split(' ')[0]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Bookings Section */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white">Recent Bookings</h2>
                    <button className="text-sm font-bold text-primary hover:text-green-600 transition-colors">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
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
                                        {(() => {
                                            const formatDate = (dateStr: string) => {
                                                if (dateStr.includes('/')) return dateStr;
                                                return new Date(dateStr).toLocaleDateString('en-GB');
                                            };
                                            return `${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}`;
                                        })()}
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

const getTypeIcon = (type: Lot['type']): string => {
    const icons: Record<Lot['type'], string> = {
        tent: 'camping',
        rv: 'rv_hookup',
        cabin: 'cabin',
        lodge: 'house',
        'mobile-home': 'home'
    };
    return icons[type] || 'camping';
};

const getTypeColor = (type: Lot['type']): string => {
    const colors: Record<Lot['type'], string> = {
        tent: 'bg-green-500',
        rv: 'bg-blue-500',
        cabin: 'bg-amber-500',
        lodge: 'bg-purple-500',
        'mobile-home': 'bg-pink-500'
    };
    return colors[type] || 'bg-gray-500';
};

const StatusBadge: React.FC<{ status: 'confirmed' | 'pending' | 'cancelled' | 'checked_in' | 'completed' }> = ({ status }) => {
    const styles = {
        confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        checked_in: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        completed: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status]}`}>
            {status}
        </span>
    );
};
