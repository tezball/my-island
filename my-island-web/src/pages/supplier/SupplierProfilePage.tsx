import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supplierService, type Supplier, type OfferCategory } from '../../services/supplierService';

const CATEGORIES: { value: OfferCategory; label: string }[] = [
    { value: 'FOOD', label: 'Food & Drink' },
    { value: 'ACTIVITIES', label: 'Activities' },
    { value: 'GEAR', label: 'Gear Rental' },
    { value: 'ATTRACTIONS', label: 'Attractions' },
    { value: 'TRANSPORT', label: 'Transport' }
];

export const SupplierProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        businessName: '',
        description: '',
        logo: '',
        category: 'FOOD' as OfferCategory,
        location: '',
        contactEmail: '',
        contactPhone: ''
    });

    useEffect(() => {
        const loadProfile = async () => {
            if (!user) return;
            try {
                const data = await supplierService.getSupplierProfile(user.id);
                if (data) {
                    setSupplier(data);
                    setFormData({
                        businessName: data.businessName,
                        description: data.description,
                        logo: data.logo,
                        category: data.category,
                        location: data.location,
                        contactEmail: data.contactEmail,
                        contactPhone: data.contactPhone
                    });
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProfile();
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplier) return;

        setIsSaving(true);
        try {
            await supplierService.updateSupplierProfile(supplier.id, formData);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to save profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">Business Profile</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    This information will be shown to guests browsing your offers
                </p>
            </div>

            {showSuccess && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <span className="material-symbols-outlined">check_circle</span>
                        <span className="font-medium">Profile saved successfully!</span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                {/* Logo Preview */}
                <div className="flex items-center gap-6">
                    <div
                        className="size-24 rounded-xl bg-cover bg-center bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                        style={{ backgroundImage: formData.logo ? `url(${formData.logo})` : undefined }}
                    >
                        {!formData.logo && (
                            <span className="material-symbols-outlined text-4xl text-gray-400">storefront</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Logo URL
                        </label>
                        <input
                            type="url"
                            value={formData.logo}
                            onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                            className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {/* Business Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Business Name *
                    </label>
                    <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500 resize-none"
                        placeholder="Tell guests about your business..."
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as OfferCategory }))}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        placeholder="e.g., Bennettsbridge, Co. Kilkenny"
                    />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Contact Email
                        </label>
                        <input
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                            className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Contact Phone
                        </label>
                        <input
                            type="tel"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                            className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};
