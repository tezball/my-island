import React, { useState } from 'react';
import type { Lot, CreateBlockedPeriodRequest } from '../../types/booking';

interface BlockDatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateBlockedPeriodRequest) => Promise<void>;
    lots: Lot[];
    preselectedDate?: string;
}

export const BlockDatesModal: React.FC<BlockDatesModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    lots,
    preselectedDate,
}) => {
    const [lotId, setLotId] = useState('');
    const [startDate, setStartDate] = useState(preselectedDate ?? '');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!lotId || !startDate || !endDate) {
            setError('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                lotId: Number(lotId),
                startDate,
                endDate,
                reason: reason || undefined,
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to block dates');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-md mx-4 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white">Block Dates</h2>
                    <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                        <span className="material-symbols-outlined text-gray-400">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Lot *</label>
                        <select
                            value={lotId}
                            onChange={e => setLotId(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                            required
                        >
                            <option value="">Select a lot</option>
                            {lots.map(lot => (
                                <option key={lot.id} value={lot.id}>{lot.name}</option>
                            ))}
                        </select>
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
                        <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Reason</label>
                        <input
                            type="text"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="e.g., Maintenance, Private event"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                        />
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
                            {isSubmitting ? 'Blocking...' : 'Block Dates'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
