import React, { useState, useMemo } from 'react';
import type { Booking, Lot } from '../../types/booking';

interface ModifyBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking;
    lots: Lot[];
    onSubmit: (bookingId: string, data: {
        lotId?: number;
        checkInDate?: string;
        checkOutDate?: string;
        reason?: string;
    }) => Promise<void>;
}

export const ModifyBookingModal: React.FC<ModifyBookingModalProps> = ({
    isOpen,
    onClose,
    booking,
    lots,
    onSubmit,
}) => {
    const [lotId, setLotId] = useState(booking.lotId);
    const [checkInDate, setCheckInDate] = useState(toInputDate(booking.startDate));
    const [checkOutDate, setCheckOutDate] = useState(toInputDate(booking.endDate));
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const hasChanges = useMemo(() => {
        return lotId !== booking.lotId ||
            checkInDate !== toInputDate(booking.startDate) ||
            checkOutDate !== toInputDate(booking.endDate);
    }, [lotId, checkInDate, checkOutDate, booking]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!hasChanges) {
            setError('No changes to save');
            return;
        }

        setIsSubmitting(true);
        try {
            const data: {
                lotId?: number;
                checkInDate?: string;
                checkOutDate?: string;
                reason?: string;
            } = {};

            if (lotId !== booking.lotId) {
                data.lotId = Number(lotId);
            }
            if (checkInDate !== toInputDate(booking.startDate)) {
                data.checkInDate = checkInDate;
            }
            if (checkOutDate !== toInputDate(booking.endDate)) {
                data.checkOutDate = checkOutDate;
            }
            if (reason.trim()) {
                data.reason = reason.trim();
            }

            await onSubmit(booking.id, data);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to modify booking');
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentLot = lots.find(l => l.id === booking.lotId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white">Modify Booking</h2>
                    <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                        <span className="material-symbols-outlined text-gray-400">close</span>
                    </button>
                </div>

                {/* Current booking summary */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mb-5 text-sm">
                    <p className="font-medium text-[#111418] dark:text-white">{booking.userName}</p>
                    <p className="text-gray-500 dark:text-gray-400">
                        {currentLot?.name ?? booking.lotName} &middot; {booking.startDate} - {booking.endDate} &middot; <span className="font-medium text-primary">&euro;{booking.totalPrice}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Lot</label>
                        <select
                            value={lotId}
                            onChange={e => setLotId(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                        >
                            {lots.map(lot => (
                                <option key={lot.id} value={lot.id}>{lot.name} ({lot.type})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Check-in</label>
                            <input
                                type="date"
                                value={checkInDate}
                                onChange={e => setCheckInDate(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Check-out</label>
                            <input
                                type="date"
                                value={checkOutDate}
                                onChange={e => setCheckOutDate(e.target.value)}
                                min={checkInDate}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Reason (optional)</label>
                        <textarea
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="e.g. Guest requested date change"
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white resize-none"
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
                            disabled={isSubmitting || !hasChanges}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/**
 * Convert dd/MM/yyyy or yyyy-MM-dd to yyyy-MM-dd for <input type="date">.
 */
function toInputDate(dateStr: string): string {
    if (!dateStr) return '';
    // Already yyyy-MM-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    // dd/MM/yyyy
    const parts = dateStr.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
}
