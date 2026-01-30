import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ownerService } from '../../services/ownerService';
import type { Lot } from '../../services/adminService';
import clsx from 'clsx';

const LOT_TYPE_INFO: Record<string, { label: string; icon: string; color: string }> = {
    tent: { label: 'Tent', icon: '🏕️', color: 'bg-emerald-100 text-emerald-700' },
    glamping: { label: 'Glamping', icon: '⛺', color: 'bg-amber-100 text-amber-700' },
    rv: { label: 'RV/Caravan', icon: '🚐', color: 'bg-blue-100 text-blue-700' },
    cabin: { label: 'Cabin', icon: '🏠', color: 'bg-purple-100 text-purple-700' },
    lodge: { label: 'Lodge', icon: '🏠', color: 'bg-purple-100 text-purple-700' },
    'mobile-home': { label: 'Mobile Home', icon: '🏠', color: 'bg-indigo-100 text-indigo-700' },
};

export const OwnerLotsPage: React.FC = () => {
    const { user } = useAuth();
    const [lots, setLots] = useState<Lot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all');

    useEffect(() => {
        const loadLots = async () => {
            if (!user) return;
            try {
                const data = await ownerService.getOwnerLots(user.id);
                setLots(data);
            } catch (error) {
                console.error('Failed to load lots:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadLots();
    }, [user]);

    const filteredLots = lots.filter(lot => {
        if (filter === 'available') return lot.isAvailable;
        if (filter === 'unavailable') return !lot.isAvailable;
        return true;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white">My Lots</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{lots.length} total lots</p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#20d85f] transition-colors text-sm font-medium w-full sm:w-auto">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add New Lot
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {(['all', 'available', 'unavailable'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={clsx(
                            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                            filter === f
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        )}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Lots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLots.map((lot) => {
                    const typeInfo = LOT_TYPE_INFO[lot.type] || LOT_TYPE_INFO.tent;
                    return (
                        <div
                            key={lot.id}
                            className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div
                                className="h-32 bg-cover bg-center"
                                style={{ backgroundImage: `url("${lot.imageUrl || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400'}")` }}
                            >
                                <div className="p-3 flex justify-between items-start">
                                    <span className={clsx('text-xs font-medium px-2 py-1 rounded-full', typeInfo.color)}>
                                        {typeInfo.icon} {typeInfo.label}
                                    </span>
                                    <span className={clsx(
                                        'text-xs font-medium px-2 py-1 rounded-full',
                                        lot.isAvailable
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    )}>
                                        {lot.isAvailable ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-[#111418] dark:text-white mb-1">{lot.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{lot.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-primary">€{lot.pricePerNight}<span className="text-xs text-gray-400 font-normal">/night</span></span>
                                    <button className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredLots.length === 0 && (
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">grid_view</span>
                    <p className="text-gray-500 dark:text-gray-400">No lots found</p>
                </div>
            )}
        </div>
    );
};
