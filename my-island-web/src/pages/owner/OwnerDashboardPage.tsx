import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOwnerSubscription } from '../../context/OwnerSubscriptionContext';
import {
    ownerService,
    type OwnerDashboardData,
    type LotsDetailResponse,
    type BookingsDetailResponse,
    type RevenueDetailResponse,
    type OccupancyDetailResponse,
} from '../../services/ownerService';
import { MetricDetailModal } from '../../components/supplier/metrics/MetricDetailModal';
import {
    LotsDetailTable,
    BookingsDetailTable,
    RevenueDetailView,
    OccupancyDetailView,
} from '../../components/owner/metrics';

type MetricType = 'lots' | 'bookings' | 'revenue' | 'occupancy' | null;

export const OwnerDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { subscription, isLoading: subscriptionLoading, redirectToCheckout } = useOwnerSubscription();
    const [data, setData] = useState<OwnerDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const hasActiveSubscription = subscription?.hasActiveSubscription ?? false;

    // Modal state
    const [activeMetric, setActiveMetric] = useState<MetricType>(null);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [lotsDetail, setLotsDetail] = useState<LotsDetailResponse | null>(null);
    const [bookingsDetail, setBookingsDetail] = useState<BookingsDetailResponse | null>(null);
    const [revenueDetail, setRevenueDetail] = useState<RevenueDetailResponse | null>(null);
    const [occupancyDetail, setOccupancyDetail] = useState<OccupancyDetailResponse | null>(null);

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

    const handleMetricClick = async (metric: MetricType) => {
        if (!user || !metric) return;

        // Require subscription for analytics
        if (!hasActiveSubscription) {
            return;
        }

        setActiveMetric(metric);
        setIsModalLoading(true);

        try {
            switch (metric) {
                case 'lots': {
                    const lots = await ownerService.getLotsDetail(user.id);
                    setLotsDetail(lots);
                    break;
                }
                case 'bookings': {
                    const bookings = await ownerService.getBookingsDetail(user.id);
                    setBookingsDetail(bookings);
                    break;
                }
                case 'revenue': {
                    const revenue = await ownerService.getRevenueDetail(user.id);
                    setRevenueDetail(revenue);
                    break;
                }
                case 'occupancy': {
                    const occupancy = await ownerService.getOccupancyDetail(user.id);
                    setOccupancyDetail(occupancy);
                    break;
                }
            }
        } catch (error) {
            console.error(`Failed to load ${metric} details:`, error);
        } finally {
            setIsModalLoading(false);
        }
    };

    const handleCloseModal = () => {
        setActiveMetric(null);
    };

    const getModalConfig = () => {
        switch (activeMetric) {
            case 'lots':
                return { title: 'Total Lots', icon: 'grid_view', iconColor: 'bg-primary' };
            case 'bookings':
                return { title: 'Upcoming Bookings', icon: 'calendar_month', iconColor: 'bg-blue-500' };
            case 'revenue':
                return { title: 'Revenue', icon: 'euro', iconColor: 'bg-purple-500' };
            case 'occupancy':
                return { title: 'Occupancy', icon: 'percent', iconColor: 'bg-amber-500' };
            default:
                return { title: '', icon: '', iconColor: '' };
        }
    };

    const renderModalContent = () => {
        switch (activeMetric) {
            case 'lots':
                return lotsDetail ? <LotsDetailTable data={lotsDetail} /> : null;
            case 'bookings':
                return bookingsDetail ? <BookingsDetailTable data={bookingsDetail} /> : null;
            case 'revenue':
                return revenueDetail ? <RevenueDetailView data={revenueDetail} /> : null;
            case 'occupancy':
                return occupancyDetail ? <OccupancyDetailView data={occupancyDetail} /> : null;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    const stats = data?.owner?.stats;
    const modalConfig = getModalConfig();

    return (
        <div className="space-y-6">
            {/* Limited Access Mode Warning */}
            {!subscriptionLoading && !hasActiveSubscription && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-xl">lock</span>
                        <div className="flex-1">
                            <h3 className="font-medium text-amber-800 dark:text-amber-200">Limited Access Mode</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                Your property is visible to guests but cannot receive new bookings. Subscribe to unlock all features including analytics, lot management, and the ability to accept bookings.
                            </p>
                            <button
                                onClick={redirectToCheckout}
                                className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">credit_card</span>
                                Subscribe Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                    onClick={() => handleMetricClick('lots')}
                    locked={!hasActiveSubscription}
                />
                <StatCard
                    icon="calendar_month"
                    label="Upcoming Bookings"
                    value={stats?.upcomingBookings || data?.upcomingCheckIns?.length || 0}
                    color="bg-blue-500"
                    onClick={() => handleMetricClick('bookings')}
                    locked={!hasActiveSubscription}
                />
                <StatCard
                    icon="euro"
                    label="This Month"
                    value={`€${stats?.monthlyRevenue || 0}`}
                    color="bg-purple-500"
                    isText
                    onClick={() => handleMetricClick('revenue')}
                    locked={!hasActiveSubscription}
                />
                <StatCard
                    icon="percent"
                    label="Occupancy"
                    value={`${stats?.occupancyRate || 0}%`}
                    color="bg-amber-500"
                    isText
                    onClick={() => handleMetricClick('occupancy')}
                    locked={!hasActiveSubscription}
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
                    {hasActiveSubscription ? (
                        <Link
                            to="/owner/calendar"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-lg">calendar_month</span>
                            View Calendar
                        </Link>
                    ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed opacity-60">
                            <span className="material-symbols-outlined text-lg">lock</span>
                            View Calendar
                        </span>
                    )}
                    {hasActiveSubscription ? (
                        <Link
                            to="/owner/bookings"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-lg">edit_calendar</span>
                            Create Booking
                        </Link>
                    ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed opacity-60">
                            <span className="material-symbols-outlined text-lg">lock</span>
                            Create Booking
                        </span>
                    )}
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
                                        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                                            booking.status === 'pending'
                                                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                                                : 'bg-green-100 dark:bg-green-900/30'
                                        }`}>
                                            <span className={`material-symbols-outlined text-lg ${
                                                booking.status === 'pending'
                                                    ? 'text-yellow-600 dark:text-yellow-400'
                                                    : 'text-green-600 dark:text-green-400'
                                            }`}>
                                                {booking.status === 'pending' ? 'pending_actions' : 'login'}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-[#111418] dark:text-white truncate">{booking.userName}</p>
                                                {booking.status === 'pending' && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                        PENDING
                                                    </span>
                                                )}
                                            </div>
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

            {/* Metric Detail Modal */}
            <MetricDetailModal
                isOpen={activeMetric !== null}
                onClose={handleCloseModal}
                title={modalConfig.title}
                icon={modalConfig.icon}
                iconColor={modalConfig.iconColor}
                isLoading={isModalLoading}
            >
                {renderModalContent()}
            </MetricDetailModal>
        </div>
    );
};

interface StatCardProps {
    icon: string;
    label: string;
    value: number | string;
    color: string;
    isText?: boolean;
    onClick?: () => void;
    locked?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
    icon,
    label,
    value,
    color,
    isText,
    onClick,
    locked = false
}) => (
    <button
        type="button"
        onClick={locked ? undefined : onClick}
        disabled={locked}
        className={`bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-left w-full transition-all group relative ${
            locked
                ? 'cursor-not-allowed opacity-75'
                : 'hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md cursor-pointer'
        }`}
        title={locked ? 'Subscribe to access analytics' : undefined}
    >
        {locked && (
            <div className="absolute top-2 right-2">
                <span className="material-symbols-outlined text-gray-400 text-lg">lock</span>
            </div>
        )}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`size-10 rounded-lg ${locked ? 'bg-gray-400' : color} flex items-center justify-center text-white shrink-0`}>
                    <span className="material-symbols-outlined text-xl">{icon}</span>
                </div>
                <div className="min-w-0">
                    <p className={`font-bold text-[#111418] dark:text-white truncate ${isText ? 'text-lg' : 'text-xl'}`}>{value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{label}</p>
                </div>
            </div>
            {!locked && (
                <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    chevron_right
                </span>
            )}
        </div>
    </button>
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
