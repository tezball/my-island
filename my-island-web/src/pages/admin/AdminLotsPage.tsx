import React, { useEffect, useState } from 'react';
import { adminService, type Lot } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';

export const AdminLotsPage: React.FC = () => {
    const { user } = useAuth();
    const [lots, setLots] = useState<Lot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLot, setEditingLot] = useState<Lot | null>(null);

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

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this lot?')) {
            await adminService.deleteLot(id);
            setLots(lots.filter(l => l.id !== id));
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Lots & Campsites</h1>
                <button
                    onClick={() => { setEditingLot(null); setIsModalOpen(true); }}
                    className="bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-[#20d85f] transition-all flex items-center gap-2 shadow-sm"
                >
                    <span className="material-symbols-outlined">add</span>
                    Add New Lot
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div>Loading lots...</div>
                ) : lots.map((lot) => (
                    <div key={lot.id} className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden group">
                        <div className="h-48 bg-gray-200 relative overflow-hidden">
                            {lot.imageUrl && (
                                <img src={lot.imageUrl} alt={lot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            )}
                            <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                €{lot.pricePerNight}/night
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-[#111418] dark:text-white text-lg">{lot.name}</h3>
                                    <p className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full inline-block mt-1 capitalize">{lot.type}</p>
                                </div>
                                <span className={`size-3 rounded-full ${lot.isAvailable ? 'bg-green-500' : 'bg-red-500'} ring-2 ring-white dark:ring-[#1a2632]`}></span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 h-10">
                                {lot.description}
                            </p>

                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg">
                                    <span className="material-symbols-outlined text-xl">edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(lot.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                >
                                    <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Modal Placeholder for Add/Edit - In a real app this would be a separate component */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1a2632] rounded-2xl max-w-lg w-full p-6 shadow-2xl">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">{editingLot ? 'Edit Lot' : 'Add New Lot'}</h2>
                        <p className="text-gray-500 mb-6">Form implementation would go here (Name, Type, Price, Amenities, etc).</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-primary text-white font-bold rounded-lg"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
