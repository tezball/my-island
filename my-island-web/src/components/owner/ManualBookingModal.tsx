import React, { useState } from 'react';
import type { Lot } from '../../types/booking';

const BOOKING_SOURCES = [
    { value: 'DIRECT', label: 'Direct' },
    { value: 'PHONE', label: 'Phone' },
    { value: 'WALKIN', label: 'Walk-in' },
];

interface ManualBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        lotId: number;
        checkInDate: string;
        checkOutDate: string;
        numGuests: number;
        guestName: string;
        guestEmail?: string;
        guestPhone?: string;
        specialRequests?: string;
        bookingSource: string;
    }) => Promise<void>;
    lots: Lot[];
    preselectedDate?: string;
}

export const ManualBookingModal: React.FC<ManualBookingModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    lots,
    preselectedDate,
}) => {
    const [lotId, setLotId] = useState('');
    const [checkInDate, setCheckInDate] = useState(preselectedDate ?? '');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [numGuests, setNumGuests] = useState('1');
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [bookingSource, setBookingSource] = useState('DIRECT');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!lotId || !checkInDate || !checkOutDate || !guestName) {
            setError('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                lotId: Number(lotId),
                checkInDate,
                checkOutDate,
                numGuests: Number(numGuests) || 1,
                guestName,
                guestEmail: guestEmail || undefined,
                guestPhone: guestPhone || undefined,
                specialRequests: specialRequests || undefined,
                bookingSource,
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create booking');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-[#111418] dark:text-white">Create Booking</h2>
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
                            <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Check-in *</label>
                            <input
                                type="date"
                                value={checkInDate}
                                onChange={e => setCheckInDate(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Check-out *</label>
                            <input
                                type="date"
                                value={checkOutDate}
                                onChange={e => setCheckOutDate(e.target.value)}
                                min={checkInDate}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Guests</label>
                            <input
                                type="number"
                                value={numGuests}
                                onChange={e => setNumGuests(e.target.value)}
                                min="1"
                                max="20"
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Source</label>
                            <select
                                value={bookingSource}
                                onChange={e => setBookingSource(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                            >
                                {BOOKING_SOURCES.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                        <h3 className="text-sm font-medium text-[#111418] dark:text-white mb-3">Guest Details</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={guestName}
                                    onChange={e => setGuestName(e.target.value)}
                                    placeholder="Guest name"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={guestEmail}
                                        onChange={e => setGuestEmail(e.target.value)}
                                        placeholder="guest@example.com"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={guestPhone}
                                        onChange={e => setGuestPhone(e.target.value)}
                                        placeholder="08X XXX XXXX"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2632] text-sm text-[#111418] dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#111418] dark:text-white mb-1">Special Requests</label>
                        <textarea
                            value={specialRequests}
                            onChange={e => setSpecialRequests(e.target.value)}
                            placeholder="Any special requirements..."
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
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
