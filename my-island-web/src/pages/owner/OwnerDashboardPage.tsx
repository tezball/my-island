import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ownerService, type OwnerDashboardData } from '../../services/ownerService';

export const OwnerDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [data, setData] = useState<OwnerDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            try {
                const dashboardData = await ownerService.getDashboardData(user.id);
                setData(dashboardData);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    const stats = data?.owner?.stats;

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-1">
                    Welcome back, {data?.owner?.propertyName || user?.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Here's an overview of your property
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon="grid_view"
                    label="Total Lots"
                    value={stats?.totalLots || data?.lots?.length || 0}
                    color="bg-primary"
                />
                <StatCard
                    icon="calendar_month"
                    label="Upcoming Bookings"
                    value={stats?.upcomingBookings || data?.upcomingCheckIns?.length || 0}
                    color="bg-blue-500"
                />
                <StatCard
                    icon="euro"
                    label="This Month"
                    value={`€${stats?.monthlyRevenue || 0}`}
                    color="bg-purple-500"
                    isText
                />
                <StatCard
                    icon="percent"
                    label="Occupancy"
                    value={`${stats?.occupancyRate || 0}%`}
                    color="bg-amber-500"
                    isText
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4 md:p-6">
                <h2 className="text-base font-bold text-[#111418] dark:text-white mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/owner/lots"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#20d85f] transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add New Lot
                    </Link>
                    <Link
                        to="/owner/calendar"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-lg">calendar_month</span>
                        View Calendar
                    </Link>
                    <Link
                        to="/owner/property"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-lg">edit</span>
                        Edit Property
                    </Link>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Check-ins */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h2 className="text-base font-bold text-[#111418] dark:text-white">Upcoming Check-ins</h2>
                        <Link to="/owner/bookings" className="text-xs font-medium text-primary hover:underline">
                            View all
                        </Link>
                    </div>
                    {data?.upcomingCheckIns && data.upcomingCheckIns.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {data.upcomingCheckIns.map((booking) => (
                                <div key={booking.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">login</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-[#111418] dark:text-white truncate">{booking.userName}</p>
                                            <p className="text-xs text-gray-500 truncate">{booking.lotName}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 shrink-0 ml-2">
                                        {booking.startDate}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <span className="material-symbols-outlined text-3xl mb-2">event_available</span>
                            <p className="text-sm">No upcoming check-ins</p>
                        </div>
                    )}
                </div>

                {/* Upcoming Check-outs */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h2 className="text-base font-bold text-[#111418] dark:text-white">Upcoming Check-outs</h2>
                        <Link to="/owner/bookings" className="text-xs font-medium text-primary hover:underline">
                            View all
                        </Link>
                    </div>
                    {data?.upcomingCheckOuts && data.upcomingCheckOuts.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {data.upcomingCheckOuts.map((booking) => (
                                <div key={booking.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg">logout</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-[#111418] dark:text-white truncate">{booking.userName}</p>
                                            <p className="text-xs text-gray-500 truncate">{booking.lotName}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 shrink-0 ml-2">
                                        {booking.endDate}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <span className="material-symbols-outlined text-3xl mb-2">event_busy</span>
                            <p className="text-sm">No upcoming check-outs</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h2 className="text-base font-bold text-[#111418] dark:text-white">Recent Bookings</h2>
                    <Link to="/owner/bookings" className="text-xs font-medium text-primary hover:underline">
                        View all
                    </Link>
                </div>
                {data?.recentBookings && data.recentBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[500px]">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400">
                                    <th className="text-left font-medium px-4 py-3">Guest</th>
                                    <th className="text-left font-medium px-4 py-3">Lot</th>
                                    <th className="text-left font-medium px-4 py-3">Dates</th>
                                    <th className="text-left font-medium px-4 py-3">Status</th>
                                    <th className="text-right font-medium px-4 py-3">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {data.recentBookings.slice(0, 5).map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                        <td className="px-4 py-3 text-sm font-medium text-[#111418] dark:text-white">{booking.userName}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{booking.lotName}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                            {booking.startDate} - {booking.endDate}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-[#111418] dark:text-white text-right">
                                            €{booking.totalPrice}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <span className="material-symbols-outlined text-3xl mb-2">inbox</span>
                        <p className="text-sm">No bookings yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard: React.FC<{ icon: string; label: string; value: number | string; color: string; isText?: boolean }> = ({
    icon,
    label,
    value,
    color,
    isText
}) => (
    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-3">
            <div className={`size-10 rounded-lg ${color} flex items-center justify-center text-white shrink-0`}>
                <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
            <div className="min-w-0">
                <p className={`font-bold text-[#111418] dark:text-white truncate ${isText ? 'text-lg' : 'text-xl'}`}>{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{label}</p>
            </div>
        </div>
    </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const styles: Record<string, string> = {
        confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        checked_in: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    };

    return (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles[status] || styles.pending}`}>
            {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
    );
};
