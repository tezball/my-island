import React, { useEffect, useState, useMemo } from 'react';
import { adminService, type Booking } from '../../services/adminService';

const ITEMS_PER_PAGE = 15;

export const AdminBookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadBookings();
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter]);

    // Filter bookings based on search and status
    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            // Search filter (guest name or lot name)
            const matchesSearch = searchQuery === '' ||
                booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.lotName.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter
            const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [bookings, searchQuery, statusFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
    const paginatedBookings = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredBookings.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredBookings, currentPage]);

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

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search Input */}
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
                    <input
                        type="text"
                        placeholder="Search by guest or lot name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1a2632] text-[#111418] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1a2632] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Showing {paginatedBookings.length} of {filteredBookings.length} bookings
                {filteredBookings.length !== bookings.length && ` (filtered from ${bookings.length})`}
            </p>

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
                            {paginatedBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
                                        No bookings found matching your criteria
                                    </td>
                                </tr>
                            ) : paginatedBookings.map((booking) => (
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
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                booking.status === 'checked_in' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                booking.status === 'completed' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400' :
                                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                            {booking.status === 'checked_in' ? 'Checked In' : booking.status}
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
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(booking.id, 'checked_in')}
                                                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                        title="Check In Guest"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">login</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        title="Cancel Booking"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">block</span>
                                                    </button>
                                                </>
                                            )}
                                            {booking.status === 'checked_in' && (
                                                <button
                                                    onClick={() => handleStatusChange(booking.id, 'completed')}
                                                    className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700/20"
                                                    title="Check Out Guest"
                                                >
                                                    <span className="material-symbols-outlined text-lg">logout</span>
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page
                                ? 'bg-primary text-white'
                                : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            )}
        </div>
    );
};
