import React, { useState } from 'react';
import type { Lot } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { campsiteService } from '../../services/campsiteService';
import { DateInput } from '../ui/DateInput';

interface BookingModalProps {
    lot: Lot;
    isOpen: boolean;
    onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ lot, isOpen, onClose }) => {
    const { user } = useAuth();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [wantsPower, setWantsPower] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const days = calculateDays();
    const isTent = lot.type === 'tent';
    const powerCost = isTent && wantsPower ? 5 : 0;
    const pricePerNight = lot.pricePerNight + powerCost;
    const totalPrice = days * pricePerNight;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('Please sign in to book.');
            return;
        }

        setIsSubmitting(true);
        // Format dates to DD/MM/YYYY
        const formatDate = (isoStr: string) => {
            if (!isoStr) return '';
            const [y, m, d] = isoStr.split('-');
            return `${d}/${m}/${y}`;
        };

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
            alert('Booking request sent successfully!');
            onClose();
            // Reset state
            setStartDate('');
            setEndDate('');
            setWantsPower(false);
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Failed to submit booking.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1a2632] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <h2 className="text-2xl font-bold mb-1 text-[#111418] dark:text-white">Book {lot.name}</h2>
                <p className="text-gray-500 text-sm mb-6">€{lot.pricePerNight} per night</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-in</label>
                            <input
                                type="date"
                                required
                                className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-out</label>
                            <input
                                type="date"
                                required
                                className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
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

                    {!user && (
                        <div className="text-amber-600 text-sm bg-amber-50 p-2 rounded-lg flex items-center gap-2">
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
