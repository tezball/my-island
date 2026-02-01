import React from 'react';
import type { RevenueDetailResponse } from '../../../services/ownerService';
import { SimpleBarChart } from './SimpleBarChart';

interface RevenueDetailViewProps {
    data: RevenueDetailResponse;
}

const TYPE_LABELS: Record<string, string> = {
    'tent': 'Tent Pitches',
    'touring': 'Touring Pitches',
    'glamping': 'Glamping',
    'cabin': 'Cabins & Lodges',
    'mobile-home': 'Mobile Homes',
};

const TYPE_COLORS: Record<string, string> = {
    'tent': 'bg-emerald-500',
    'touring': 'bg-blue-500',
    'glamping': 'bg-purple-500',
    'cabin': 'bg-amber-500',
    'mobile-home': 'bg-rose-500',
};

export const RevenueDetailView: React.FC<RevenueDetailViewProps> = ({ data }) => {
    const changeIsPositive = data.summary.monthOverMonthChange >= 0;

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-lg sm:text-2xl font-bold text-purple-700 dark:text-purple-400">
                        €{data.summary.thisMonth.toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">This Month</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-lg sm:text-2xl font-bold text-gray-700 dark:text-gray-300">
                        €{data.summary.lastMonth.toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Last Month</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-lg sm:text-2xl font-bold text-blue-700 dark:text-blue-400">
                        €{data.summary.yearToDate.toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Year to Date</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-lg sm:text-2xl font-bold text-[#111418] dark:text-white">
                        €{data.summary.avgBookingValue}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Avg Booking</p>
                </div>
                <div className={`rounded-lg p-3 sm:p-4 text-center col-span-2 sm:col-span-1 ${
                    changeIsPositive
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'bg-red-50 dark:bg-red-900/20'
                }`}>
                    <p className={`text-lg sm:text-2xl font-bold flex items-center justify-center gap-1 ${
                        changeIsPositive
                            ? 'text-green-700 dark:text-green-400'
                            : 'text-red-700 dark:text-red-400'
                    }`}>
                        <span className="material-symbols-outlined text-lg">
                            {changeIsPositive ? 'trending_up' : 'trending_down'}
                        </span>
                        {changeIsPositive ? '+' : ''}{data.summary.monthOverMonthChange}%
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">vs Last Month</p>
                </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">6-Month Revenue Trend</h3>
                <SimpleBarChart
                    data={data.monthlyTrend.map(item => ({
                        label: item.month,
                        value: item.revenue,
                        color: 'bg-purple-500',
                    }))}
                    orientation="vertical"
                    valuePrefix="€"
                    showValues={true}
                />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Revenue by Type */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Revenue by Lot Type</h3>
                    <div className="space-y-3">
                        {data.byType.map((item) => (
                            <div key={item.type}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {TYPE_LABELS[item.type] || item.type}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            €{item.revenue.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            ({item.percentage}%)
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${TYPE_COLORS[item.type] || 'bg-gray-500'}`}
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performing Lots */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Top Performing Lots</h3>
                    <div className="space-y-3">
                        {data.topLots.map((lot, index) => (
                            <div
                                key={lot.name}
                                className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`size-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                        index === 0 ? 'bg-yellow-500' :
                                        index === 1 ? 'bg-gray-400' :
                                        index === 2 ? 'bg-amber-600' :
                                        'bg-gray-300 dark:bg-gray-600'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#111418] dark:text-white">{lot.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {TYPE_LABELS[lot.type] || lot.type} • {lot.bookings} bookings
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                                    €{lot.revenue.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
