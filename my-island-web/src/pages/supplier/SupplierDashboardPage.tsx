import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supplierService, type SupplierDashboardStats, type Supplier } from '../../services/supplierService';

export const SupplierDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<SupplierDashboardStats | null>(null);
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            try {
                const [supplierData, statsData] = await Promise.all([
                    supplierService.getSupplierProfile(user.id),
                    supplierService.getDashboardStats('supplier-green-acres') // TODO: Use actual supplier ID
                ]);
                setSupplier(supplierData);
                setStats(statsData);
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

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                    Welcome back, {supplier?.businessName || user?.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Here's how your offers are performing
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon="local_offer"
                    label="Active Offers"
                    value={stats?.activeOffers || 0}
                    color="bg-lime-500"
                />
                <StatCard
                    icon="redeem"
                    label="Total Claims"
                    value={stats?.totalClaims || 0}
                    color="bg-blue-500"
                />
                <StatCard
                    icon="trending_up"
                    label="This Month"
                    value={stats?.thisMonthClaims || 0}
                    color="bg-purple-500"
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/supplier/offers"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Create New Offer
                    </Link>
                    <Link
                        to="/supplier/profile"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-lg">edit</span>
                        Edit Profile
                    </Link>
                </div>
            </div>

            {/* Recent Claims */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white">Recent Claims</h2>
                </div>
                {stats?.recentClaims && stats.recentClaims.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {stats.recentClaims.map((claim) => (
                            <div key={claim.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-gray-500">person</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#111418] dark:text-white">{claim.userName}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(claim.claimedAt).toLocaleDateString('en-IE', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    claim.status === 'redeemed'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : claim.status === 'claimed'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                }`}>
                                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                        <p>No claims yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard: React.FC<{ icon: string; label: string; value: number; color: string }> = ({
    icon,
    label,
    value,
    color
}) => (
    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-4">
            <div className={`size-12 rounded-xl ${color} flex items-center justify-center text-white`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            <div>
                <p className="text-2xl font-bold text-[#111418] dark:text-white">{value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            </div>
        </div>
    </div>
);
