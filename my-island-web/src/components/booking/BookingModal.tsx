import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lot } from '../../types/booking';
import { useAuth } from '../../context/AuthContext';
import { campsiteService } from '../../services/campsiteService';
import { DateInput } from '../ui/DateInput';

interface BookingModalProps {
    lot: Lot;
    isOpen: boolean;
    onClose: () => void;
    typeLabel?: string; // Display name for accommodation type (e.g., "Tent Spot")
    minPrice?: number; // Minimum price for grouped accommodation types
}

interface BookingConfirmation {
    bookingId: string;
    lotName: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    totalPrice: number;
    guestName: string;
    details?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ lot, isOpen, onClose, typeLabel, minPrice }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [wantsPower, setWantsPower] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Handle escape key to close modal
    const handleEscapeKey = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleEscapeKey]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setStartDate('');
            setEndDate('');
            setWantsPower(false);
            setConfirmation(null);
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    // Handle start date change - clear end date if it's before the new start date
    const handleStartDateChange = (newStartDate: string) => {
        setStartDate(newStartDate);
        // If end date is before or equal to new start date, clear it
        if (endDate && newStartDate >= endDate) {
            setEndDate('');
        }
    };

    // Calculate minimum check-out date (day after check-in)
    const getMinCheckoutDate = () => {
        if (!startDate) return undefined;
        const nextDay = new Date(startDate);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay.toISOString().split('T')[0];
    };

    // Format date to DD/MM/YYYY
    const formatDate = (isoStr: string) => {
        if (!isoStr) return '';
        const [y, m, d] = isoStr.split('-');
        return `${d}/${m}/${y}`;
    };

    const days = calculateDays();
    const isTent = lot.type === 'tent';
    const powerCost = isTent && wantsPower ? 5 : 0;
    const pricePerNight = lot.pricePerNight + powerCost;
    const totalPrice = days * pricePerNight;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError('Please sign in to book.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await campsiteService.createBooking({
                userId: user.id,
                userName: user.name,
                lotId: lot.id,
                lotName: lot.name,
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                totalPrice,
                details: isTent && wantsPower ? 'Includes Power Hookup (+€5/night)' : undefined
            });

            // Generate a mock booking ID
            const bookingId = `BK-${Date.now().toString(36).toUpperCase()}`;

            // Set confirmation data
            setConfirmation({
                bookingId,
                lotName: lot.name,
                checkIn: formatDate(startDate),
                checkOut: formatDate(endDate),
                nights: days,
                totalPrice,
                guestName: user.name,
                details: isTent && wantsPower ? 'Includes Power Hookup (+€5/night)' : undefined
            });
        } catch (err) {
            console.error('Booking failed:', err);
            setError('Failed to submit booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle backdrop click to close modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only close if clicking the backdrop itself, not the modal content
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Confirmation View
    if (confirmation) {
        return (
            <div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={handleBackdropClick}
            >
                <div
                    className="bg-white dark:bg-[#1a2632] rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    {/* Success Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center mb-2 text-[#111418] dark:text-white">
                        Booking Confirmed!
                    </h2>
                    <p className="text-gray-500 text-sm text-center mb-6">
                        Your reservation has been successfully submitted
                    </p>

                    {/* Booking Reference */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                        <div className="text-center">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">Booking Reference</span>
                            <p className="text-xl font-bold text-primary mt-1">{confirmation.bookingId}</p>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
                        <h3 className="font-semibold text-[#111418] dark:text-white mb-3">Booking Summary</h3>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Accommodation</span>
                            <span className="text-sm font-medium text-[#111418] dark:text-white">{confirmation.lotName}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Guest</span>
                            <span className="text-sm font-medium text-[#111418] dark:text-white">{confirmation.guestName}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Check-in</span>
                            <span className="text-sm font-medium text-[#111418] dark:text-white">{confirmation.checkIn}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Check-out</span>
                            <span className="text-sm font-medium text-[#111418] dark:text-white">{confirmation.checkOut}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                            <span className="text-sm font-medium text-[#111418] dark:text-white">{confirmation.nights} night{confirmation.nights > 1 ? 's' : ''}</span>
                        </div>

                        {confirmation.details && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Extras</span>
                                <span className="text-sm font-medium text-[#111418] dark:text-white flex items-center gap-1">
                                    <span className="material-symbols-outlined text-yellow-500 text-sm">bolt</span>
                                    Electric Hookup
                                </span>
                            </div>
                        )}

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-[#111418] dark:text-white">Total Paid</span>
                                <span className="text-xl font-bold text-primary">€{confirmation.totalPrice}</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="flex items-start gap-2 mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="material-symbols-outlined text-blue-500 text-sm mt-0.5">info</span>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            A confirmation email has been sent to your registered email address with all the details.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-[#111418] dark:text-white font-semibold py-3 rounded-xl transition-all"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                navigate('/trips');
                            }}
                            className="flex-1 bg-primary hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all shadow-md"
                        >
                            View My Trips
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Booking Form View
    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white dark:bg-[#1a2632] rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <h2 className="text-2xl font-bold mb-1 text-[#111418] dark:text-white">Book {typeLabel || lot.name}</h2>
                <p className="text-gray-500 text-sm mb-6">
                    {minPrice && minPrice < lot.pricePerNight ? `From €${minPrice}` : `€${lot.pricePerNight}`} per night
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-in</label>
                            <DateInput
                                required
                                className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                                value={startDate}
                                onChange={handleStartDateChange}
                                placeholder="Select date"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-out</label>
                            <DateInput
                                required
                                className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                                value={endDate}
                                onChange={setEndDate}
                                minDate={getMinCheckoutDate()}
                                placeholder="Select date"
                            />
                        </div>
                    </div>

                    {lot.type === 'tent' && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                            <input
                                type="checkbox"
                                id="powerOption"
                                checked={wantsPower}
                                onChange={(e) => setWantsPower(e.target.checked)}
                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                            <div className="flex flex-col">
                                <label htmlFor="powerOption" className="text-sm font-medium text-[#111418] dark:text-white">Add Electric Hookup</label>
                                <span className="text-xs text-gray-500">+€5 per night</span>
                            </div>
                            <span className="material-symbols-outlined text-yellow-500 ml-auto">bolt</span>
                        </div>
                    )}

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                        {(startDate && endDate) && (
                            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Dates</span>
                                <span className="text-sm font-medium text-[#111418] dark:text-white">
                                    {new Date(startDate).toLocaleDateString('en-GB')} - {new Date(endDate).toLocaleDateString('en-GB')}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-300 font-medium">Total Price ({days} nights)</span>
                            <span className="text-xl font-bold text-primary">€{totalPrice}</span>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </div>
                    )}

                    {!user && (
                        <div className="text-amber-600 text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">warning</span>
                            You must be signed in to book.
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || !user || days === 0}
                        className="w-full bg-primary hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2"
                    >
                        {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
};
