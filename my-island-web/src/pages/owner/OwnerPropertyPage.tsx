import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ownerService, type Owner } from '../../services/ownerService';

export const OwnerPropertyPage: React.FC = () => {
    const { user } = useAuth();
    const [owner, setOwner] = useState<Owner | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadOwner = async () => {
            if (!user) return;
            try {
                const data = await ownerService.getOwnerProfile(user.id);
                setOwner(data);
            } catch (error) {
                console.error('Failed to load owner profile:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadOwner();
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Property Details</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your property information</p>
            </div>

            {owner?.coverImageUrl && (
                <div className="rounded-xl overflow-hidden">
                    <img
                        src={owner.coverImageUrl}
                        alt="Property cover"
                        className="w-full h-48 object-cover"
                    />
                </div>
            )}

            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Property Name</label>
                    <p className="text-lg font-bold text-[#111418] dark:text-white">{owner?.propertyName || 'Not set'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">County</label>
                        <p className="text-[#111418] dark:text-white">{owner?.county || 'Not set'}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Town</label>
                        <p className="text-[#111418] dark:text-white">{owner?.town || 'Not set'}</p>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                    <p className="text-[#111418] dark:text-white text-sm leading-relaxed">{owner?.description || 'No description provided'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Contact Email</label>
                        <p className="text-[#111418] dark:text-white text-sm">{owner?.contactEmail || 'Not set'}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Contact Phone</label>
                        <p className="text-[#111418] dark:text-white text-sm">{owner?.contactPhone || 'Not set'}</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#20d85f] transition-colors text-sm font-medium">
                        <span className="material-symbols-outlined text-lg">edit</span>
                        Edit Property
                    </button>
                </div>
            </div>
        </div>
    );
};
