import React, { useState } from 'react';
import type { CreateSeasonalPricingRuleRequest } from '../../types/booking';

const LOT_TYPES = [
    { value: 'TENT', label: 'Tent Pitch' },
    { value: 'TOURING', label: 'Touring Pitch' },
    { value: 'GLAMPING', label: 'Glamping' },
    { value: 'CABIN', label: 'Cabin & Lodge' },
    { value: 'MOBILE_HOME', label: 'Mobile Home' },
];

interface PricingRuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateSeasonalPricingRuleRequest) => Promise<void>;
}

export const PricingRuleModal: React.FC<PricingRuleModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [lotType, setLotType] = useState('');
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [pricePerNight, setPricePerNight] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!lotType || !name || !startDate || !endDate || !pricePerNight) {
            setError('Please fill in all required fields');
            return;
        }

        const price = parseFloat(pricePerNight);
        if (isNaN(price) || price <= 0) {
            setError('Price must be a positive number');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                lotType,
                name,
                startDate,
                endDate,
                pricePerNight: price,
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create pricing rule');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-md mx-4 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white">Add Pricing Rule</h2>
                    <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                        <span className="material-symbols-outlined text-gray-400">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Lot Type *</label>
                        <select
                            value={lotType}
                            onChange={e => setLotType(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                            required
                        >
                            <option value="">Select a lot type</option>
                            {LOT_TYPES.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Rule Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g., Summer Peak, Bank Holiday"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Start Date *</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">End Date *</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                min={startDate}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Price Per Night *</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">&euro;</span>
                            <input
                                type="number"
                                value={pricePerNight}
                                onChange={e => setPricePerNight(e.target.value)}
                                placeholder="0.00"
                                min="0.01"
                                step="0.01"
                                className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : 'Add Rule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
