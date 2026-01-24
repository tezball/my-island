import React, { useEffect, useState, useMemo } from 'react';
import { adminService, type Lot } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { LotFilters, LotTable, LotFormModal, LotBulkActionsBar } from '../../components/admin/lots';

const ITEMS_PER_PAGE = 12;

export const AdminLotsPage: React.FC = () => {
    const { user } = useAuth();

    // Data state
    const [lots, setLots] = useState<Lot[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<Lot['type'] | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'unavailable'>('all');

    // Selection state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLot, setEditingLot] = useState<Lot | null>(null);

    // Load lots
    useEffect(() => {
        if (user?.id) {
            loadLots(user.id);
        }
    }, [user?.id]);

    const loadLots = async (userId: string) => {
        setIsLoading(true);
        try {
            const data = await adminService.getLots(userId);
            setLots(data);
        } catch (error) {
            console.error('Failed to load lots:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter lots
    const filteredLots = useMemo(() => {
        return lots.filter(lot => {
            const matchesSearch = lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lot.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = typeFilter === 'all' || lot.type === typeFilter;
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'available' ? lot.isAvailable : !lot.isAvailable);
            return matchesSearch && matchesType && matchesStatus;
        });
    }, [lots, searchQuery, typeFilter, statusFilter]);

    // Paginate lots
    const totalPages = Math.ceil(filteredLots.length / ITEMS_PER_PAGE);
    const paginatedLots = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredLots.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredLots, currentPage]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, typeFilter, statusFilter]);

    // Clear invalid selections when lots change
    useEffect(() => {
        const lotIds = new Set(lots.map(l => l.id));
        setSelectedIds(prev => {
            const newSet = new Set<string>();
            prev.forEach(id => {
                if (lotIds.has(id)) newSet.add(id);
            });
            return newSet;
        });
    }, [lots]);

    // Selection handlers
    const handleSelect = (id: string, selected: boolean) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (selected) {
                newSet.add(id);
            } else {
                newSet.delete(id);
            }
            return newSet;
        });
    };

    const handleClearSelection = () => {
        setSelectedIds(new Set());
    };

    // CRUD handlers
    const handleEdit = (lot: Lot) => {
        setEditingLot(lot);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this lot?')) {
            await adminService.deleteLot(id);
            setLots(prev => prev.filter(l => l.id !== id));
        }
    };

    const handleSave = async (lotData: Omit<Lot, 'id'>) => {
        if (editingLot) {
            // Update existing lot
            await adminService.updateLot(editingLot.id, lotData);
            setLots(prev => prev.map(l => l.id === editingLot.id ? { ...l, ...lotData } : l));
        } else {
            // Add new lot
            const newLot = await adminService.addLot(lotData);
            setLots(prev => [...prev, newLot]);
        }
    };

    // Bulk action handlers
    const handleBulkSetAvailable = async () => {
        const ids = Array.from(selectedIds);
        await adminService.updateLotsAvailability(ids, true);
        setLots(prev => prev.map(l => ids.includes(l.id) ? { ...l, isAvailable: true } : l));
        setSelectedIds(new Set());
    };

    const handleBulkSetUnavailable = async () => {
        const ids = Array.from(selectedIds);
        await adminService.updateLotsAvailability(ids, false);
        setLots(prev => prev.map(l => ids.includes(l.id) ? { ...l, isAvailable: false } : l));
        setSelectedIds(new Set());
    };

    const handleBulkDelete = async () => {
        const ids = Array.from(selectedIds);
        await adminService.deleteLots(ids);
        setLots(prev => prev.filter(l => !ids.includes(l.id)));
        setSelectedIds(new Set());
    };

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Lots & Campsites</h1>
                <button
                    onClick={() => { setEditingLot(null); setIsModalOpen(true); }}
                    className="bg-primary text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <span className="material-symbols-outlined text-xl">add</span>
                    Add New Lot
                </button>
            </div>

            {/* Filters */}
            <LotFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                totalCount={lots.length}
                filteredCount={filteredLots.length}
            />

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            ) : filteredLots.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl text-gray-400">camping</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-2">No lots found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        {lots.length === 0 ? 'Add your first lot to get started.' : 'Try adjusting your filters.'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Lot Table */}
                    <LotTable
                        lots={paginatedLots}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                        onSelectAll={(selected) => {
                            if (selected) {
                                const newIds = new Set(selectedIds);
                                paginatedLots.forEach(lot => newIds.add(lot.id));
                                setSelectedIds(newIds);
                            } else {
                                const newIds = new Set(selectedIds);
                                paginatedLots.forEach(lot => newIds.delete(lot.id));
                                setSelectedIds(newIds);
                            }
                        }}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page
                                        ? 'bg-primary text-white'
                                        : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Add/Edit Modal */}
            <LotFormModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingLot(null); }}
                lot={editingLot}
                onSave={handleSave}
                ownerId={user?.id || ''}
            />

            {/* Bulk Actions Bar */}
            <LotBulkActionsBar
                selectedCount={selectedIds.size}
                onClearSelection={handleClearSelection}
                onSetAvailable={handleBulkSetAvailable}
                onSetUnavailable={handleBulkSetUnavailable}
                onDelete={handleBulkDelete}
            />
        </div>
    );
};
