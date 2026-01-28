import React, { useState, useEffect } from 'react';
import type { Offer, OfferCategory } from '../../../services/supplierService';

interface OfferFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    offer?: Offer | null;
    onSave: (offer: Omit<Offer, 'id' | 'claimCount' | 'createdAt'>) => Promise<void>;
    supplierId: string;
}

const CATEGORIES: { value: OfferCategory; label: string }[] = [
    { value: 'FOOD', label: 'Food & Drink' },
    { value: 'ACTIVITIES', label: 'Activities' },
    { value: 'GEAR', label: 'Gear Rental' },
    { value: 'ATTRACTIONS', label: 'Attractions' },
    { value: 'TRANSPORT', label: 'Transport' }
];

export const OfferFormModal: React.FC<OfferFormModalProps> = ({
    isOpen,
    onClose,
    offer,
    onSave,
    supplierId
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'FOOD' as OfferCategory,
        discountPercent: 10,
        validFrom: '',
        validUntil: '',
        maxClaims: '' as string | number,
        terms: '',
        imageUrl: '',
        active: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEditMode = !!offer;

    useEffect(() => {
        if (isOpen) {
            if (offer) {
                setFormData({
                    title: offer.title,
                    description: offer.description,
                    category: offer.category,
                    discountPercent: offer.discountPercent,
                    validFrom: offer.validFrom,
                    validUntil: offer.validUntil,
                    maxClaims: offer.maxClaims ?? '',
                    terms: offer.terms,
                    imageUrl: offer.imageUrl || '',
                    active: offer.active
                });
            } else {
                const today = new Date().toISOString().split('T')[0];
                const nextMonth = new Date();
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setFormData({
                    title: '',
                    description: '',
                    category: 'FOOD',
                    discountPercent: 10,
                    validFrom: today,
                    validUntil: nextMonth.toISOString().split('T')[0],
                    maxClaims: '',
                    terms: '',
                    imageUrl: '',
                    active: true
                });
            }
            setErrors({});
        }
    }, [isOpen, offer]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!formData.validFrom) {
            newErrors.validFrom = 'Start date is required';
        }
        if (!formData.validUntil) {
            newErrors.validUntil = 'End date is required';
        }
        if (formData.validFrom && formData.validUntil && formData.validFrom > formData.validUntil) {
            newErrors.validUntil = 'End date must be after start date';
        }
        if (!formData.terms.trim()) {
            newErrors.terms = 'Terms are required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSave({
                supplierId,
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category,
                discountPercent: formData.discountPercent,
                validFrom: formData.validFrom,
                validUntil: formData.validUntil,
                maxClaims: formData.maxClaims === '' ? null : Number(formData.maxClaims),
                terms: formData.terms.trim(),
                imageUrl: formData.imageUrl.trim() || undefined,
                active: formData.active
            });
            onClose();
        } catch (error) {
            console.error('Failed to save offer:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1a2632] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-[#111418] dark:text-white">
                        {isEditMode ? 'Edit Offer' : 'Create New Offer'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="p-6 space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Offer Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                                placeholder="e.g., 10% Off Fresh Produce"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500 resize-none"
                                placeholder="Describe what the offer includes..."
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        {/* Category & Discount */}
                        <div className="grid grid-cols-2 gap-4">
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Discount %
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.discountPercent}
                                    onChange={(e) => setFormData(prev => ({ ...prev, discountPercent: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                                />
                            </div>
                        </div>

                        {/* Valid Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Valid From *
                                </label>
                                <input
                                    type="date"
                                    value={formData.validFrom}
                                    onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                                />
                                {errors.validFrom && <p className="text-red-500 text-xs mt-1">{errors.validFrom}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Valid Until *
                                </label>
                                <input
                                    type="date"
                                    value={formData.validUntil}
                                    onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                                />
                                {errors.validUntil && <p className="text-red-500 text-xs mt-1">{errors.validUntil}</p>}
                            </div>
                        </div>

                        {/* Max Claims */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Max Claims (leave empty for unlimited)
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.maxClaims}
                                onChange={(e) => setFormData(prev => ({ ...prev, maxClaims: e.target.value }))}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                                placeholder="Unlimited"
                            />
                        </div>

                        {/* Terms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Terms & Conditions *
                            </label>
                            <textarea
                                value={formData.terms}
                                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                                rows={2}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500 resize-none"
                                placeholder="e.g., Valid once per customer. Cannot be combined with other offers."
                            />
                            {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Image URL
                            </label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                                placeholder="https://..."
                            />
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                                <p className="font-medium text-[#111418] dark:text-white">Active</p>
                                <p className="text-sm text-gray-500">Make this offer visible to guests</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-lime-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500"></div>
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2.5 text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Offer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
