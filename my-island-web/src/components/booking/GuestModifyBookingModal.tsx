import React, { useState, useEffect } from 'react';
import { campsiteService } from '../../services/campsiteService';
import type { Booking, Lot, GuestModificationPolicy } from '../../types/booking';

interface GuestModifyBookingModalProps {
    booking: Booking;
    policy: GuestModificationPolicy;
    onClose: () => void;
    onSuccess: (updatedBooking: Booking) => void;
    onRequestSubmitted: () => void;
}

export const GuestModifyBookingModal: React.FC<GuestModifyBookingModalProps> = ({
    booking, policy, onClose, onSuccess, onRequestSubmitted,
}) => {
    const [lots, setLots] = useState<Lot[]>([]);
    const [selectedLotId, setSelectedLotId] = useState<string>(booking.lotId);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [wantsPower, setWantsPower] = useState(false);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Parse DD/MM/YYYY to YYYY-MM-DD for input
    const toIsoDate = (dateStr: string): string => {
        const [d, m, y] = dateStr.split('/');
        return `${y}-${m}-${d}`;
    };

    useEffect(() => {
        setCheckInDate(toIsoDate(booking.startDate));
        setCheckOutDate(toIsoDate(booking.endDate));
    }, [booking]);

    // Fetch available lots for the campsite
    useEffect(() => {
        const fetchLots = async () => {
            if (!booking.lotId) return;
            try {
                // Get the lot to find the owner, then get all lots
                const lot = await campsiteService.getLotById(booking.lotId);
                if (lot?.ownerId) {
                    const allLots = await campsiteService.getCampsiteLots(lot.ownerId);
                    setLots(allLots.filter(l => l.isAvailable));
                }
            } catch (err) {
                console.error('Failed to fetch lots:', err);
            }
        };
        fetchLots();
    }, [booking.lotId]);

    const hasChanges = () => {
        const origCheckIn = toIsoDate(booking.startDate);
        const origCheckOut = toIsoDate(booking.endDate);
        return selectedLotId !== booking.lotId
            || checkInDate !== origCheckIn
            || checkOutDate !== origCheckOut
            || wantsPower;
    };

    const selectedLot = lots.find(l => l.id === selectedLotId);
    const isTentLot = selectedLot?.type === 'tent';

    const handleSubmit = async () => {
        if (!hasChanges()) {
            setError('No changes specified');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const origCheckIn = toIsoDate(booking.startDate);
            const origCheckOut = toIsoDate(booking.endDate);

            const data: {
                lotId?: number;
                checkInDate?: string;
                checkOutDate?: string;
                wantsPower?: boolean;
                reason?: string;
            } = {};

            if (selectedLotId !== booking.lotId) {
                data.lotId = parseInt(selectedLotId, 10);
            }
            if (checkInDate !== origCheckIn) {
                data.checkInDate = checkInDate;
            }
            if (checkOutDate !== origCheckOut) {
                data.checkOutDate = checkOutDate;
            }
            if (wantsPower && isTentLot) {
                data.wantsPower = true;
            }
            if (reason.trim()) {
                data.reason = reason.trim();
            }

            const updated = await campsiteService.guestModifyBooking(booking.id, data);

            if (policy.requiresApproval) {
                onRequestSubmitted();
            } else {
                onSuccess(updated);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit modification');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-primary text-white p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold mb-1">Modify Booking</h2>
                            <p className="text-white/80 text-sm">{booking.lotName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5 overflow-y-auto">
                    {policy.requiresApproval && (
                        <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg">
                            <span className="material-symbols-outlined text-amber-600 text-lg mt-0.5">info</span>
                            <p className="text-sm text-amber-800 dark:text-amber-300">
                                This change will be sent to the property for approval. Your original booking remains active until approved.
                            </p>
                        </div>
                    )}

                    {/* Current Booking Summary */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Current Booking</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-gray-500">Check-in:</span>
                                <span className="ml-1 font-medium text-[#111418] dark:text-white">{booking.startDate}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Check-out:</span>
                                <span className="ml-1 font-medium text-[#111418] dark:text-white">{booking.endDate}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-gray-500">Total:</span>
                                <span className="ml-1 font-medium text-primary">&euro;{booking.totalPrice}</span>
                            </div>
                        </div>
                    </div>

                    {/* Lot Selection */}
                    {lots.length > 1 && (
                        <div>
                            <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1.5">Lot</label>
                            <select
                                value={selectedLotId}
                                onChange={e => setSelectedLotId(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                {lots.map(lot => (
                                    <option key={lot.id} value={lot.id}>
                                        {lot.name} - {lot.type} (&euro;{lot.pricePerNight}/night)
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Date Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1.5">Check-in</label>
                            <input
                                type="date"
                                value={checkInDate}
                                onChange={e => setCheckInDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1.5">Check-out</label>
                            <input
                                type="date"
                                value={checkOutDate}
                                onChange={e => setCheckOutDate(e.target.value)}
                                min={checkInDate || new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Power Toggle (tent lots only) */}
                    {isTentLot && (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#111418] dark:text-white">Electric Hookup</p>
                                <p className="text-xs text-gray-500">+&euro;5 per night</p>
                            </div>
                            <button
                                onClick={() => setWantsPower(!wantsPower)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    wantsPower ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                            >
                                <span className={`inline-block size-4 transform rounded-full bg-white shadow-sm transition-transform ${
                                    wantsPower ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                            </button>
                        </div>
                    )}

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1.5">
                            Reason <span className="text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            rows={2}
                            placeholder="Why are you modifying this booking?"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 pt-0 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 text-sm font-semibold text-[#111418] dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !hasChanges()}
                        className="flex-1 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-emerald-600 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Submitting...
                            </>
                        ) : policy.requiresApproval ? (
                            'Submit Request'
                        ) : (
                            'Update Booking'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
