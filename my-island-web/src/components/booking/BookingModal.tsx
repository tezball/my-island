import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lot, Booking } from '../../types/booking';
import { useAuth } from '../../context/AuthContext';
import { campsiteService } from '../../services/campsiteService';
import { AvailabilityCalendar } from '../ui/AvailabilityCalendar';
import { PaymentForm } from './PaymentForm';

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
    serviceFee: number;
    chargeTotal: number;
    guestName: string;
    details?: string;
}

type ModalStep = 'booking' | 'payment' | 'confirmation';

export const BookingModal: React.FC<BookingModalProps> = ({ lot, isOpen, onClose, typeLabel, minPrice }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState<ModalStep>('booking');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [wantsPower, setWantsPower] = useState(false);
    const [specialRequests, setSpecialRequests] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
    const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [bookedDates, setBookedDates] = useState<Array<{ checkIn: string; checkOut: string }>>([]);
    const [isLoadingDates, setIsLoadingDates] = useState(false);

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
            setStep('booking');
            setStartDate('');
            setEndDate('');
            setWantsPower(false);
            setSpecialRequests('');
            setCreatedBooking(null);
            setConfirmation(null);
            setError(null);
            setIsAvailable(null);
            setBookedDates([]);
        }
    }, [isOpen]);

    // Fetch booked dates when modal opens
    useEffect(() => {
        const fetchBookedDates = async () => {
            if (!isOpen || !lot.id) return;

            setIsLoadingDates(true);
            try {
                const dates = await campsiteService.getBookedDates(lot.id);
                setBookedDates(dates);
            } catch (err) {
                console.error('Failed to fetch booked dates:', err);
                // Don't block the modal if this fails
            } finally {
                setIsLoadingDates(false);
            }
        };

        fetchBookedDates();
    }, [isOpen, lot.id]);

    // Check availability when dates change
    useEffect(() => {
        const checkAvailability = async () => {
            if (!startDate || !endDate || !lot.ownerId) {
                setIsAvailable(null);
                return;
            }

            setIsCheckingAvailability(true);
            setError(null);

            try {
                const checkIn = new Date(startDate);
                const checkOut = new Date(endDate);
                const availableLots = await campsiteService.getAvailableLots(
                    lot.ownerId,
                    checkIn,
                    checkOut
                );
                const lotIsAvailable = availableLots.some(availableLot => availableLot.id === lot.id);
                setIsAvailable(lotIsAvailable);

                if (!lotIsAvailable) {
                    setError('This accommodation is not available for the selected dates. Please choose different dates.');
                }
            } catch (err) {
                console.error('Failed to check availability:', err);
                // Don't block booking if availability check fails - backend will validate
                setIsAvailable(null);
            } finally {
                setIsCheckingAvailability(false);
            }
        };

        checkAvailability();
    }, [startDate, endDate, lot.id, lot.ownerId]);

    if (!isOpen) return null;

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    // Handle date selection from calendar
    // First click = check-in, second click = check-out
    const handleDateSelect = (date: string) => {
        setError(null);
        setIsAvailable(null);

        if (!startDate || (startDate && endDate)) {
            // No dates selected OR both dates selected - start fresh with check-in
            setStartDate(date);
            setEndDate('');
        } else if (startDate && !endDate) {
            // Check-in selected, now selecting check-out
            if (date <= startDate) {
                // If selected date is before or same as check-in, make it the new check-in
                setStartDate(date);
            } else {
                // Set as check-out
                setEndDate(date);
            }
        }
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

        const powerDetails = isTent && wantsPower ? 'Includes Power Hookup (+€5/night)' : '';
        const combinedDetails = [powerDetails, specialRequests].filter(Boolean).join('\n');

        try {
            const booking = await campsiteService.createBooking({
                userId: user.id,
                userName: user.name,
                lotId: lot.id,
                lotName: lot.name,
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                totalPrice,
                details: combinedDetails || undefined
            }, { wantsPower: isTent && wantsPower });

            // Store the created booking and move to payment step
            setCreatedBooking(booking);
            setStep('payment');
        } catch (err) {
            console.error('Booking failed:', err);
            // Show specific error message from API if available
            const errorMessage = err instanceof Error ? err.message : 'Failed to submit booking. Please try again.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaymentSuccess = () => {
        if (!createdBooking || !user) return;

        // Set confirmation data
        setConfirmation({
            bookingId: createdBooking.id,
            lotName: lot.name,
            checkIn: formatDate(startDate),
            checkOut: formatDate(endDate),
            nights: days,
            totalPrice: createdBooking.totalPrice,
            serviceFee: createdBooking.serviceFee || 0,
            chargeTotal: createdBooking.chargeTotal || createdBooking.totalPrice,
            guestName: user.name,
            details: createdBooking.details
        });
        setStep('confirmation');
    };

    const handlePaymentError = (errorMsg: string) => {
        setError(errorMsg);
    };

    const handlePaymentCancel = () => {
        // Go back to booking step
        setStep('booking');
        setCreatedBooking(null);
    };

    // Confirmation view
    if (step === 'confirmation' && confirmation) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl text-green-600">check_circle</span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">Payment Authorized!</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Your card has been authorized. You'll only be charged when the owner confirms your booking.
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Booking ID</span>
                                <span className="font-medium text-[#111418] dark:text-white">#{confirmation.bookingId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Location</span>
                                <span className="font-medium text-[#111418] dark:text-white">{confirmation.lotName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Check-in</span>
                                <span className="font-medium text-[#111418] dark:text-white">{confirmation.checkIn}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Check-out</span>
                                <span className="font-medium text-[#111418] dark:text-white">{confirmation.checkOut}</span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Accommodation ({confirmation.nights} nights)</span>
                                    <span className="text-gray-700 dark:text-gray-300">€{confirmation.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Service fee</span>
                                    <span className="text-gray-700 dark:text-gray-300">€{confirmation.serviceFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Authorized amount</span>
                                    <span className="font-bold text-primary text-lg">€{confirmation.chargeTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-6">
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined text-xs align-middle mr-1">info</span>
                                The owner will review your booking. If confirmed, your card will be charged. If declined, the authorization will be released.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#111418] dark:text-white font-medium py-3 rounded-xl transition-all"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => navigate('/trips')}
                                className="flex-1 bg-primary hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition-all"
                            >
                                View My Trips
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Payment step view
    if (step === 'payment' && createdBooking) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePaymentCancel}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <span className="material-symbols-outlined text-gray-500">arrow_back</span>
                            </button>
                            <h2 className="text-xl font-bold text-[#111418] dark:text-white">Secure Payment</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-gray-500">close</span>
                        </button>
                    </div>

                    {/* Booking Summary */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">calendar_month</span>
                            <div>
                                <p className="font-medium text-[#111418] dark:text-white">{typeLabel || lot.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatDate(startDate)} - {formatDate(endDate)} ({days} nights) &middot; €{totalPrice}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="p-4">
                        <PaymentForm
                            bookingId={createdBooking.id}
                            onPaymentSuccess={handlePaymentSuccess}
                            onPaymentError={handlePaymentError}
                            onCancel={handlePaymentCancel}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Booking form view
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#111418] dark:text-white">Book Your Stay</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-gray-500">close</span>
                    </button>
                </div>

                {/* Lot Info */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-semibold text-[#111418] dark:text-white">{typeLabel || lot.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        From €{minPrice || lot.pricePerNight}/night
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Date Selection Calendar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Select Dates
                        </label>
                        {isLoadingDates ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <AvailabilityCalendar
                                bookedDates={bookedDates}
                                selectedCheckIn={startDate}
                                selectedCheckOut={endDate}
                                onDateSelect={handleDateSelect}
                            />
                        )}
                        {/* Date selection hint */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {!startDate
                                ? 'Tap a date to select check-in'
                                : !endDate
                                    ? 'Now tap a date for check-out'
                                    : 'Tap any date to start over'}
                        </p>
                    </div>

                    {/* Power Option for Tents */}
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

                    {/* Special Requests */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Requests</label>
                        <textarea
                            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                            rows={3}
                            placeholder="Any special requests? (e.g. near amenities, quiet area)"
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                        />
                    </div>

                    {/* Price Summary */}
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
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            + service fee calculated at checkout
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </div>
                    )}

                    {/* Sign-in Warning */}
                    {!user && (
                        <div className="text-amber-600 text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">warning</span>
                            You must be signed in to book.
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !user || days === 0 || isAvailable === false || isCheckingAvailability}
                        className="w-full bg-primary hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2"
                    >
                        {isCheckingAvailability ? 'Checking availability...' : isSubmitting ? 'Processing...' : 'Continue to Payment'}
                    </button>
                </form>
            </div>
        </div>
    );
};
