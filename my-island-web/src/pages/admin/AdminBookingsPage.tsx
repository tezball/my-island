import React, { useEffect, useState } from 'react';
import { adminService, type Booking } from '../../services/adminService';

export const AdminBookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setIsLoading(true);
        try {
            const data = await adminService.getBookings();
            setBookings(data);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: Booking['status']) => {
        try {
            await adminService.updateBookingStatus(id, newStatus);
            setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    if (isLoading) return <div>Loading bookings...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-[#111418] dark:text-white mb-6">Bookings</h1>

            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Guest</th>
                                <th className="px-6 py-3">Lot</th>
                                <th className="px-6 py-3">Dates</th>
                                <th className="px-6 py-3">Total</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{booking.id}</td>
                                    <td className="px-6 py-4 font-medium text-[#111418] dark:text-white">{booking.userName}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{booking.lotName}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                        {(() => {
                                            // Handle various date formats safely
                                            const formatDate = (dateStr: string) => {
                                                if (dateStr.includes('/')) return dateStr; // Already formatted
                                                return new Date(dateStr).toLocaleDateString('en-GB'); // Convert ISO to DD/MM/YYYY
                                            };
                                            return `${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}`;
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 font-medium">€{booking.totalPrice}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                                        className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                                                        title="Approve"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        title="Reject"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">cancel</span>
                                                    </button>
                                                </>
                                            )}
                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    title="Cancel Booking"
                                                >
                                                    <span className="material-symbols-outlined text-lg">block</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
