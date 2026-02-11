import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminBookingService } from '../../services/adminService';
import { AdminStatusBadge } from '../../components/admin/shared/AdminStatusBadge';
import { AdminConfirmModal } from '../../components/admin/shared/AdminConfirmModal';
import type { AdminBooking } from '../../types/admin';

export const AdminBookingDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<AdminBooking | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCancel, setShowCancel] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        adminBookingService.get(Number(id))
            .then(setBooking)
            .catch(() => navigate('/admin/bookings'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const handleCancel = async () => {
        if (!booking) return;
        const updated = await adminBookingService.cancel(booking.id, 'Cancelled by admin');
        setBooking(updated);
    };

    if (loading || !booking) {
        return <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>;
    }

    const fields = [
        { label: 'Booking ID', value: `#${booking.id}` },
        { label: 'Status', value: <AdminStatusBadge status={booking.status} /> },
        { label: 'Payment', value: <AdminStatusBadge status={booking.paymentStatus || 'NONE'} /> },
        { label: 'Guest', value: booking.guestName || booking.userName },
        { label: 'Email', value: booking.guestEmail || booking.userEmail },
        { label: 'Property', value: `${booking.lotName} (${booking.ownerName})` },
        { label: 'Check-in', value: new Date(booking.checkInDate).toLocaleDateString() },
        { label: 'Check-out', value: new Date(booking.checkOutDate).toLocaleDateString() },
        { label: 'Guests', value: booking.numGuests },
        { label: 'Total Price', value: `€${booking.totalPrice?.toFixed(2)}` },
        { label: 'Service Fee', value: booking.serviceFee ? `€${booking.serviceFee.toFixed(2)}` : 'N/A' },
        { label: 'Source', value: booking.bookingSource },
        { label: 'Special Requests', value: booking.specialRequests || 'None' },
        { label: 'Created', value: new Date(booking.createdAt).toLocaleString() },
    ];

    return (
        <div className="space-y-6 max-w-3xl">
            <button onClick={() => navigate('/admin/bookings')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Bookings
            </button>

            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#111418] dark:text-white">Booking #{booking.id}</h2>
                    {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                        <button onClick={() => setShowCancel(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors">
                            Cancel Booking
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.map(({ label, value }) => (
                        <div key={label}>
                            <p className="text-xs text-gray-400 mb-1">{label}</p>
                            <div className="text-sm text-[#111418] dark:text-white">{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            <AdminConfirmModal isOpen={showCancel} onClose={() => setShowCancel(false)} onConfirm={handleCancel}
                title="Cancel Booking" message={`Cancel booking #${booking.id}? This action cannot be undone.`} confirmLabel="Cancel Booking" isDestructive />
        </div>
    );
};
