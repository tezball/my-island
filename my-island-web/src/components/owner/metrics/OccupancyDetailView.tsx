import React from 'react';
import type { OccupancyDetailResponse } from '../../../services/ownerService';
import { SimpleBarChart } from './SimpleBarChart';

interface OccupancyDetailViewProps {
    data: OccupancyDetailResponse;
}

const TYPE_LABELS: Record<string, string> = {
    'tent': 'Tent Pitches',
    'touring': 'Touring Pitches',
    'glamping': 'Glamping',
    'cabin': 'Cabins & Lodges',
    'mobile-home': 'Mobile Homes',
};

const TYPE_ICONS: Record<string, string> = {
    'tent': 'camping',
    'touring': 'rv_hookup',
    'glamping': 'cottage',
    'cabin': 'cabin',
    'mobile-home': 'home',
};

export const OccupancyDetailView: React.FC<OccupancyDetailViewProps> = ({ data }) => {
    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-400">
                        {data.summary.currentRate}%
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Current Rate</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-[#111418] dark:text-white">
                        {data.summary.totalLots}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Lots</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">
                        {data.summary.availableLots}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Available</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-400">
                        {data.summary.occupiedLots}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Occupied</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 sm:p-4 text-center col-span-2 sm:col-span-1">
                    <p className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-purple-400">
                        {data.summary.avgStayDuration} days
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Avg Stay</p>
                </div>
            </div>

            {/* Weekly Trend Chart */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Weekly Occupancy Trend</h3>
                <SimpleBarChart
                    data={data.weeklyTrend.map(item => ({
                        label: item.day,
                        value: item.rate,
                        color: item.rate >= 80 ? 'bg-green-500' :
                               item.rate >= 60 ? 'bg-amber-500' :
                               item.rate >= 40 ? 'bg-yellow-500' : 'bg-red-400',
                    }))}
                    orientation="vertical"
                    valueSuffix="%"
                    maxValue={100}
                    showValues={true}
                />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Occupancy by Type */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Occupancy by Lot Type</h3>
                    <div className="space-y-4">
                        {data.byType.map((item) => (
                            <div key={item.type} className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
                                        {TYPE_ICONS[item.type] || 'home'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                            {TYPE_LABELS[item.type] || item.type}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                            {item.occupied}/{item.total}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${
                                                    item.rate >= 80 ? 'bg-green-500' :
                                                    item.rate >= 60 ? 'bg-amber-500' :
                                                    item.rate >= 40 ? 'bg-yellow-500' : 'bg-red-400'
                                                }`}
                                                style={{ width: `${item.rate}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-semibold text-[#111418] dark:text-white w-12 text-right">
                                            {item.rate}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Peak Days */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Peak Days</h3>
                    <div className="space-y-3">
                        {data.peakDays.map((peak, index) => (
                            <div
                                key={peak.day}
                                className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-full flex items-center justify-center ${
                                        index === 0 ? 'bg-amber-100 dark:bg-amber-900/30' :
                                        index === 1 ? 'bg-gray-100 dark:bg-gray-700' :
                                        'bg-orange-100 dark:bg-orange-900/30'
                                    }`}>
                                        <span className={`material-symbols-outlined ${
                                            index === 0 ? 'text-amber-600 dark:text-amber-400' :
                                            index === 1 ? 'text-gray-600 dark:text-gray-400' :
                                            'text-orange-600 dark:text-orange-400'
                                        }`}>
                                            {index === 0 ? 'emoji_events' : 'calendar_today'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#111418] dark:text-white">{peak.day}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {index === 0 ? 'Highest occupancy' :
                                             index === 1 ? 'Second highest' : 'Third highest'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-lg font-bold ${
                                        peak.avgRate >= 80 ? 'text-green-600 dark:text-green-400' :
                                        peak.avgRate >= 60 ? 'text-amber-600 dark:text-amber-400' :
                                        'text-yellow-600 dark:text-yellow-400'
                                    }`}>
                                        {peak.avgRate}%
                                    </span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">avg rate</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Insight */}
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg mt-0.5">
                                tips_and_updates
                            </span>
                            <div>
                                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Weekend Insight</p>
                                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                                    Weekends (Fri-Sun) show the highest demand. Consider adjusting pricing for peak periods.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
