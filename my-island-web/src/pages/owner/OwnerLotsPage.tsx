import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ownerService } from '../../services/ownerService';
import type { Lot } from '../../types/booking';
import { LotFormModal } from '../../components/owner/LotFormModal';
import clsx from 'clsx';

const LOT_TYPE_INFO: Record<string, { label: string; icon: string; color: string }> = {
    tent: { label: 'Tent Pitch', icon: '🏕️', color: 'bg-emerald-100 text-emerald-700' },
    touring: { label: 'Touring Pitch', icon: '🚐', color: 'bg-blue-100 text-blue-700' },
    glamping: { label: 'Glamping', icon: '⛺', color: 'bg-purple-100 text-purple-700' },
    cabin: { label: 'Cabin & Lodge', icon: '🏠', color: 'bg-amber-100 text-amber-700' },
    'mobile-home': { label: 'Mobile Home', icon: '🏠', color: 'bg-rose-100 text-rose-700' },
};

function getLotImageUrl(lot: Lot): string {
    const primaryImage = lot.images?.find(i => i.isPrimary);
    if (primaryImage) return primaryImage.url;
    if (lot.images && lot.images.length > 0) return lot.images[0].url;
    if (lot.imageUrl) return lot.imageUrl;
    return 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400';
}

export const OwnerLotsPage: React.FC = () => {
    const { user } = useAuth();
    const [lots, setLots] = useState<Lot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all');
    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLot, setEditingLot] = useState<Lot | null>(null);

    const loadLots = useCallback(async () => {
        if (!user) return;
        try {
            const data = await ownerService.getOwnerLots(user.id);
            setLots(data);
        } catch (error) {
            console.error('Failed to load lots:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadLots();
    }, [loadLots]);

    // Calculate counts by type
    const typeCounts = lots.reduce((acc, lot) => {
        const type = lot.type || 'tent';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const filteredLots = lots.filter(lot => {
        // Filter by availability
        if (filter === 'available' && !lot.isAvailable) return false;
        if (filter === 'unavailable' && lot.isAvailable) return false;
        // Filter by type
        if (typeFilter && lot.type !== typeFilter) return false;
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
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {typeFilter || filter !== 'all' ? (
                            <>Showing {filteredLots.length} of {lots.length} lots</>
                        ) : (
                            <>{lots.length} total lots</>
                        )}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingLot(null);
                        setIsModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#20d85f] transition-colors text-sm font-medium w-full sm:w-auto"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add New Lot
                </button>
            </div>

            {/* Type Filter */}
            {Object.keys(typeCounts).length > 0 && (
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">By Type</h2>
                        {typeFilter && (
                            <button
                                onClick={() => setTypeFilter(null)}
                                className="text-xs text-primary hover:text-emerald-600 font-medium"
                            >
                                Clear filter
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(LOT_TYPE_INFO).map(([type, info]) => {
                            const count = typeCounts[type] || 0;
                            if (count === 0) return null;
                            const isActive = typeFilter === type;
                            return (
                                <button
                                    key={type}
                                    onClick={() => setTypeFilter(isActive ? null : type)}
                                    className={clsx(
                                        'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                                        isActive
                                            ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 dark:ring-offset-[#1a2632]'
                                            : `${info.color} hover:opacity-80`
                                    )}
                                >
                                    <span>{info.icon}</span>
                                    <span>{info.label}</span>
                                    <span className={clsx(
                                        'px-1.5 py-0.5 rounded-full text-xs font-bold',
                                        isActive ? 'bg-white/20' : 'bg-black/10'
                                    )}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Availability Filters */}
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
                                style={{ backgroundImage: `url("${getLotImageUrl(lot)}")` }}
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
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingLot(lot);
                                                setIsModalOpen(true);
                                            }}
                                            className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (window.confirm(`Delete "${lot.name}"? This cannot be undone.`)) {
                                                    try {
                                                        await ownerService.deleteLot(lot.id);
                                                        setLots(prev => prev.filter(l => l.id !== lot.id));
                                                    } catch (err) {
                                                        console.error('Failed to delete lot:', err);
                                                    }
                                                }
                                            }}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete lot"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
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

            <LotFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingLot(null);
                }}
                lot={editingLot}
                onSaved={() => loadLots()}
            />
        </div>
    );
};
